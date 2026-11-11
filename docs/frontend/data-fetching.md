---
title: 数据请求：从 Fetch 到 React Query
description: 原生 Fetch/Axios 封装、加载与错误处理，以及 React Query 管理服务端状态的缓存、重试与刷新
sidebar_position: 6
---

# 数据请求

## 1. 原生 Fetch 与统一封装

```ts
// api/client.ts
const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api';

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`请求失败 ${res.status}: ${message}`);
  }
  return res.json() as Promise<T>;
}
```

GET / POST：

```ts
export const getUsers = () => request<User[]>('/users');
export const createUser = (body: NewUser) =>
  request<User>('/users', { method: 'POST', body: JSON.stringify(body) });
```

## 2. 组件内请求与状态

不使用数据请求库时，自行维护 `loading / data / error`：

```tsx
import { useEffect, useState } from 'react';

function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    getUsers()
      .then((users) => alive && setData(users))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
```

## 3. React Query：服务端状态管理

React Query（TanStack Query）替你处理缓存、去重、重试、后台刷新与分页，避免手写大量样板。

```tsx
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, loading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 30_000,
  });

  if (loading) return <p>加载中…</p>;
  if (error) return <p>加载失败：{error.message}</p>;

  return (
    <ul>
      {data!.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

- `queryKey` 作为缓存键，相同 key 复用缓存；
- `staleTime` 控制数据新鲜度，过期后后台自动刷新；
- 变更（增删改）用 `useMutation`，成功后使相关 query 失效刷新。

## 实践任务

1. 封装一个带超时与鉴权头注入的请求客户端。
2. 用 React Query 改造上一节手写的 `useUsers`，对比样板代码量。

## 常见坑

- 组件卸载后仍 `setState` → 用 `alive` 标志或 AbortController 取消请求；
- 把接口数据复制进全局 store → 造成缓存与真实数据源不一致；
- 忘记处理 loading/error 分支 → 界面白屏或报错。
