# {{title}} · 制作母版

> 记录本集参数、素材路径、合成方式与已知偏差，便于复现与后续剧集对齐。

## 总体参数

| 项 | 值 |
| --- | --- |
| 成片 | `website/static/videos/{{slug}}.mp4`，720×1280，H.264 + AAC 128k |
| 片段 | N 段，每段 5 秒，image_to_video seedance_2.5，9:16，静音 |
| 首帧 | image_gen seedream_5.0_pro，9:16；本地 `frames/`，站点 `assets/` |
| 配音 | edge-tts {{voice}}，rate {{voiceRate}}；`production/voice/seg*.mp3` |
| 字幕 | ASS 硬字幕；时间轴见 `production/subtitles.json` |
| 后期 | 本地 FFmpeg：concat 拼接 + adelay/amix 配音 + ASS 烧录 |

## 人物锁定

- 人设描述、发型、服装、鞋、肤色、音色：见 `../character-ref.json`。
- 跨集复用同一人设卡；新剧集不得更改主角外观与音色。

## 分镜节拍表

| 段 | 时间 | 画面与动作 | 台词 | TTS 时长 | 视频时长 |
| --- | --- | --- | --- | --- | --- |
| SEG01 | 0–5.04s | <要点> | <台词> | <秒> | 5.04s |
| SEG02 | 5.04–10.08s | <要点> | <台词> | <秒> | 5.04s |
| SEG03 | 10.08–15.12s | <要点> | <台词> | <秒> | 5.04s |
| SEG04 | 15.12–20.17s | <要点> | <台词> | <秒> | 5.04s |

## 动态 Prompt 要点

- 动作以自然表情、眨眼、转头、手势、肩部微动为主；镜头固定或平缓。
- 视频 prompt 不写台词、配乐、人声、字幕、时长、比例、模型。

## 素材与合成

- 中间素材：`frames/`、`segments/`、`production/concat.txt`、`production/subtitles.ass`、检查帧，均已 gitignore。
- 合成命令与 ASS 样式：见 Skill `references/pipeline.md`。
- 复用：片段与配音保留在 `examples/<slug>/`；后期参数调整后可重合成，无需重新生成视频。

## 已知偏差与待办

- 屏幕代码气泡为模型生成示意伪代码；正式剧集应替换为仓库真实源码片段。
- BGM：默认无配乐；如需，在后期混入独立低音量音轨，不写入视频生成 prompt。
- 额度：MediaKit 剪辑额度恢复后可复用 `segments/` 重合成正式版本。
