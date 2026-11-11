---
title: Hooks 深入：状态、副作用与派生数据
description: useState、useEffect、useMemo、useCallback 与自定义 Hook 的用法、依赖数组规则和常见性能坑
sidebar_position: 3
---

# Hooks 深入

Hooks 是 React 让函数组件拥有状态与副作用能力的 API。本篇聚焦最常用的四个 Hook 与自定义 Hook。

## 1. useState：状态与函数式更新

```tsx
const [text, setText] = useState('');

// 依赖旧值时优先使用函数式更新
setText((prev) => prev.trim());
```

- state 更新是**异步批量**的：同一次渲染中多次调用 setter，React 会批量处理；
- 对象/数组类型的 state 需要传入**新引用**，不能原地修改：

```tsx
setUser((prev) => ({ ...prev, name: '新名字' })); // ✅ 新对象
// prev.name = '新名字'; setUser(prev)              // ❌ 原地修改，视图可能不更新
```

## 2. useEffect：处理副作用

副作用指渲染之外的操作：订阅、定时器、请求、操作 DOM、日志等。

```tsx
import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    // 清理函数：组件卸载或依赖变化前执行
    return () => clearInterval(timer);
  }, []);

  return <p>{new Date(now).toLocaleTimeString()}</p>;
}
```

### 依赖数组规则

| 写法 | 行为 | 适用场景 |
| --- | --- | --- |
| `useEffect(fn, [])` | 仅在挂载后执行一次 | 初始化订阅、一次性请求 |
| `useEffect(fn, [a, b])` | 挂载后 + `a`/`b` 变化时执行 | 依赖特定状态的副作用 |
| `useEffect(fn)`（无数组） | 每次渲染后都执行 | 极少数调试场景，生产慎用 |

**清理函数**在卸载、或下次副作用执行前运行，用于解绑订阅、清除定时器，防止内存泄漏。

### 常见陷阱：依赖数组漏写

```tsx
// ❌ 警告：effect 用到了 userId 却没写进依赖
useEffect(() => {
  fetchUser(userId);
}, []);

// ✅ 补上依赖；userId 变化时重新拉取
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

ESLint 的 `react-hooks/exhaustive-deps` 规则会帮你发现漏写。

## 3. useMemo：缓存派生数据

由现有 state 计算出的值，若计算昂贵，可用 `useMemo` 缓存，避免每次渲染重复计算。

```tsx
import { useMemo, useState } from 'react';

export default function FilteredList({ items }: { items: string[] }) {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(
    () => items.filter((it) => it.includes(keyword)),
    [items, keyword],
  );

  return (
    <ul>
      {filtered.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}
```

> 不要为了用而用：简单计算直接内联即可，`useMemo` 本身也有开销。

## 4. useCallback：缓存函数引用

传给子组件的回调函数，若每次渲染都生成新引用，会导致子组件不必要地重渲染。`useCallback` 缓存函数引用。

```tsx
const handleAdd = useCallback(
  (text: string) => {
    setItems((prev) => [...prev, text]);
  },
  [], // setItems 是稳定引用，无需作为依赖
);
```

配合 `React.memo` 包裹的子组件，才能真正避免无效重渲染。

## 5. 自定义 Hook：复用状态逻辑

当两段组件逻辑重复，把它抽成以 `use` 开头的自定义 Hook。

```tsx
import { useEffect, useState } from 'react';

/** 监听窗口宽宽 */
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

// 使用
export default function ResponsiveBox() {
  const width = useWindowWidth();
  return <div>当前窗口宽度：{width}px</div>;
}
```

自定义 Hook 内部可以使用其他 Hook，逻辑在多个组件间共享，但**每个组件拿到的是独立的 state**。

## 实践任务

1. 用 `useEffect` 实现一个文档标题随 state 更新的组件（`document.title = ...`）。
2. 抽取 `useLocalStorage(key, initial)`：把 state 同步到浏览器 localStorage，刷新后保留。
3. 找出示例工程中一处可优化的重复计算，用 `useMemo` 改造并对比。

## 常见坑速查

- 忘记写清理函数 → 定时器/订阅泄漏；
- 依赖数组漏写 → 闭包读到过期值；
- 原地修改对象 state → 视图不更新；
- 在条件语句里调用 Hook → 破坏 Hook 调用顺序，报错。

下一篇：[路由 React Router](./routing.md)。
