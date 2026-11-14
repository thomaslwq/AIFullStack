# 后期合成流水线（本地 FFmpeg）

> 适用：`examples/<slug>/` 下 N 段 5 秒片段 + N 句 TTS + ASS 字幕，合成 720×1280 竖屏成片。
> 样板参照：`examples/manga-demo/production/母版.md`。

## 1. 输入核对

| 素材 | 路径 | 规格 |
| --- | --- | --- |
| 动态片段 | `segments/seg01.mp4 … segNN.mp4` | 720×1280，HEVC，yuv420p，AAC 44.1kHz |
| 配音 | `production/voice/seg01.mp3 … segNN.mp3` | 单句时长 < 段长（5s） |
| 字幕 | `production/subtitles.ass` | PlayRes 720×1280，样式见第 4 节 |

合成前用 `ffprobe` 核对各片段编码、分辨率、帧率一致；不一致时 concat demuxer 会花屏，需先统一重编码。

## 2. 拼接清单

`production/concat.txt`（相对该文件所在目录写片段路径）：

```text
file '../segments/seg01.mp4'
file '../segments/seg02.mp4'
file '../segments/seg03.mp4'
file '../segments/seg04.mp4'
```

## 3. 配音对齐

- 每段实际约 5.0417s；段内 0.6s 起播。
- 第 i 段配音 `adelay`（毫秒）= `(i - 1) × 5042 + 600`：

| 段 | adelay (ms) |
| --- | --- |
| seg01 | 600 |
| seg02 | 5642 |
| seg03 | 10683 |
| seg04 | 15725 |

- 4 路 `amix=inputs=4:duration=longest:dropout_transition=0`；amix 默认归一化会压低音量，补 `volume=1.6` 左右。
- 丢弃片段原生音轨，成片只保留配音轨。

## 4. ASS 字幕样式

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
Dialogue: 0,0:00:00.00,0:00:05.04,Default,,0,0,0,,第一句台词
Dialogue: 0,0:00:05.04,0:00:10.08,Default,,0,0,0,,长句手动\N断两行
```

- 字体：`/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc`（Noto Sans CJK SC）。
- 长句必须手动 `\N` 断两行或三行；SRT 长行不折行会左右出画，字幕一律走 ASS。
- 字幕时间轴按段边界：`0 / 5.04 / 10.08 / 15.12 …`。

## 5. 合成命令

工作目录 `examples/<slug>/`：

```bash
ffmpeg -y \
  -f concat -safe 0 -i production/concat.txt \
  -i production/voice/seg01.mp3 -i production/voice/seg02.mp3 \
  -i production/voice/seg03.mp3 -i production/voice/seg04.mp3 \
  -filter_complex "\
[0:v]subtitles=production/subtitles.ass[v];\
[1:a]adelay=600|600[a1];\
[2:a]adelay=5642|5642[a2];\
[3:a]adelay=10683|10683[a3];\
[4:a]adelay=15725|15725[a4];\
[a1][a2][a3][a4]amix=inputs=4:duration=longest:dropout_transition=0,volume=1.6[voice]" \
  -map "[v]" -map "[voice]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -shortest \
  ../../website/static/videos/<slug>.mp4
```

N 段时按第 3 节表扩展输入、`adelay` 与 `amix=inputs=N`。

## 6. 校验与自检

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,channels \
  -of default=noprint_wrappers=1 ../../website/static/videos/<slug>.mp4
```

- 视频 h264、720×1280；音频 aac；时长 ≈ 段数 × 5.04s。
- 抽 1–2 帧检查字幕位置、人物一致性与画面（检查帧命名 `production/check*.jpg`，gitignore）。

## 7. 已知坑位

- 视频生成 prompt 不写配乐、人声、字幕；声音与文字一律后期处理。
- `amix` 后可能为单声道；如需立体声，在配音轨补 `aformat=channel_layouts=stereo`。
- MediaKit 剪辑额度耗尽时走本地 FFmpeg 降级；额度恢复后可复用 `segments/` 重合成正式版本，无需重新生成视频。
- 屏幕代码气泡为模型生成的示意伪代码；正式教程剧集应让屏幕内容对应仓库真实源码片段。
