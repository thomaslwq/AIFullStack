---
name: ai-coding-manga-generator
description: 批量生成 AI 编程 / 全栈教程类竖屏双人互动漫剧：固定双角色人设锁、四拍剧情分镜、半写实插画、本地真实代码卡片、帧序列动效、专属双音色 TTS、FFmpeg 合成与 Docusaurus 站点上线，沉淀可复用流水线。
---

# AI 编程漫剧生成器

把一篇全栈 / AI 编程教程改造为竖屏双人互动漫剧：固定女主与男工程师跨集一致，按「冲突 → 求助 → 发现 → 解决」四拍组织剧情，代码画面用本地真实源码渲染成卡片 B-roll，配音与字幕后期对齐，成片接入 Docusaurus 站点并随 `main` 推送发布到 GitHub Pages。

本 Skill 当前基线样板（双人漫剧，已上线）：`docs/manga/episodes/verify-mybatis-camelcase/` 与 `examples/manga-verify-mybatis/`。
历史样板：`docs/manga/episodes/demo-lin-ke-bug/`、`examples/manga-demo/`（单人写实）；`docs/manga/episodes/ep01-init-project/`。

## 1. 适用范围与生产模式

- 适用：AI 编程、全栈开发、工具教程类竖屏短视频；单集 15–40 秒；固定双角色、多集连续。
- 不适用：横屏课程实录、纯文字图文、需要真实人物肖像或品牌 Logo 的内容。

两种生产模式：

| 模式 | 说明 | 状态 |
| --- | --- | --- |
| **L · 本地帧序列漫剧（基线）** | 人设插画由生图工具生成；代码卡片由本地 HTML + 浏览器无头截图；逐段帧序列用 PIL 做推镜、高亮、下划线、气泡、角色小窗动效；FFmpeg 拼接 + 双音色 TTS + ASS 字幕。无 AI 视频生成、无口型风险、动作完全可控。 | 已验证，默认采用 |
| **V · AI 图生视频片段（备选）** | 人设插画作参考图，`image_to_video` 逐段生成动态片段；代码 B-roll 仍走本地卡片；后期合成同模式 L。动作自然度受模型上限约束，跨段一致性只能尽量保持。 | 待验证；采用前须按视频 Skill 展示模型 / 时长 / 比例并取得生成确认 |

## 2. 输入与前置资产

开始前确认：

1. 教程主题或原文教程链接；目标集数与单集时长（基线每段约 5.057 秒）。
2. 双角色人设卡（见 `templates/character-ref.template.json`）：外貌、发型、服装、气质、音色、全局画风。
3. 仓库内既有流水线资产：`examples/manga-verify-mybatis/` 为双人漫剧母版；`docs/manga/episodes/verify-mybatis-camelcase/` 为已上线页面参照。

## 3. 流水线（八步）

### 3.1 双角色锁

- 在 `examples/<slug>/character-ref.json` 的 `characters` 数组写定每个角色：年龄、脸型、眉眼、发型、服装、鞋、气质、画风、肤色锁定句、音色与语速。
- 人设描述必须作为**每条生图 prompt 的最前面强制前缀**，防止跨镜变脸；台词、场景、道具写在人设之后。
- 音色一经锁定跨集不变；后续如有声音克隆能力，可替换克隆音色，人设描述与台词不变。

### 3.2 双人剧本与分镜

- 教程改造为四拍剧情：**冲突**（踩坑 / 卡住）→ **求助**（同伴一起排查）→ **发现**（定位疑点 / 恍然大悟）→ **解决**（改对配置 / 跑通，释然收尾）。
- 拆为 N 段分镜，每段记录：`speaker`（说话角色）、画面要点、人物动作与表情、台词、字幕时间轴。台词用口语短句，单句时长须小于段长；对话之间留停顿与留白，不做无缝轮念。
- 同一集固定在同一工位场景；人物出场衔接要有动作依据（走过来、俯身），禁止凭空出现或跨镜头瞬移。
- 剧本、参数表、分镜表、一致性禁区写入 `docs/manga/episodes/<slug>/script.md`。

