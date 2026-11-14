# AI FullStack 工程师教程

一套体系化的全栈开发教程：**前端 React · 后端 Java · AI 集成 · 实战落地**，以 Markdown 编写、配套可参考源码，通过 Docusaurus 构建为静态文档站并自动发布到 GitHub Pages。

- 在线站点：<https://thomaslwq.github.io/AIFullStack/>
- 仓库：<https://github.com/thomaslwq/AIFullStack>

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | React 18 · TypeScript · Vite · React Router · Zustand · React Query |
| 后端 | Java 17 · Spring Boot 3 · Spring Security · JWT · Spring Data JPA · MySQL |
| AI 集成 | 大模型 API · Prompt 工程 · RAG · SSE 流式 · Agent 工具调用 |
| 文档站 | Docusaurus 3 · Mermaid · GitHub Actions · GitHub Pages |

## 课程地图

| 模块 | 入口 | 内容 |
| --- | --- | --- |
| 导论与路线 | [docs/intro.md](docs/intro.md) · [roadmap.md](docs/roadmap.md) | 课程定位、技术栈、分阶段学习路径 |
| 零基础起步 | [docs/bootstrap/](docs/bootstrap/env-prepare.md) | 环境准备、Vite+React+TS 初始化、Spring Boot 初始化、前后端联调跑通 |
| AI 辅助开发 | [docs/ai-tools/](docs/ai-tools/cloudcode-guide.md) | Cloud Code、Cursor、GitHub Copilot 实操与全栈提示词模板库 |
| 前端 React | [docs/frontend/](docs/frontend/overview.md) | JSX、组件、Props/State、Hooks、路由、状态管理、数据请求、TS |
| 后端 Java | [docs/backend/](docs/backend/overview.md) | Java 核心、Spring Boot、持久层、JWT 鉴权、接口文档 |
| MyBatis 持久层 | [docs/mybatis/](docs/mybatis/overview.md) | XML/注解 CRUD、分页、MyBatis-Plus 通用 CRUD 与条件构造器、React 联调 |
| 集成与工程化 | [docs/integration/](docs/integration/rest-contract.md) | 接口契约、CORS、构建、Docker、Nginx、CI/CD |
| AI 集成 | [docs/ai/](docs/ai/overview.md) | 模型 API、Prompt、RAG、SSE 流式、Agent |
| 实战项目 | [docs/project/](docs/project/overview.md) | 贯穿全栈的 AI 对话应用：后端落地 → 前端落地 |
| AI 漫剧 | [docs/manga/](docs/manga/overview.md) | 剧情向科普漫剧：角色对话 + 分镜漫画 + 知识点卡片，配套原文教程 |
| 附录 | [docs/appendix/](docs/appendix/commands.md) | 命令速查、写作规范、FAQ |

配套源码见 [`examples/`](examples/README.md)。

## 本地运行文档站

```bash
cd website
npm install
npm run dev        # http://localhost:3000/AIFullStack/
npm run build      # 构建静态产物到 website/build/
npm run serve      # 预览构建产物
```

## 新增一篇教程

1. 在 `docs/` 对应模块目录新建 Markdown，写好 frontmatter（`title`、`description`、`sidebar_position`）；
2. 在 [`website/sidebars.js`](website/sidebars.js) 对应分类的 `items` 中注册文档 id（相对 `docs/` 的路径，不含 `.md`）；
3. 本地 `npm run dev` 检查渲染与侧边栏；
4. 推送到 `main`，GitHub Actions 自动构建并发布到 Pages。

详细规范见 [命令速查与写作规范](docs/appendix/commands.md)。

## 自动部署机制

`.github/workflows/deploy-docs.yml` 在每次推送 `main` 时：

1. 检出代码、安装 Node 22 与依赖；
2. 执行 `docusaurus build` 生成静态站点；
3. 通过 `actions-gh-pages` 发布到 `gh-pages` 分支；
4. GitHub Pages 从 `gh-pages` 分支提供页面。

> 首次使用需在仓库 Settings → Pages 中将 Source 设为 `gh-pages` 分支（或由 API 自动开启）。

## 目录结构

```
AIFullStack/
├── docs/                     # 教程 Markdown（站点内容源）
├── examples/                 # 前后端配套源码示例
│   ├── frontend/react-hooks-demo/
│   ├── frontend/ai-chat-web/
│   └── backend/ai-chat-api/
├── website/                 # Docusaurus 站点工程
│   ├── src/                 # 首页、样式、组件
│   ├── sidebars.js          # 侧边栏注册
│   └── static/img/          # 静态图片
├── .github/workflows/        # CI/CD：文档站自动部署
└── LICENSE                   # MIT
```

## 许可

[MIT](LICENSE) © Thomas.Lin
