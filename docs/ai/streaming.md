---
title: 流式输出：SSE 逐字渲染
description: Server-Sent Events 协议、后端转发模型流式响应、前端增量拼接渲染与中断处理
sidebar_position: 4
---

# 流式输出：SSE 逐字渲染

非流式接口要等模型整段生成完才返回，首字等待长。流式输出让模型边生成边推送，前端逐字渲染，体验显著提升。

## 1. SSE 协议要点

- HTTP 长连接，响应头 `Content-Type: text/event-stream`；
- 每条消息以 `data: {...}\n\n` 格式推送；
- 浏览器通过 `EventSource` 或 `fetch + ReadableStream` 接收；
- 单向：服务器 → 客户端。

## 2. 后端流式转发（Java）

后端从模型接口读取流，原样转发给前端，保持 Flux 响应式链路：

```java
@RestController
@RequestMapping("/api/ai")
public class ChatStreamController {

    private final LlmStreamGateway gateway;

    public ChatStreamController(LlmStreamGateway gateway) {
        this.gateway = gateway;
    }

    @PostMapping(value = "/chat-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Chunk>> stream(@RequestBody ChatRequest request) {
        return gateway.streamChat(request.messages())
            .map(delta -> ServerSentEvent.<Chunk>builder()
                .data(new Chunk(delta, false))
                .build())
            .concatWith(Flux.just(ServerSentEvent.<Chunk>builder()
                .data(new Chunk("", true)).build())); // 结束标记
    }
}
```

模型侧的流式响应通常也是逐 chunk 的 `delta.content`，后端把每个增量包装成 SSE 事件下发。

## 3. 前端接收与渲染

`fetch` 读取流式响应（`EventSource` 仅支持 GET，POST 请求需用 fetch + ReadableStream）：

```ts
async function streamChat(messages: Message[], onDelta: (text: string) => void) {
  const res = await fetch('/api/ai/chat-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 以 \n\n 分隔事件
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    for (const evt of events) {
      const line = evt.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      const chunk = JSON.parse(line.slice(6));
      if (!chunk.done) onDelta(chunk.text);
    }
  }
}
```

组件中累积到当前回复消息：

```tsx
const [reply, setReply] = useState('');
await streamChat(messages, (delta) => setReply((prev) => prev + delta));
```

## 4. 中断与错误处理

- **停止生成**：前端 `reader.cancel()` 关闭读取；后端监听连接断开，取消上游模型请求；
- **错误事件**：流中推送 `error` 类型事件，前端提示并保留已生成内容；
- **重连**：SSE 天然支持断线重连，但对话流通常不自动重放，需前端手动重试。

## 实践任务

1. 在实战后端把 `/api/ai/chat` 改造为 SSE 流式版本。
2. 前端增加「停止生成」按钮，取消读取并关闭上游连接。
3. 处理流中途报错：展示错误提示且不丢失已输出文本。
