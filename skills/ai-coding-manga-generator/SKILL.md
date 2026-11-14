---
name: ai-coding-manga-generator
description: 批量生成 AI 编程 / 全栈教程类竖屏写实动态漫：固定角色人设锁、剧情分镜、首帧图生视频、专属 TTS 配音、FFmpeg 合成与 Docusaurus 站点上线，沉淀可复用流水线。
---

# AI 编程动态漫生成器

把一篇全栈 / AI 编程教程改造为竖屏写实动态漫：固定女主形象跨集一致，按「冲突 → 求助 → 解决 → 收尾」四拍组织剧情，逐镜生成首帧与动态片段，后期对齐配音与字幕，成片接入 Docusaurus 站点并随 `main` 推送发布到 GitHub Pages。

本 Skill 对应仓库内已验证样板：`docs/manga/episodes/demo-lin-ke-bug/` 与 `examples/manga-demo/`。

## 1. 适用范围

- 适用：AI 编程、全栈开发、工具教程类竖屏短视频；单集 15–30 秒；固定主角、多集连续。
- 不适用：横屏课程实录、纯文字图文、需要真实人物肖像或品牌 Logo 的内容；漫画 / 二次元风格（本 Skill 基线为真人写实摄影风）。

## 2. 输入与前置资产

开始前确认：

1. 教程主题或原文教程链接；目标集数与单集时长（基线每段 5 秒）。
2. 固定角色人设卡（见 `templates/character-ref.template.json`）：外貌、发型、服装、气质、音色、全局画风。
3. 仓库内既有流水线资产：`examples/manga-demo/` 为可参照母版；`docs/manga/episodes/ep01-init-project/` 为已上线页面参照。

## 3. 流水线（七步）

### 3.1 角色锁

- 在 `examples/<slug>/character-ref.json` 写定人设：年龄、脸型、眉眼、发型、服装、鞋、气质、画风、肤色锁定句、音色与语速。
- 人设描述必须作为**每条生图 prompt 的最前面强制前缀**，防止跨镜变脸；台词、场景、道具写在人设之后。
- 音色一经锁定跨集不变；后续如有声音克隆能力，可替换克隆音色，人设描述与台词不变。

### 3.2 剧本与分镜

- 教程改造为四拍剧情：**冲突**（踩坑 / 卡住）→ **求助**（AI 助手提示）→ **解决**（动手改对）→ **收尾**（成功 / 释然）。
- 拆为 N 段分镜，每段记录：画面要点、人物动作与表情、台词、字幕时间轴。台词用口语短句，单句时长须小于段长。
- 剧本、参数表、分镜表、一致性禁区写入 `docs/manga/episodes/<slug>/script.md`。

### 3.3 首帧生成

- 工具：`image_gen`，模型 `seedream_5.0_pro`，比例 9:16。
- 每张帧独立写全 prompt（共享身份、发型、服装），不写「同上」；人设前缀 + 场景动作 + 全局画风后缀。
- 首帧下载到 `examples/<slug>/frames/`（gitignore）；缩放 720×1280 JPEG 导出到 `docs/manga/episodes/<slug>/assets/`。

### 3.4 动态片段

- 工具：`image_to_video`，模型 `seedance_2.5`，`duration` 5（秒），`ratio` 9:16。
- Prompt 只写人物动作、表情、手部细节与镜头运动；**不写台词、配乐、人声、字幕**（配音与字幕在后期处理）。
- 片段下载到 `examples/<slug>/segments/`（gitignore）；每段 5.04s 左右，720×1280。

### 3.5 配音

- 工具：本地 `edge-tts`；基线音色 `zh-CN-XiaoxiaoNeural`，语速 `+6%`。
- 逐句生成 mp3 到 `examples/<slug>/production/voice/`；`ffprobe` 校验每句时长小于段长，段内约 0.6 秒起播、留尾。

### 3.6 后期合成（本地 FFmpeg）

