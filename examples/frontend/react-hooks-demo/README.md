# react-hooks-demo

React + TypeScript Hooks 教学示例，对应教程：

- [React 速通：组件、Props 与 State](../../../docs/frontend/react-quickstart.md)
- [Hooks 深入](../../../docs/frontend/hooks.md)

## 包含内容

| 文件 | 演示点 |
| --- | --- |
| `src/Counter.tsx` | `useState`、函数式更新、事件处理 |
| `src/TodoList.tsx` | 状态提升、列表渲染与 `key`、增删操作 |
| `src/useLocalStorage.ts` | 自定义 Hook：state 与 localStorage 同步 |
| `src/App.tsx` | 组合上述组件 |

## 如何运行

```bash
# 在任意空目录初始化 Vite React TS 工程
npm create vite@latest demo -- --template react-ts
cd demo && npm install

# 将本目录 src/ 下文件拷入 src/，替换默认内容
npm run dev
```

## 实践对照

- 改造 `useLocalStorage`：支持 JSON 对象序列化；
- 为 `TodoList` 增加「全部完成」与「清空已完成」。
