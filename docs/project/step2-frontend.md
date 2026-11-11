---
title: Step 2 · 前端落地
description: 实战项目前端逐步实现：Vite + React + TS 初始化、登录态、对话界面、流式渲染与联调
sidebar_position: 3
---

# Step 2 · 前端落地

目标：在 `examples/frontend/ai-chat-web/` 完成对话界面，与 Step 1 后端联调。

## 1. 工程初始化

```bash
npm create vite@latest ai-chat-web -- --template react-ts
cd ai-chat-web
npm install react-router-dom zustand @tanstack/react-query
```

目录约定：

```
src/
├── api/          # 请求客户端与接口函数
├── stores/       # Zustand：auth、chat
├── components/   # MessageList、MessageItem、Composer、LoginForm
├── pages/        # LoginPage、ChatPage
└── App.tsx       # 路由与 QueryClientProvider
```

## 2. 请求客户端与鉴权

```ts
// api/client.ts
import { useAuthStore } from '../stores/useAuthStore';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`/api${path}`, { ...init, headers });
  const body = await res.json();
  if (!res.ok || body.code !== 0) throw new Error(body.message ?? '请求失败');
  return body.data as T;
}
```

## 3. 登录态 store

```ts
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  name: string | null;
  setAuth: (token: string, name: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      setAuth: (token, name) => set({ token, name }),
      logout: () => set({ token: null, name: null }),
    }),
    { name: 'aichat-auth' },
  ),
);
```

## 4. 对话界面与流式渲染

```tsx
// pages/ChatPage.tsx
const [messages, setMessages] = useState<UIMessage[]>([]);
const [reply, setReply] = useState('');
const [streaming, setStreaming] = useState(false);
const abortRef = useRef<AbortController | null>(null);

async function send(text: string) {
  const userMsg = { role: 'user', content: text };
  setMessages((prev) => [...prev, userMsg]);
  setReply('');
  setStreaming(true);

  await streamChat([...messages, userMsg], (delta) =>
    setReply((prev) => prev + delta),
  );

  setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
  setReply('');
  setStreaming(false);
}

function stop() {
  abortRef.current?.abort();
  setStreaming(false);
}
```

消息列表区分用户/助手气泡，输入框 `Composer` 在流式进行中禁用发送、显示停止按钮。

## 5. 路由与守卫

```tsx
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <RequireAuth><ChatPage /></RequireAuth>,
  },
]);
```

`RequireAuth` 读取 auth store，无 Token 重定向到 `/login`。

## 6. 联调与代理

Vite `vite.config.ts` 代理 `/api` 到后端：

```ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true },
  },
},
```

## 7. 验收对照

- [ ] 登录态刷新后保留（persist 到 localStorage）；
- [ ] 多轮对话历史在页面正确展示；
- [ ] 流式回复逐字出现，停止按钮可中断；
- [ ] 401 自动跳转登录；网络/模型错误有提示且不清空已发消息；
- [ ] `npm run build` 产出静态资源，可由 Nginx 托管。

## 8. 后续扩展

- 接入 RAG：提问前先检索知识库片段注入上下文（见 [RAG 章节](../ai/rag.md)）；
- 会话管理：左侧会话列表、新建/切换/重命名会话；
- 工具调用：把后端工具结果渲染为卡片（见 [Agent 章节](../ai/agent.md)）。
