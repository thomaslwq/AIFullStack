---
title: 常见问题 FAQ
description: 课程学习、本地运行与部署相关的常见问题与解决思路
sidebar_position: 2
---

# 常见问题 FAQ

## 学习相关

**Q：我只会前端，Java 部分看不懂怎么办？**
先跑通 Spring Boot 脚手架，Controller/Service/Repository 三层对照前端组件/状态/请求理解；Java 语法部分按需查阅 [Java 核心速通](../backend/java-core.md)，不必一次记全。

**Q：我只会后端，React 部分从哪入手？**
按 [React 速通](../frontend/react-quickstart.md) → [Hooks](../frontend/hooks.md) 顺序，重点理解「状态驱动视图」和组件传值，路由与状态管理可后续补。

**Q：没有大模型 API Key 能学 AI 章节吗？**
可以先用本地 mock 返回固定流式文本走通前后端链路；接口结构与协议流程不受影响，拿到 Key 后替换网关地址即可。

## 文档站相关

**Q：新增文档后侧边栏不显示？**
检查：Markdown 路径与 `sidebars.js` 注册的 id 是否一致；frontmatter 是否合法；本地重启 dev 服务。

**Q：本地 dev 页面样式/路由 404？**
站点部署在子路径 `/AIFullStack/`，本地访问用 `http://localhost:3000/AIFullStack/`；刷新子路由 404 是 SPA 回退问题，生产静态托管需配置 fallback 到 `index.html`。

## 部署相关

**Q：推送后多久能看到新页面？**
GitHub Actions 构建通常 1–3 分钟；完成后访问 Pages 地址，若有 CDN 缓存可稍等或强制刷新。

**Q：Actions 构建失败怎么排查？**
`gh run list` 找到失败记录，展开对应步骤日志；常见原因是 Markdown 链接指向不存在页面、侧边栏 id 不匹配、依赖安装超时。

**Q：文档站和业务应用部署是一回事吗？**
不是。本仓库的 GitHub Actions 只负责把 `docs/` 构建成静态文档站发布到 Pages；实战业务应用的容器化部署见 [工程化与部署](../integration/devops.md)。

## 安全相关

**Q：为什么模型密钥不能放前端？**
前端代码与请求对用户可见，密钥会被直接盗用。所有第三方密钥必须由后端持有，前端只访问自己后端的接口。

**Q：模型输出能直接写入数据库或执行吗？**
不能直接信任。业务落库前需校验清洗；写操作、删除、支付等动作必须经用户确认与后端权限校验。
