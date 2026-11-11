import type { UIMessage } from './client';

type StreamChunk = { text: string; done: boolean };

/**
 * 以 SSE 方式流式调用后端对话接口。
 * @param messages  历史消息（含本轮用户消息）
 * @param onDelta   每收到一段增量文本回调
 * @param signal    用于中止请求的 AbortSignal
 */
export async function streamChat(
  messages: UIMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const token = useAuthToken();
  const res = await fetch('/api/ai/chat-stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok || !res.body) throw new Error('流式请求失败');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const evt of events) {
      const line = evt.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      const chunk = JSON.parse(line.slice(6)) as StreamChunk;
      if (chunk.done) return;
      if (chunk.text) onDelta(chunk.text);
    }
  }
}

function useAuthToken(): string | null {
  // 避免在模块顶部引入 store 造成循环依赖，运行时读取即可
  const raw = localStorage.getItem('aichat-auth');
  try {
    return raw ? JSON.parse(raw).state.token : null;
  } catch {
    return null;
  }
}
