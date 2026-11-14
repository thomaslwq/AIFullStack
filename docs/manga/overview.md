---
title: AI 漫剧系列
description: 把全栈教程拆成剧情向科普漫剧：角色对话 + 分镜漫画 + 知识点卡片，每一集配套原文教程与源码
sidebar_position: 1
---

# AI 漫剧系列

> 用「角色对话 + 分镜漫画 + 知识点卡片」的方式讲全栈开发：每一集对应一篇教程，页面上可直接跳转到原文文档与配套源码。

## 系列设定

- **阿乐**：零基础学习者，负责提问与踩坑；
- **文哥**：资深全栈工程师，负责讲解知识点；
- **AI 助手**：辅助编码与排错的工具形象（对应 Cursor / Cloud Code / Copilot）。

统一画风与角色人设见 [`config/character.json`](./config/character.json)。

## 单集结构

```text
开篇场景引入 → 3～8 格对话分镜 → 知识点卡片 → 实操画面 → 片尾思考题 + 原文教程链接
```

## 剧集列表

| 集数 | 标题 | 配套教程 | 状态 |
| --- | --- | --- | --- |
| EP01 | [0 到 1 搭建 Java + React 全栈项目](./episodes/ep01-init-project/index.md) | [前后端联调跑通](../bootstrap/fullstack-run-first.md) | 已上线（真人写实版） |
| Demo | [AI 帮我改了一行代码，我准时下班了](./episodes/demo-lin-ke-bug/index.md) | 固定女主林可 · 写实竖屏动态漫样板（含专属配音） | 已上线 |

## 制作流程（新增一集）

1. 选一篇教程，在 `docs/manga/episodes/epXX-<slug>/` 下新建：
   - `script.md`：剧本与分镜；
   - `prompts.md`：每一格的 AI 绘图提示词；
   - `index.md`：Docusaurus 漫剧页面；
   - `assets/`：分镜图片（当前为 SVG 占位图，后续替换为 AI 生成漫画）。
2. 在 `website/sidebars.js` 的 `mangaSidebar` 中注册页面 id；
3. 本地 `npm run build` 验证后推送 `main`，GitHub Actions 自动更新 Pages。

## 图片说明

仓库内 `assets/` 当前为统一风格的 SVG 占位分镜图；使用提示词在生图工具（豆包 / Midjourney / SD 等）生成漫画后，同名替换对应图片即可，页面结构无需改动。
