import { useAuthStore } from '../stores/useAuthStore';

/** 统一响应结构，与后端 ApiResponse 对应 */
type ApiEnvelope<T> = { code: number; message: string; data: T };

/** 基础请求：注入鉴权头、解包统一响应、抛出业务错误 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`/api${path}`, { ...init, headers });
  const body = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok || body.code !== 0) {
    throw new Error(body.message ?? `请求失败（HTTP ${res.status}）`);
  }
  return body.data;
}

export const api = {
  login: (name: string) =>
    request<{ token: string; name: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  conversations: () => request<Conversation[]>('/conversations'),
  messages: (conversationId: string) =>
    request<UIMessage[]>(`/conversations/${conversationId}/messages`),
};

export type Conversation = { id: string; title: string };
export type UIMessage = { role: 'user' | 'assistant' | 'system'; content: string };
