# 后期合成流水线（本地 FFmpeg + PIL + Playwright）

> 适用：`examples/<slug>/` 下 N 段帧序列（模式 L）或 AI 片段（模式 V）+ N 句双音色 TTS + ASS 字幕，合成 720×1280 竖屏成片。
> 母版参照：`examples/manga-verify-mybatis/production/`（`gen_cards.py`、`anim_frames.py`、`build.sh`）。

## 1. 输入核对（模式 L）

| 素材 | 路径 | 规格 |
| --- | --- | --- |
| 人设插画 | `docs/manga/episodes/<slug>/assets/*.jpg` | 9:16，1536×2730 一档；双人全景 + 角色半身差分 |
| 代码卡片 | `production/cards/card*.png` | 720×1280，HTML 无头截图；HTML 入库，PNG gitignore |
| 帧序列 | `production/build/frames/<seg>/%04d.png` | 每段 N = 126 帧，25fps，720×1280 |
| 配音 | `production/voice/seg01.mp3 … segNN.mp3` | 单句时长 < 段长（5.057s） |
| 字幕 | `production/subtitles.ass` | PlayRes 720×1280，样式见第 7 节 |

合成前用 `ffprobe` 核对各段编码、分辨率、帧率一致；不一致时 concat demuxer 会花屏，需先统一重编码。

## 2. 本地代码卡片渲染（gen_cards.py）

- 卡片内容取自仓库真实源码（XML / Java / yml / SQL），不虚构代码。
- HTML 为深色 IDE 风格：标题栏（红黄绿圆点 + 文件名）、代码区（等宽 `Noto Sans Mono`）、注释栏；高亮行用 `.hl`，关键字 / 字符串 / 属性 / 注释分别上色。
- 截图用 Playwright + 本机 Chromium 无头模式：`executable_path="/usr/local/bin/chromium"`，viewport 720×1280，`device_scale_factor=1`，截全页 PNG 到 `production/cards/`。
- 供帧动效定位的 class 须在 HTML 里预先标好（如 `.hl`、`.kw`、`.note b`）；对比类卡片用左右两列布局（`.cols > .col`）。
- 卡片 HTML 入库；`cards/*.png` 由 gitignore 排除（可由脚本随时复现）。

## 3. 帧序列动效（anim_frames.py）

硬参数（基线）：

```text
FPS = 25
SEG = 5.057  # 秒
N   = round(FPS * SEG) = 126
W, H = 720, 1280
```

已验证动效清单：

- **开场全景段**：双人插画全幅缓慢推镜（缩放 1.00 → 1.06 一档）；PIL 绘制对白气泡（圆角矩形 + 尾巴，尾巴坐标按构图微调）。
- **代码段**：卡片高亮行淡入（不透明度随帧插值）；重点下划线逐段 stagger 展开；角色半身插画小窗滑入淡入 + 缓慢推镜。
- **角色小窗**：cover crop 取半身（竖向裁剪略偏上）；圆角 16px；角色色边框 + 顶部彩色名牌（角色名 + 对比色文字）。基线位置 `WIN_W=282, WIN_H=360, WIN_X=402, WIN_Y=600`。
- **段间**：0.3s 黑场淡入，避免硬切突兀。
- 帧输出到 `production/build/frames/<seg>/`，文件名 `%04d.png`；检查帧另存 `production/check*.jpg`（gitignore）。

## 4. 双音色配音（edge-tts）

| 角色 | 基线音色 | 基线语速 | 语气定位 |
| --- | --- | --- | --- |
| 女主林可 | `zh-CN-XiaoxiaoNeural` | `+6%` | 年轻灵动、松弛日常；疑惑 → 豁然 → 轻松，非播音腔 |
| 男工程师文哥 | `zh-CN-YunyangNeural` | 以人设卡为准 | 低沉温和、平稳稳重；资深同事感，不说教 |

- 逐句生成 mp3 到 `production/voice/segNN.mp3`；`ffprobe` 校验单句时长 < 段长；段内约 0.6s 起播、留尾。
- 单句语速可在该句 TTS 命令级临时覆盖；人设卡默认语速与音色跨集不变。
- 台词以 `production/subtitles.json` 为准（含 `speaker` 字段）；后期字幕以该文本为准，不被 ASR 覆盖。

## 5. 片段编码与拼接

- 帧序列编码（模式 L）：

```bash
ffmpeg -y -framerate 25 -i build/frames/<seg>/%04d.png \
  -vf "format=yuv420p" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p build/<seg>.mp4
```

- `production/build/concat.txt`（相对该文件所在目录写片段路径）：

```text
file 'f1.mp4'
file 'f2.mp4'
file 'f3.mp4'
file 'f4.mp4'
```

```bash
ffmpeg -y -f concat -safe 0 -i build/concat.txt \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p build/concat.mp4
```

## 6. 配音与提示音对齐

