---
title: "双人小样 · MyBatis 踩坑：为什么查不到数据？"
sidebar_label: "双人小样 MyBatis 驼峰"
description: "双人互动写实竖屏动态漫：林可与文哥工位来回对白，排查 MyBatis 下划线与驼峰命名不一致，含双角色专属配音与字幕"
---

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

> 🎬 本页为双人互动写实竖屏动态漫验证小样：固定女主林可 + 固定男工程师文哥，双角色专属配音，双人工位全景与屏幕特写多场景切换。

## 🎬 动态漫视频（竖屏 9:16，约 20 秒）

<div style={{ maxWidth: '400px', margin: '0 auto' }}>
  <video
    controls
    style={{ width: '100%', borderRadius: '12px' }}
    src={useBaseUrl('/videos/verify-mybatis.mp4')}
  />
</div>

<div style={{ display: 'grid', gap: '24px', maxWidth: '760px', margin: '24px auto 0' }}>

<div>
  <img src={require('./assets/01.jpg').default} alt="分镜 1：林可疑惑转头向文哥求助" />
  <p><b>林可：</b>奇怪，SQL 执行成功，怎么查不到数据？</p>
</div>

<div>
  <img src={require('./assets/02.jpg').default} alt="分镜 2：文哥俯身指向 XML 映射讲解" />
  <p><b>文哥：</b>你看看数据库字段和实体类属性名，是不是没对上？</p>
</div>

<div>
  <img src={require('./assets/03.jpg').default} alt="分镜 3：屏幕特写命名不一致，林可恍然大悟" />
  <p><b>林可：</b>哦！下划线和驼峰没开启自动转换！</p>
</div>

<div>
  <img src={require('./assets/04.jpg').default} alt="分镜 4：双人对视微笑收尾" />
  <p><b>文哥：</b>MyBatis-Plus 可以一键开启这个配置。</p>
</div>

</div>

## 小样要点

- ✅ 双人互动：林可（女主）与文哥（男工程师）工位来回对白，转头、俯身、指屏、对视等自然动作
- ✅ 双角色专属配音：林可 XiaoxiaoNeural，文哥 YunyangNeural，后期对齐台词
- ✅ 多场景切换：双人工位全景与 IDE / XML 屏幕特写交替，避免纯静帧推镜
- ✅ 跨镜头人设锁定：两人的脸部、发型、服装、肤色在所有片段间保持一致
- ✅ 剧情节拍：冲突（查不到数据）→ 求助（文哥提示核对映射）→ 解决（发现驼峰未转换）→ 收尾（MyBatis-Plus 配置）

## 制作说明

- 首帧由文生图逐镜生成，双角色人设描述作为强制前缀保证跨帧一致；
- 每段 5 秒图生视频，动作以自然转头、俯身、指屏、对视为主；
- 配音与字幕在本地后期对齐合成，成片 720×1280、H.264 + AAC、9:16。

<Link to="/docs/manga/overview">← 返回漫剧系列目录</Link>
