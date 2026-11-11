import { useEffect, useState } from 'react';

/**
 * 最小全栈 Demo 前端：请求后端 /hello 并展示返回文本。
 * 脚手架由 `npm create vite@latest -- --template react-ts` 生成，本文件替换默认 App.tsx。
 */
function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/hello')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((data) => setMessage(data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>第一个全栈 Demo</h1>
      {error ? (
        <p style={{ color: 'crimson' }}>出错了：{error}</p>
      ) : (
        <p>后端返回：{message || '加载中…'}</p>
      )}
    </main>
  );
}

export default App;
