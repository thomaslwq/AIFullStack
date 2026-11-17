# {{title}} · 制作母版

> 记录本集参数、素材路径、合成方式与已知偏差，便于复现与后续剧集对齐。

## 总体参数

| 项 | 值 |
| --- | --- |
| 成片 | `website/static/videos/{{slug}}.mp4`，720×1280，25fps，H.264 + AAC 128k |
| 生产模式 | 模式 L 本地帧序列（基线）；模式 V AI 片段（备选，若采用在此注明模型与段长） |
| 段长 | SEG = 5.057s；每段 N = 126 帧 |
| 人设插画 | image_gen seedream_5.0_pro，9:16；双人全景 + 角色半身差分，存 `assets/` |
| 代码卡片 | `production/gen_cards.py` 生成 HTML，Playwright + Chromium 无头截图 720×1280 |
| 配音 | edge-tts 双音色：女主 {{femaleVoice}} / {{femaleVoiceRate}}，男主 {{maleVoice}} / {{maleVoiceRate}}；`production/voice/seg*.mp3` |
| 字幕 | ASS 硬字幕；时间轴见 `production/subtitles.json`（含 speaker） |
| 后期 | 本地 FFmpeg：帧序列 / 片段编码 + concat + adelay/amix 配音与提示音 + ASS 烧录 |

## 人物锁定

- 双角色人设描述、发型、服装、鞋、肤色、音色：见 `../character-ref.json`。
- 跨集复用同一人设卡；新剧集不得更改角色外观与音色。

## 分镜节拍表

| 段 | 时间 | 说话人 | 画面与动作 | 台词 | TTS 时长 | 视频时长 |
| --- | --- | --- | --- | --- | --- | --- |
| SEG01 | 0–5.057s | {{femaleLeadName}} | <要点> | <台词> | <秒> | 5.057s |
| SEG02 | 5.057–10.114s | {{maleLeadName}} | <要点> | <台词> | <秒> | 5.057s |
| SEG03 | 10.114–15.171s | {{femaleLeadName}} | <要点> | <台词> | <秒> | 5.057s |
| SEG04 | 15.171–20.228s | {{maleLeadName}} | <要点> | <台词> | <秒> | 5.057s |

## 动效与 Prompt 要点

- 模式 L：推镜、高亮淡入、下划线 stagger、对白气泡、角色小窗滑入淡入 + 名牌；段间 0.3s 黑场淡入。
- 模式 V（如采用）：动作以眨眼、转头、点头、指向、视线交流、微前倾为主；镜头固定或平缓；prompt 不写台词、配乐、人声、字幕、时长、比例、模型。
- 角色不开口；台词走旁白 + 字幕，画面只做倾听、指向、表情反馈。

## 素材与合成

- 入库：`character-ref.json`、`production/subtitles.json`、`production/voice/`、`production/gen_cards.py`、`production/anim_frames.py`、`production/build.sh`、`production/cards/*.html`、`assets/` 插画与帧图、成片 mp4。
- 中间素材（gitignore）：`frames/`、`segments/`、`production/build/`、`production/cards/*.png`、`production/concat.txt`、`production/subtitles.ass`、检查帧。
- 合成命令、ASS 样式与对齐公式：见 Skill `references/pipeline.md`。
- 复用：帧序列、片段与配音保留在 `examples/<slug>/`；后期参数调整后可重合成，无需重新生成视频。

## 已知偏差与待办

- 代码卡片内容须对应仓库真实源码片段；如有伪代码示意，在此注明。
- BGM：默认无配乐；如需，在后期混入独立低音量音轨，不写入生成 prompt。
- 模式 V 片段的跨段一致性与动作自然度受模型上限约束；如有脸崩、空间漂移记录在此，供下一集调整参考。
- MediaKit 剪辑额度恢复后可复用 `segments/` 或帧序列重合成正式版本。
