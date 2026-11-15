---
title: "双人小样 · MyBatis 踩坑：为什么查不到数据？"
sidebar_label: "双人小样 MyBatis 驼峰"
description: "旁白驱动的双人写实竖屏知识短片：林可与文哥排查 MyBatis 下划线与驼峰命名不一致，台词为画外音，配真实代码卡片、双角色专属配音与字幕"
---

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

> 🎬 本页为双人知识教程验证小样：固定女主林可 + 固定男工程师文哥；台词走旁白画外音、人物不开口；代码特写为本地渲染的真实代码卡片，规避 AI 假屏幕与口型错位。

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
  <img src={require('./assets/card1.jpg').default} alt="代码卡片：UserMapper.xml 中下划线字段与驼峰属性映射" />
  <p><b>文哥：</b>你看看数据库字段和实体类属性名，是不是没对上？</p>
</div>

<div>
  <img src={require('./assets/card2.jpg').default} alt="代码卡片：数据库下划线字段与实体驼峰属性对比" />
  <p><b>林可：</b>哦！下划线和驼峰没开启自动转换！</p>
</div>

<div>
  <img src={require('./assets/card3.jpg').default} alt="代码卡片：application.yml 开启下划线驼峰自动转换" />
  <p><b>文哥：</b>MyBatis-Plus 可以一键开启这个配置。</p>
</div>

</div>

## 小样要点

- ✅ 旁白驱动：台词为画外音，人物不开口，从范式上规避口型与音画错位
- ✅ 真实代码画面：本地渲染 IDE 风格代码卡片，代码取自仓库真实 MyBatis 源码，无 AI 乱码
- ✅ 双角色专属配音：林可 XiaoxiaoNeural，文哥 YunyangNeural，后期对齐字幕
- ✅ 空间一致：人物仅固定机位氛围出镜，无走动换位，避免跨镜头瞬移
- ✅ 克制动效：人物缓慢推镜；重点行淡入高亮、关键词下划线逐段展开，高亮出现时配轻提示音
- ✅ 剧情节拍：冲突（查不到数据）→ 求助（核对映射）→ 发现（驼峰未转换）→ 解决（MP 配置）

## 制作说明

- 人物氛围图复用固定人设首帧；代码卡片由本地 HTML + 浏览器渲染，保证代码文字准确可读；
- 动效由本地帧序列生成：人物推镜、高亮淡入与下划线展开均在 PIL/FFmpeg 阶段完成，不引入 AI 视频运动；
- 配音与字幕在本地后期对齐合成，成片 720×1280、H.264 + AAC、9:16；
- 不使用文生视频承担人物表演，口型、空间漂移等 AI 视频问题由范式规避。

<Link to="/docs/manga/overview">← 返回漫剧系列目录</Link>
