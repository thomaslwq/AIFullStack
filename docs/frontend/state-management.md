---
title: 状态管理：局部状态与全局状态
description: 区分组件局部状态、提升状态与全局状态，使用 Zustand 管理跨组件共享状态
sidebar_position: 5
---

# 状态管理：局部与全局

## 1. 先判断状态放在哪

| 状态类型 | 典型例子 | 放置位置 |
| --- | --- | --- |
| 局部状态 | 输入框内容、弹窗开关 | 组件内部 `useState` |
| 共享状态 | 主题、登录用户、购物车 | 提升到共同父组件，或全局状态库 |
| 服务端状态 | 接口返回的数据 | 数据请求层（React Query），不要手动塞进全局 store |

> 原则：**状态尽量下沉**。能用局部 state 解决，就不要提升；能在父组件提升解决，就不要上全局库。

## 2. Zustand 全局状态

Zustand API 简洁、无样板代码，适合管理跨路由共享的客户端状态。

```ts
// stores/useAuthStore.ts
import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: { name: string } | null;
  login: (token: string, name: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, name) => set({ token, user: { name } }),
  logout: () => set({ token: null, user: null }),
}));
```

组件中订阅所需字段：

```tsx
import { useAuthStore } from '../stores/useAuthStore';

function UserBadge() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  if (!user) return <button>登录</button>;
  return (
    <span>
      {user.name} <button onClick={logout}>退出</button>
    </span>
  );
}
```

## 3. 边界与原则

- 全局 store 只存**客户端共享状态**；接口数据交给数据请求层管理缓存；
- 选择器尽量返回具体字段，避免整个 store 变化导致组件重渲染；
- 复杂表单状态优先用局部 state 或表单库，不要一股脑进全局 store。

## 实践任务

1. 用 Zustand 实现主题切换 store（亮色/暗色），并在导航栏切换。
2. 复盘现有组件：哪些 state 本应是局部状态却被放进了全局？
