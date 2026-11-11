---
title: 命令速查与写作规范
description: 文档站本地运行、新增教程的步骤、常用命令与目录约定
sidebar_position: 1
---

# 命令速查与写作规范

## 1. 文档站本地运行

```bash
cd website
npm install        # 首次
npm run dev        # 启动本地开发服务，默认 http://localhost:3000/AIFullStack/
npm run build      # 构建静态产物到 website/build/
npm run serve      # 本地预览构建产物
```

## 2. 新增一篇教程（迭代流程）

1. 在 `docs/` 对应模块目录新建 Markdown，例如 `docs/frontend/xxx.md`；
2. 文件头部写好 frontmatter：

```markdown
---
title: 页面标题
description: 一句话描述（用于 SEO 与列表）
sidebar_position: 8
---
```

3. 在 `website/sidebars.js` 对应分类的 `items` 数组中注册该文档 id（不含 `.md` 与目录前缀路径，如 `frontend/xxx`）；
4. 本地 `npm run dev` 检查渲染与侧边栏顺序；
5. 提交并推送到 `main`，GitHub Actions 自动构建发布到 Pages。

> 文档 id 必须与相对 `docs/` 的路径一致（去掉 `.md`），否则侧边栏找不到页面。

## 3. 常用命令对照

| 任务 | 命令 |
| --- | --- |
| 克隆仓库 | `git clone https://github.com/thomaslwq/AIFullStack.git` |
| 前端示例安装 | `npm install` |
| 前端示例启动 | `npm run dev` |
| 后端编译运行 | `mvn spring-boot:run` |
| 后端打包 | `mvn -DskipTests package` |
| Docker Compose 启动 | `docker compose up -d` |
| 查看 CI 状态 | `gh run list --repo thomaslwq/AIFullStack` |

## 4. Markdown 写作约定

- 代码块标注语言：`tsx`、`java`、`bash`、`sql`、`yaml`、`json`；
- 每章结构：学习目标 → 核心讲解 + 代码 → 实践任务 → 常见坑；
- 示例源码放 `examples/`，文档中用相对链接引用；
- 避免在正文堆砌过长命令，复杂步骤拆成小节；
- 图片放 `website/static/img/`，文档中以 `/AIFullStack/img/xxx.png` 引用。

## 5. 环境变量清单（实战项目）

| 变量 | 说明 |
| --- | --- |
| `LLM_API_KEY` | 大模型 API 密钥，仅后端使用 |
| `LLM_BASE_URL` | 模型接口地址 |
| `DB_PASSWORD` | MySQL 密码 |
| `JWT_SECRET` | JWT 签名密钥（足够长度的随机串） |

## 6. 目录结构速览

```
AIFullStack/
├── docs/                  # 教程 Markdown（站点内容源）
├── examples/              # 前后端可运行源码示例
├── website/               # Docusaurus 站点工程
│   ├── src/              # 主题、首页、样式
│   ├── sidebars.js        # 侧边栏注册
│   └── static/img/       # 静态图片
└── .github/workflows/      # CI/CD 自动化
```
