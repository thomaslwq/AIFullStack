import { useState } from 'react';

type Todo = { id: number; text: string; done: boolean };

/** 待办列表：演示局部状态、列表 key 与增删操作 */
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
    setText('');
  };

  const toggle = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const remove = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <section style={{ margin: '1rem 0' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        placeholder="输入待办，回车添加"
      />{' '}
      <button onClick={addTodo}>添加</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                {t.text}
              </span>
            </label>{' '}
            <button onClick={() => remove(t.id)}>删除</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
