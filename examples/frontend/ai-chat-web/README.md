# ai-chat-web（实战前端核心源码）

对应教程：[Step 2 · 前端落地](../../../docs/project/step2-frontend.md)。

本目录提供实战前端的关键源码片段，完整工程用 Vite 初始化后拷入：

```bash
npm create vite@latest ai-chat-web -- --template react-ts
cd ai-chat-web
npm install react-router-dom zustand @tanstack/react-query
```

## 文件映射

| 文件 | 职责 |
| --- | --- |
| `src/api/client.ts` | 统一请求封装，自动注入鉴权头与统一响应解包 |
| `src/stores/useAuthStore.ts` | Zustand + persist 登录态 |
| `src/api/streamChat.ts` | SSE 流式读取与增量回调 |
| `src/pages/ChatPage.tsx` | 对话界面：消息列表、发送、流式渲染、停止生成 |
| `src/App.tsx` | 路由、QueryClient 与登录守卫组装 |

## 运行前准备

- 后端 `ai-chat-api` 已在 `localhost:8080` 启动；
- `vite.config.ts` 配置 `/api` 代理到后端；
- 环境变量 `VITE_API_BASE=/api`。

## 联调自检

1. 未登录访问 `/` 跳转 `/login`；
2. 登录后发送消息，回复逐字出现；
3. 点击停止可中断流式接收；
4. 401 时自动回到登录页。
