---
title: React + MyBatis 后端全栈联调
description: React 页面请求分页用户列表、删除用户，处理加载与错误，完成前后端用户管理闭环
sidebar_position: 7
---

# React + MyBatis 后端全栈联调

本篇把[分页接口](./pagination.md)接到 React 页面：展示用户列表、翻页、删除，并处理加载与错误状态。

## 1. 前端类型与请求

```tsx
type User = {
  id: number;
  username: string;
  age: number;
  email: string;
};

type PageResult = {
  records: User[];
  total: number;
  pageNum: number;
  pageSize: number;
};

async function fetchPage(pageNum: number, pageSize: number): Promise<PageResult> {
  const res = await fetch(
    `/api/user/page?pageNum=${pageNum}&pageSize=${pageSize}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  return body.data as PageResult;
}
```

> 生产项目按[数据请求章节](../frontend/data-fetching.md)使用 React Query 管理缓存、加载与重试；这里先用原生 `fetch` 讲清链路。开发期通过 Vite 代理把 `/api` 转发到后端 8080，规避跨域（见[前后端联调](../bootstrap/fullstack-run-first.md)）。

## 2. 页面组件

```tsx
import { useCallback, useEffect, useState } from 'react';

export default function UserPage() {
  const [list, setList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pageSize = 5;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPage(pageNum, pageSize);
      setList(data.records);
      setTotal(data.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [pageNum]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('确认删除该用户？')) return;
    await fetch(`/api/user/${id}`, { method: 'DELETE' });
    load();
  };

  const pages = Math.ceil(total / pageSize);

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2>用户管理（MyBatis + React）</h2>

      {loading && <p>加载中…</p>}
      {error && <p style={{ color: 'crimson' }}>出错了：{error}</p>}

      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>年龄</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.age}</td>
              <td>{item.email}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button disabled={pageNum <= 1} onClick={() => setPageNum((p) => p - 1)}>
          上一页
        </button>
        <span style={{ margin: '0 1rem' }}>
          第 {pageNum} / {pages} 页 · 共 {total} 条
        </span>
        <button disabled={pageNum >= pages} onClick={() => setPageNum((p) => p + 1)}>
          下一页
        </button>
      </div>
    </main>
  );
}
```

## 3. 联调要点

1. **启动顺序**：先启动 MySQL 与后端（8080），再启动前端（5173）；
2. **跨域**：本地开发用 Vite 代理或后端 CORS 放行 `http://localhost:5173`；
3. **响应结构**：后端统一返回 `{ code, message, data }`，前端从 `body.data` 取分页结果；
4. **删除后刷新**：调用删除接口成功后重新拉取当前页列表；若当前页删空，可回退到上一页。

## 实践任务

1. 增加「新增用户」表单（用户名、年龄、邮箱），提交调用 `POST /api/user` 后刷新列表；
2. 接入 React Query 替换手写 `loading/error` 状态；
3. 用 [MyBatis-Plus 分页](./plus-extension.md)替换后端原生 limit 分页，前端页面无需改动。

## 常见坑

- **列表为空但接口有数据**：前端取错了响应层级（应取 `data.records`）；
- **翻页不刷新**：`useEffect` 依赖未包含 `pageNum` 或加载函数；
- **删除后页码越界**：删除末页最后一条时需回退页码；
- **跨域报错**：检查后端 CORS 来源或 Vite 代理目标端口。

至此 MyBatis 模块完成。可回到[后端 Java 概览](../backend/overview.md)继续鉴权与接口文档章节，或进入[实战项目](../project/overview.md)。
