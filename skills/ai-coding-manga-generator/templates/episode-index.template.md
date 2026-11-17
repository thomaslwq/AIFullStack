---
title: "{{title}}"
description: "{{title}} · 双人互动竖屏漫剧样板"
---

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

# {{title}}

<video
  className="manga-video"
  controls
  playsInline
  src={useBaseUrl('/videos/{{slug}}.mp4')}
/>

## 分镜台词

| 段 | 说话人 | 画面 | 台词 |
| --- | --- | --- | --- |
| 1 | {{femaleLeadName}} | <画面要点> | <台词> |
| 2 | {{maleLeadName}} | <画面要点> | <台词> |
| 3 | {{femaleLeadName}} | <画面要点> | <台词> |
| 4 | {{maleLeadName}} | <画面要点> | <台词> |

## 样板要点

- 双角色形象跨镜锁定：同一张脸、发型、服装、肤色。
- 剧情四拍：冲突 → 求助 → 发现 → 解决；固定工位场景，动作衔接自然。
- 竖屏 9:16，720×1280；代码画面为本地真实源码卡片；双音色旁白配音，字幕后期混入。

<Link to="/docs/manga/overview">← 返回漫剧目录</Link>

<!--
帧图按需增删（与 assets/01.jpg … 对应）：

![镜头 1](./assets/01.jpg)
![镜头 2](./assets/02.jpg)
![镜头 3](./assets/03.jpg)
![镜头 4](./assets/04.jpg)
-->