- 拼接 N 段片段（concat demuxer，片段编码一致：HEVC + AAC 44.1kHz）。
- 配音轨：每句 `adelay` 对齐到所属段起点 + 600ms，`amix` 混合；丢弃片段原生音轨。
- ASS 硬字幕烧录；导出成片 `website/static/videos/<slug>.mp4`。
- 合成命令、ASS 样式参数与坑位见 `references/pipeline.md`。

### 3.7 站点接入与上线

- 写 `index.md`（嵌成片视频 + 分镜帧 + 台词）；在 `website/sidebars.js` 的 `mangaSidebar` 注册页面 id；在 `docs/manga/overview.md` 剧集表追加一行。
- 写 `production/母版.md`（参数、人设、分镜、素材路径、合成方式、已知偏差）与 `.gitignore`（排除中间素材）。
- `website/` 下 `npm run build` 验证；推送 `main`；监控 Deploy Docs CI；抽查页面 200 与视频 HEAD（`content-type: video/mp4`）。

## 4. 硬参数基线

| 项 | 值 |
| --- | --- |
| 画幅 | 9:16，成片 720×1280，H.264 + AAC 128k，yuv420p |
| 片段 | image_to_video `seedance_2.5`，每段 5 秒，9:16，静音 |
| 首帧 | image_gen `seedream_5.0_pro`，9:16 |
| 配音 | edge-tts `zh-CN-XiaoxiaoNeural`，rate `+6%`，段内 0.6s 起 |
| 字幕 | ASS，Noto Sans CJK SC 32px，白字黑描边，底边安全区 |
| 合成 | libx264 `-preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k` |

## 5. 一致性与禁区

详见 `references/consistency.md`。要点：

- 每条生图 prompt 前置完整人设锁；跨集同一张脸、发型、服装、肤色。
- 真人写实摄影风；避免漫画感、悬浮机器人实体与多余人物。
- 动作以自然表情与手部细节为主；禁止纯静帧缓慢推镜。
- 视频生成 prompt 不包含时长、比例、模型、台词、配乐、字幕。

## 6. 文件布局

```text
docs/manga/episodes/<slug>/
  index.md            # Docusaurus 漫剧页面
  script.md           # 剧本、参数表、分镜表、一致性禁区
  prompts.md          # 人设前缀、画风后缀、逐镜生图与运动提示
  assets/01.jpg …     # 站点用分镜帧 720×1280 JPEG

examples/<slug>/
  character-ref.json  # 人设锁 + 音色 + 画风 + 分镜元数据
  frames/             # 首帧本地副本（gitignore）
  segments/           # 动态片段（gitignore）
  production/
    母版.md            # 制作母版与复现记录
    subtitles.json    # 字幕时间轴资产（入库）
    voice/seg*.mp3    # TTS 配音（入库）
    subtitles.ass / concat.txt / concat.mp4 / final.mp4 / check*.jpg（gitignore）

website/static/videos/<slug>.mp4   # 成片（入库）
```

## 7. 交付检查

- [ ] `npm run build` 成功，无 webpack 报错。
- [ ] 中间素材（frames、segments、ass、concat、check 帧）已被 gitignore 排除。
- [ ] CI `Deploy Docs` success；页面 200；视频 HEAD 200 且 `content-type: video/mp4`。
- [ ] 提交信息格式：`feat: manga <slug> <描述>`。

## 8. 模板复用

新剧集从 `templates/` 复制骨架，替换占位符：

| 模板 | 用途 |
| --- | --- |
| `character-ref.template.json` | 角色人设锁、音色、画风、分镜元数据 |
| `script.template.md` | 剧本结构、参数表、分镜表、一致性禁区 |
| `prompts.template.md` | 人设前缀、画风后缀、逐镜生图与视频运动提示 |
| `subtitles.template.json` | 字幕时间轴 |
| `episode-index.template.md` | Docusaurus 页面骨架 |
| `production-master.template.md` | 制作母版骨架 |
| `gitignore.template` | 中间素材排除清单 |

参考细则：`references/pipeline.md`（合成命令与字幕样式）、`references/consistency.md`（角色锁规则）、`references/site-and-release.md`（站点接入与上线检查）。
