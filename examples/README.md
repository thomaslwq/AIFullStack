# 配套源码示例

本目录存放教程对应的可参考源码。每个子目录自带 README，说明如何运行或如何组装成完整工程。

| 目录 | 对应教程 | 说明 |
| --- | --- | --- |
| `frontend/react-hooks-demo/` | [React 速通](../docs/frontend/react-quickstart.md) · [Hooks](../docs/frontend/hooks.md) | 组件、State、自定义 Hook 的最小示例 |
| `frontend/ai-chat-web/` | [Step 2 · 前端落地](../docs/project/step2-frontend.md) | 实战前端核心源码（请求层、鉴权 store、流式对话页） |
| `backend/ai-chat-api/` | [Step 1 · 后端落地](../docs/project/step1-backend.md) | 实战后端核心源码（分层 Controller/Service/Repository、JWT、模型网关） |

## 使用方式

1. 前端示例：在空目录用 Vite 初始化 `react-ts` 工程后，把对应 `src/` 文件拷入；
2. 后端示例：按 [Spring Boot 入门](../docs/backend/spring-boot-quickstart.md) 搭建 Maven 工程后，按包路径放入 Java 类与配置；
3. 所有示例的环境变量要求见 [命令速查 · 环境变量](../docs/appendix/commands.md)。

> 示例聚焦教学关键路径，省略了部分样板配置；完整工程以教程步骤为准逐步生成。
