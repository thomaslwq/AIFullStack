---
title: React 速通：组件、Props 与 State
description: 用最小必要知识写出第一个交互式 React 组件，理解 JSX、函数组件、Props、State 与事件
sidebar_position: 2
---

# React 速通：组件、Props 与 State

本篇用最少的概念带你写出可运行的交互式组件。假设你已了解 HTML/CSS/JavaScript 基础。

## 1. 组件与 JSX

React 应用由**组件**组成。组件是一个返回 UI 描述的函数，UI 使用 JSX（JavaScript 的 XML 语法扩展）书写。

```tsx
// Greeting.tsx
type GreetingProps = { name: string };

export default function Greeting({ name }: GreetingProps) {
  return (
    <div className="greeting">
      <h2>你好，{name}！</h2>
      <p>这是我的第一个 React 组件。</p>
    </div>
  );
}
```

要点：

- 组件名**首字母大写**，否则 React 会把它当作原生 HTML 标签；
- JSX 中用 `{}` 嵌入任意 JavaScript 表达式；
- 相邻多个元素必须用一个父节点（或 Fragment `<>...</>`）包裹。

## 2. Props：父传子的只读数据

组件通过 **props** 接收外部传入的数据。props 在组件内部**只读**，子组件不能修改它。

```tsx
// App.tsx
import Greeting from './Greeting';

export default function App() {
  return (
    <main>
      <Greeting name="文钦" />
      <Greeting name="FullStack" />
    </main>
  );
}
```

## 3. State：组件自己的可变记忆

props 是外部传入的、只读；**state** 是组件内部维护的、会随时间变化的数据。调用 setter 更新 state，React 才会重新渲染组件。

```tsx
import { useState } from 'react';

export default function Counter() {
  // count：当前状态；setCount：更新状态的函数
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </section>
  );
}
```

### 三条关键规则

1. **只在顶层调用 Hook**，不要放在条件、循环或嵌套函数里；
2. **永远不要直接修改 state**（如 `count++`），必须通过 setter；
3. 更新 state 若依赖旧值，使用函数式更新：`setCount((prev) => prev + 1)`，避免闭包读到旧值。

## 4. 事件与条件渲染

```tsx
import { useState } from 'react';

export default function LoginPanel() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn ? (
        <p>欢迎回来！</p>
      ) : (
        <button onClick={() => setLoggedIn(true)}>登录</button>
      )}
      {loggedIn && (
        <button onClick={() => setLoggedIn(false)}>退出登录</button>
      )}
    </div>
  );
}
```

- 条件渲染用三元表达式或 `&&`；
- 事件处理函数接收事件对象，写法为 `onClick={handler}`（注意驼峰命名）。

## 5. 状态提升

当多个兄弟组件需要共享同一份数据时，把 state **提升**到它们最近的共同父组件，由父组件持有 state，并通过 props 向下传值、传回调。

```tsx
function SearchBox({ keyword, onChange }: { keyword: string; onChange: (v: string) => void }) {
  return <input value={keyword} onChange={(e) => onChange(e.target.value)} placeholder="搜索" />;
}

function ResultList({ keyword }: { keyword: string }) {
  return <p>搜索关键词：{keyword || '（空）'}</p>;
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  return (
    <div>
      <SearchBox keyword={keyword} onChange={setKeyword} />
      <ResultList keyword={keyword} />
    </div>
  );
}
```

> 这就是「视图 = f(state)」的体现：state 在父组件，子组件只负责按传入的 props 渲染。

## 实践任务

1. 实现一个 `TodoList` 组件：输入框 + 添加按钮，下方列表展示已添加条目，每条可删除。
2. 思考：输入框的值应该是局部 state 还是提升到父组件？什么情况下需要提升？
3. 对照示例源码 `examples/frontend/react-hooks-demo/` 检查实现差异。

## 常见坑

- **直接改 state** 导致视图不更新：必须用 setter；
- **props 被修改**：子组件试图改写传入对象，应改为回调通知父组件更新；
- **列表缺少 key**：渲染数组时给每项稳定的 `key`，帮助 React 识别元素身份。

下一篇：[Hooks 深入](./hooks.md)。
