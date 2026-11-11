---
title: TypeScript + React
description: Props 与 State 类型标注、泛型组件、事件类型与 Hooks 类型写法
sidebar_position: 7
---

# TypeScript + React

TypeScript 在 React 工程中主要解决：props 形状、state 类型、事件对象类型与通用组件复用。

## 1. Props 类型

```tsx
type ButtonProps = {
  label: string;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({ label, variant = 'primary', disabled, onClick }: ButtonProps) {
  return (
    <button className={variant} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
```

## 2. State 类型

```tsx
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
```

## 3. 事件类型

```tsx
function SearchInput() {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 提交逻辑
  };

  return (
    <form onSubmit={onSubmit}>
      <input value={value} onChange={onChange} />
    </form>
  );
}
```

## 4. 泛型组件

做一个通用列表组件，通过泛型保留传入项的类型：

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

export function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item, i)}</li>)}</ul>;
}
```

使用时类型自动推导：

```tsx
<List items={['a', 'b']} renderItem={(s) => <span>{s.toUpperCase()}</span>} />
```

## 5. 常见内置类型

| 场景 | 类型 |
| --- | --- |
| 子节点 | `React.ReactNode` |
| 组件 props | `React.ComponentProps<'button'>` |
| 表单事件 | `React.FormEvent<T>` |
| 输入变更 | `React.ChangeEvent<T>` |

## 实践任务

1. 为前几节的 `Counter`、`TodoList` 补充完整 TypeScript 类型。
2. 抽取一个 `Modal` 组件，用泛型或 `PropsWithChildren` 支持子节点。
