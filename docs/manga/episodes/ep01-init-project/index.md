---
title: EP01 · 0 到 1 搭建 Java + React 全栈项目
sidebar_label: EP01 从零搭建全栈项目
description: 漫剧第一集：阿乐与文哥从零初始化 Spring Boot 后端与 Vite React 前端，解决跨域，跑通第一个全栈闭环
---

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

> 📚 配套文字教程与完整源码：[前后端联调：第一个全栈 Demo](/docs/bootstrap/fullstack-run-first)

## 🎬 动态漫视频（竖屏 9:16）

<div style={{ maxWidth: '400px', margin: '0 auto' }}>
  <video
    controls
    style={{ width: '100%', borderRadius: '12px' }}
    src={useBaseUrl('/videos/ep01.mp4')}
  />
</div>

<div style={{ display: 'grid', gap: '24px', maxWidth: '760px', margin: '24px auto 0' }}>

<div>
  <img src={require('./assets/01.jpg').default} alt="分镜 1：书桌前的困惑" />
  <p><b>阿乐：</b>我想做一套前后端项目，不知道从哪里下手……</p>
  <p><b>文哥：</b>别慌，我们一步一步从零搭建。</p>
</div>

<div>
  <img src={require('./assets/02.jpg').default} alt="分镜 2：后端初始化" />
  <p><b>文哥：</b>后端先用 Spring Boot，引入 Web、MyBatis、MySQL 依赖。</p>
  <p><b>阿乐：</b>原来不是自己手写所有文件！</p>
</div>

<div>
  <img src={require('./assets/03.jpg').default} alt="分镜 3：AI 辅助开发" />
  <p><b>文哥：</b>Cursor、Cloud Code 这类 AI 工具可以帮我们生成基础配置与实体类。</p>
  <p><b>阿乐：</b>哇，AI 直接帮我写实体和样板代码？</p>
</div>

<div>
  <img src={require('./assets/04.jpg').default} alt="分镜 4：前端初始化" />
  <p><b>文哥：</b>前端用 Vite 创建 React 项目，比老的脚手架更快。</p>
  <p><b>阿乐：</b>前后端是分成两个项目存放吗？</p>
</div>

<div>
  <img src={require('./assets/05.jpg').default} alt="分镜 5：跨域报错" />
  <p><b>阿乐：</b>接口访问失败！这个跨域报错是什么？</p>
  <p><b>文哥：</b>这是新手最高频的坑，后端加一段 CORS 跨域配置就能解决。</p>
</div>

<div>
  <img src={require('./assets/06.jpg').default} alt="分镜 6：前后端打通" />
  <p><b>文哥：</b>前后端打通！接下来我们学习 MyBatis 数据库操作。</p>
  <p><b>阿乐：</b>期待下一集 MyBatis！</p>
</div>

<div style={{ border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '16px', padding: '16px' }}>
  <img src={require('./assets/card.jpg').default} alt="本集核心要点卡片" />
</div>

</div>

## 本集核心要点

- ✅ Spring Boot 初始化后端工程
- ✅ Vite + React 创建前端工程
- ✅ AI 辅助编写样板代码
- ✅ CORS 跨域问题与解决

## 片尾思考题

1. 前后端分别跑在哪个默认端口？
2. 跨域是浏览器的什么机制导致的？后端如何放行前端来源？
3. 为什么密钥和数据库配置不写死在前端代码里？

## 下一集预告

EP02 · MyBatis 基础 CRUD：从建表到 Mapper、XML、Service、Controller 完成一套增删改查。

<Link to="/docs/manga/overview">← 返回漫剧系列目录</Link>