- 段起点毫秒：`start_i = (i - 1) × SEG × 1000`（SEG = 5057ms）。
- 人声 `adelay` = `start_i + 600`（段内 0.6s 起播）。
- 高亮提示音（该段有代码高亮时）`adelay` = 该段人声 `adelay` + 550ms（高亮在人声起播后 550ms 淡入）。
- 基线 4 段人声：`600 / 5657 / 10714 / 15771` ms；提示音：`6207 / 11264 / 16321` ms。
- 提示音：`ffmpeg -f lavfi -i "sine=frequency=880:duration=0.08:sample_rate=44100" -af "volume=0.08,afade=…" -ac 1 beep.wav`。
- `amix=inputs=K:duration=longest:dropout_transition=0,volume=1.6`；amix 默认归一化会压低音量，补约 `volume=1.6`。丢弃片段原生音轨，成片只保留配音 + 提示音。

## 7. ASS 字幕样式

```ass
[Script Info]
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans CJK SC,32,&H00FFFFFF,&H000000FF,&H00141414,&H80000000,0,0,0,0,100,100,0,0,1,2,1,2,40,40,170,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:05.057,Default,,0,0,0,,第一句台词
Dialogue: 0,0:00:05.057,0:00:10.114,Default,,0,0,0,,长句手动\N断两行
```

- 字体：`/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc`（Noto Sans CJK SC）；代码等宽 `/usr/share/fonts/truetype/noto/NotoSansMono-Regular.ttf`。
- 长句必须手动 `\N` 断两行或三行；SRT 长行不折行会左右出画，字幕一律走 ASS。
- 字幕时间轴按段边界：`0 / 5.057 / 10.114 / 15.171 …`。

## 8. 合成命令（build.sh 口径）

工作目录 `examples/<slug>/production/`：

```bash
ffmpeg -y -i build/concat.mp4 -i build/mix.m4a \
  -vf "subtitles=subtitles.ass" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ar 44100 final.mp4
```

混音前置（4 人声 + 3 提示音示例）：

```bash
ffmpeg -y -i voice/seg01.mp3 -i voice/seg02.mp3 -i voice/seg03.mp3 -i voice/seg04.mp3 \
  -i build/beep.wav -i build/beep.wav -i build/beep.wav \
  -filter_complex "\
[0:a]adelay=600|600[a0];[1:a]adelay=5657|5657[a1];[2:a]adelay=10714|10714[a2];[3:a]adelay=15771|15771[a3];\
[4:a]adelay=6207|6207[b1];[5:a]adelay=11264|11264[b2];[6:a]adelay=16321|16321[b3];\
[a0][a1][a2][a3][b1][b2][b3]amix=inputs=7:duration=longest:dropout_transition=0,volume=1.6[a]" \
  -map "[a]" -c:a aac -b:a 128k -ar 44100 build/mix.m4a
```

N 段时按第 6 节公式扩展输入、`adelay` 与 `amix=inputs=K`。成片复制到 `website/static/videos/<slug>.mp4`。

## 9. 校验与自检

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,channels \
  -of default=noprint_wrappers=1 ../../website/static/videos/<slug>.mp4
```

- 视频 h264、720×1280、25fps；音频 aac；时长 ≈ 段数 × 5.057s。
- 抽 1–2 帧检查字幕位置、人物一致性与画面（检查帧 `production/check*.jpg`，gitignore）。

## 10. 模式 V：AI 图生视频片段（备选，待验证）

- 片段工具 `image_to_video`；模型、时长、比例生成前按视频 Skill 要求展示并取得确认；片段静音。
- 每段携带人设参考图（双人全景 / 角色半身）；同一场景参考跨段复用，减少脸崩与空间漂移。
- Prompt 只写细微动作、表情、镜头运动；不写台词、配乐、人声、字幕、时长、比例、模型。
- 代码 B-roll 仍用第 2 节本地卡片，在后期叠加或插入片段之间；不让模型画编辑器。
- 片段下载 `examples/<slug>/segments/`（gitignore）；编码统一为 720×1280、25fps、yuv420p 后，按第 5–8 节同一后期流程合成。

## 11. 已知坑位

- 视频 / 生图 prompt 不写配乐、人声、字幕；声音与文字一律后期处理。
- `amix` 后可能为单声道；如需立体声，在配音轨补 `aformat=channel_layouts=stereo`。
- 本地 vm 无 GPU、无唇形同步包；不要安排角色对口型，台词走旁白 + 字幕。
- MediaKit 剪辑额度耗尽时走本地 FFmpeg 降级；额度恢复后可复用 `segments/` 或帧序列重合成，无需重新生成视频。
- 默认无 BGM（与已上线样板一致）；本地无 BGM 素材、edge-tts 不生成音乐。如需 BGM，在后期混入独立低音量音轨，不写入生成 prompt。
