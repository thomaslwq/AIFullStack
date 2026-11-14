---
title: "{{title}}"
description: "{{title}} · 写实竖屏动态漫样板"
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

| 帧 | 画面 | 台词 |
| --- | --- | --- |
| 1 | <画面要点> | <台词> |
| 2 | <画面要点> | <台词> |
| 3 | <画面要点> | <台词> |
| 4 | <画面要点> | <台词> |

## 样板要点

- 主角形象跨镜锁定：同一张脸、发型、服装、肤色。
- 剧情四拍：冲突 → 求助 → 解决 → 收尾。
- 竖屏 9:16，720×1280；首帧图生视频，配音与字幕后期混入。

<Link to="/docs/manga/overview">← 返回漫剧目录</Link>

<!--
帧图按需增删（与 assets/01.jpg … 对应）：

![镜头 1](./assets/01.jpg)
![镜头 2](./assets/02.jpg)
![镜头 3](./assets/03.jpg)
![镜头 4](./assets/04.jpg)
-->