### 3.3 人设插画生成

- 工具：`image_gen`，模型 `seedream_5.0_pro`，比例 9:16（竖屏 1536×2730 一档）。
- 每张图独立写全 prompt（共享身份、发型、服装），不写「同上」；人设前缀 + 场景动作 + 全局画风后缀。
- 常规素材：双人全景插画（开场主画面）+ 各角色半身插画（小窗差分）。插画下载到 `docs/manga/episodes/<slug>/assets/`（入库）；本地中间帧另存 `examples/<slug>/frames/`（gitignore）。

### 3.4 本地代码卡片（B-roll）

- 代码画面**不交 AI 生成**（AI 画编辑器必然出现乱码假屏幕）。用 `production/gen_cards.py` 写 HTML（深色 IDE 风格、等宽字体、高亮行、注释栏），通过 Playwright + 本机 Chromium 无头截图为 720×1280 PNG，源码内容取自仓库真实片段。
- 卡片 HTML 入库；截图 PNG 在 `production/cards/`（gitignore）。
- 高亮元素在 HTML 里用可被帧脚本定位的 class（如 `.hl`、`.kw`），供动效脚本做淡入与下划线展开。

### 3.5 帧序列动效（模式 L）

- 工具：`production/anim_frames.py`（PIL）。每段生成 N 帧 PNG 到 `production/build/frames/<seg>/`。
- 已验证动效：全幅插画缓慢推镜；代码卡片高亮淡入 + 下划线逐段展开；对白气泡（尾巴坐标按构图微调）；角色半身插画小窗（cover crop、滑入淡入、缓慢推镜、圆角、角色色边框 + 彩色名牌）；段间 0.3 秒黑场淡入。
- 模式 V 跳过本步，改为 3.7 的 AI 片段。

### 3.6 双音色配音

- 工具：本地 `edge-tts`。基线：女主 `zh-CN-XiaoxiaoNeural`，rate `+6%`；男工程师 `zh-CN-YunyangNeural`，rate 以人设卡为准。
- 逐句生成 mp3 到 `examples/<slug>/production/voice/`；`ffprobe` 校验每句时长小于段长，段内约 0.6 秒起播、留尾。单句语速可在 TTS 命令级临时覆盖，人设卡默认语速不变。

### 3.7 片段编码与动态（模式 V）

- 工具：`image_to_video`，模型与时长 / 比例按视频 Skill 要求确认后执行；片段静音。
- 每段携带人设参考图；Prompt 只写细微自然动作（转头、点头、抬手指屏幕、视线交流、扶眼镜、身体微前倾）、表情与镜头运动；**不写台词、配乐、人声、字幕**（配音与字幕在后期处理）。
- 片段下载到 `examples/<slug>/segments/`（gitignore）；代码 B-roll 仍用 3.4 的本地卡片叠加或插入。

### 3.8 后期合成与站点上线

- FFmpeg：帧序列 / 片段编码 → concat 拼接 → 双音色 `adelay` 对齐 + 提示音 `amix` → ASS 硬字幕烧录 → 导出成片 `website/static/videos/<slug>.mp4`。
- 合成命令、ASS 样式参数与坑位见 `references/pipeline.md`。
- 写 `index.md`（嵌成片视频 + 分镜帧 + 台词）；在 `website/sidebars.js` 的 `mangaSidebar` 注册页面 id；在 `docs/manga/overview.md` 剧集表追加一行。
- 写 `production/母版.md`（参数、人设、分镜、素材路径、合成方式、已知偏差）与 `.gitignore`（排除中间素材）。
- `website/` 下 `npm run build` 验证；推送 `main`；监控 Deploy Docs CI；抽查页面 200 与视频 HEAD（`content-type: video/mp4`）。

## 4. 硬参数基线

