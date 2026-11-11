import { useState } from 'react';

/** 计数组件：演示 useState 与函数式更新 */
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section style={{ margin: '1rem 0' }}>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>{' '}
      <button onClick={() => setCount(0)}>重置</button>
    </section>
  );
}
