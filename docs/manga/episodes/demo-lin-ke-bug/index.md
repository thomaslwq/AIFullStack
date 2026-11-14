---
title: "Demo · AI 帮我改了一行代码，我准时下班了"
sidebar_label: "Demo 林可排错样板"
description: "写实竖屏动态漫样板：固定女主林可从加班发愁到 AI 提示、补判空、成功下班，含专属 TTS 配音与字幕"
---

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

> 🎬 本页为 AI 编程类竖屏动态漫的可复用样板：固定人设、真人写实风、剧情节拍 + 专属配音，后续剧集沿用同一流水线批量生成。

## 🎬 动态漫视频（竖屏 9:16，20 秒）

<div style={{ maxWidth: '400px', margin: '0 auto' }}>
  <video
    controls
    style={{ width: '100%', borderRadius: '12px' }}
    src={useBaseUrl('/videos/demo-lin-ke.mp4')}
  />
</div>

<div style={{ display: 'grid', gap: '24px', maxWidth: '760px', margin: '24px auto 0' }}>

<div>
  <img src={require('./assets/01.jpg').default} alt="分镜 1：工位前对着报错堆栈发愁" />
  <p><b>林可：</b>啊，这个 Bug 卡好久了。</p>
</div>

<div>
  <img src={require('./assets/02.jpg').default} alt="分镜 2：AI 助手悬浮给出代码提示" />
  <p><b>林可：</b>试试判空，这里少了 null 校验。</p>
</div>

<div>
  <img src={require('./assets/03.jpg').default} alt="分镜 3：专注敲下判空代码" />
  <p><b>林可：</b>原来是这里漏了判断。</p>
</div>

<div>
  <img src={require('./assets/04.jpg').default} alt="分镜 4：控制台 success，伸懒腰下班" />
  <p><b>林可：</b>搞定！今天可以准时下班啦。</p>
</div>

</div>

## 样板要点

- ✅ 固定女主林可：鹅蛋脸、黑色长直发、白衬衫 + 黑短裙，跨镜头形象锁死
- ✅ 真人写实摄影风，办公室柔光与浅景深，避免漫画感
- ✅ 剧情节拍：冲突（加班发愁）→ 求助（AI 提示）→ 解决（补判空）→ 收尾（成功下班）
- ✅ 专属 TTS 配音对齐台词，后期硬字幕烧录

## 制作说明

- 首帧由文生图逐镜生成，人物描述作为强制前缀保证跨帧一致；
- 每段 5 秒图生视频，动作以自然表情与手部细节为主，避免纯静帧推镜；
- 配音与字幕在本地后期对齐合成，成片 720×1280、H.264 + AAC、9:16。

<Link to="/docs/manga/overview">← 返回漫剧系列目录</Link>
