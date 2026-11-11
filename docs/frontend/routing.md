---
title: 路由：React Router
description: 使用 React Router v6 搭建嵌套路由、动态参数与编程式导航
sidebar_position: 4
---

# 路由：React Router

单页应用（SPA）的路由在浏览器端完成 URL 与视图的映射，不刷新页面即可切换页面。本课程使用 React Router v6。

## 1. 基础路由

```tsx
import { createBrowserRouter, RouterProvider, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import UserDetail from './pages/UserDetail';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/users/:id', element: <UserDetail /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

导航链接使用 `<NavLink>`，可通过 `isActive` 高亮当前页：

```tsx
<NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
  首页
</NavLink>
```

## 2. 动态参数与嵌套路由

```tsx
const router = createBrowserRouter([
  {
    path: '/users',
    element: <UsersLayout />,
    children: [
      { index: true, element: <UserList /> },
      { path: ':id', element: <UserDetail /> },
    ],
  },
]);
```

读取动态参数：

```tsx
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  // ... 根据 id 拉取用户
}
```

父布局通过 `<Outlet />` 渲染子路由出口。

## 3. 编程式导航与查询参数

```tsx
import { useNavigate, useSearchParams } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') ?? '/';

  const onSuccess = () => navigate(redirect, { replace: true });
  // ...
}
```

## 实践任务

1. 为示例应用增加 `/about` 页面与顶部导航高亮。
2. 实现 `/users/:id` 详情页，路由参数变化时重新请求数据。

## 常见坑

- 部署到子路径（如 GitHub Pages 的 `/AIFullStack/`）需配置 `basename`；
- 刷新子路由 404 是服务端未做 SPA 回退重写，静态托管需配置 fallback 到 `index.html`。
