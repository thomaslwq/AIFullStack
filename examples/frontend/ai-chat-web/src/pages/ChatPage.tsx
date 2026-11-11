import { useRef, useState } from 'react';
import { streamChat } from '../api/streamChat';
import type { UIMessage } from '../api/client';
import { useAuthStore } from '../stores/useAuthStore';

export default function ChatPage() {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [reply, setReply] = useState('');
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const replyRef = useRef('');
  replyRef.current = reply;
  const logout = useAuthStore((s) => s.logout);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: UIMessage = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setReply('');
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(next, (delta) => setReply((prev) => prev + delta), controller.signal);
      setMessages((prev) => [...prev, { role: 'assistant', content: replyRef.current }]);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `⚠️ 出错了：${(err as Error).message}` },
        ]);
      }
    } finally {
      setReply('');
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>AI 对话</h2>
        <button onClick={logout}>退出登录</button>
      </header>

      <section className="message-list" style={{ minHeight: 320 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
            <strong>{m.role === 'user' ? '我' : '助手'}：</strong>
            <span>{m.content}</span>
          </div>
        ))}
        {reply && (
          <div>
            <strong>助手：</strong>
            <span>{reply}</span>
          </div>
        )}
      </section>

      <section className="composer" style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          disabled={streaming}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入消息…"
        />
        {streaming ? (
          <button onClick={stop}>停止</button>
        ) : (
          <button onClick={send}>发送</button>
        )}
      </section>
    </main>
  );
}