| 项 | 值 |
| --- | --- |
| 画幅 | 9:16，成片 720×1280，H.264 + AAC 128k，yuv420p，25fps |
| 段长 | SEG = 5.057s；每段 N = round(25 × 5.057) = 126 帧 |
| 人设插画 | image_gen `seedream_5.0_pro`，9:16 |
| 动态片段（模式 V） | 模型 / 时长 / 比例生成前按视频 Skill 确认；片段静音 |
| 配音 | edge-tts 双音色；段内 0.6s 起；提示音在段起点 +550ms 高亮起时刻 |
| 字幕 | ASS，Noto Sans CJK SC 32px，白字黑描边，底边安全区；长句手动 `\N` 断行 |
| 代码卡片 | 本地 HTML + Chromium 无头截图 720×1280；等宽 Noto Sans Mono |
| 合成 | libx264 `-preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -ar 44100` |

## 5. 一致性与禁区

详见 `references/consistency.md`。要点：

- 每条生图 prompt 前置完整人设锁；双角色同一张脸、发型、服装、肤色跨镜跨集不变。
- 固定工位场景；不换房间、不瞬移、不大幅肢体动作；镜头固定或缓慢有目的运动。
- 角色**不开口**：台词走旁白 TTS + ASS 字幕，人物只做倾听、指向、表情反馈（当前环境无唇形同步手段，不做口型对齐）。
- 代码屏幕本地真实源码渲染，不交 AI 画；视频生成 prompt 不含时长、比例、模型、台词、配乐、字幕。

## 6. 文件布局

```text
docs/manga/episodes/<slug>/
  index.md            # Docusaurus 漫剧页面
  script.md           # 剧本、参数表、分镜表、一致性禁区
  prompts.md          # 人设前缀、画风后缀、逐镜生图与运动提示
  assets/             # 站点用插画 / 分镜帧 720×1280 JPEG（入库）

examples/<slug>/
  character-ref.json  # 双角色人设锁 + 双音色 + 画风 + 分镜元数据
  frames/             # 首帧本地副本（gitignore）
  segments/           # 模式 V 动态片段（gitignore）
  production/
    母版.md            # 制作母版与复现记录
    subtitles.json    # 字幕时间轴资产（入库）
    gen_cards.py      # 本地代码卡片 HTML + 截图脚本（入库）
    anim_frames.py    # 帧序列动效脚本（入库）
    build.sh          # 合成脚本（入库）
    cards/*.html      # 卡片 HTML（入库）；cards/*.png（gitignore）
    voice/seg*.mp3    # TTS 配音（入库）
    build/            # 帧序列、段视频、concat、混音（gitignore）
    subtitles.ass / concat.txt / concat.mp4 / final.mp4 / check*.jpg（gitignore）

website/static/videos/<slug>.mp4   # 成片（入库）
```

## 7. 交付检查

- [ ] `npm run build` 成功，无 webpack 报错。
- [ ] 中间素材（frames、segments、build、卡片 PNG、ass、concat、check 帧）已被 gitignore 排除。
- [ ] CI `Deploy Docs` success；页面 200；视频 HEAD 200 且 `content-type: video/mp4`。
- [ ] 提交信息格式：`feat: manga <slug> <描述>`。

## 8. 模板复用

新剧集从 `templates/` 复制骨架，替换占位符：

| 模板 | 用途 |
| --- | --- |
| `character-ref.template.json` | 双角色人设锁、双音色、画风、分镜元数据 |
| `script.template.md` | 双人剧本结构、参数表、分镜表、一致性禁区 |
| `prompts.template.md` | 人设前缀、画风后缀、逐镜生图与运动提示 |
| `subtitles.template.json` | 字幕时间轴（含 speaker） |
| `episode-index.template.md` | Docusaurus 页面骨架 |
| `production-master.template.md` | 制作母版骨架 |
| `gitignore.template` | 中间素材排除清单 |

参考细则：`references/pipeline.md`（卡片渲染、帧动效、合成命令与字幕样式）、`references/consistency.md`（双角色锁与场景 / 动作 / 屏幕规则）、`references/site-and-release.md`（站点接入与上线检查）。
