import Counter from './Counter';
import TodoList from './TodoList';
import { useLocalStorage } from './useLocalStorage';

export default function App() {
  const [name, setName] = useLocalStorage<string>('demo-name', '同学');

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Hooks Demo</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="你的名字（会持久化）"
      />
      <p>你好，{name}！</p>
      <Counter />
      <TodoList />
    </main>
  );
}
