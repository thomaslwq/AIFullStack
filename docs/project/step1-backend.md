---
title: Step 1 · 后端落地
description: 实战项目后端逐步实现：骨架、鉴权、消息与会话接口、模型网关、持久化与流式接口
sidebar_position: 2
---

# Step 1 · 后端落地

目标：在 `examples/backend/ai-chat-api/` 完成可运行的 Spring Boot 服务。

## 1. 工程骨架

- 启动类 `AiChatApplication`；
- `common/`：`ApiResponse`、`BizException`、`GlobalExceptionHandler`；
- `config/`：`SecurityConfig`、`CorsConfig`、`OpenApiConfig`；
- `dto/`：`LoginRequest`、`ChatRequest`、`ChatReply`、`MessageVO`。

## 2. 鉴权模块

- `JwtService`：签发/解析 Token（见 [鉴权章节](../backend/security-jwt.md)）；
- `JwtAuthFilter`：解析 `Authorization: Bearer <token>` 并写入 SecurityContext；
- `AuthController`：`POST /api/auth/login` 返回 Token；
- 放行 `/api/auth/**`、`/api/health`，其余接口需认证。

## 3. 领域模型与持久层

```java
@Entity
@Table(name = "conversation")
public class Conversation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private String title;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();
}

@Entity
@Table(name = "message")
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Conversation conversation;
    private String role;       // user / assistant / system
    @Column(length = 2000)
    private String content;
    private LocalDateTime createdAt;
}
```

Repository：`ConversationRepository`、`MessageRepository`，按会话时间正序查询消息。

## 4. 对话服务

```java
@Service
public class ConversationService {

    private final ConversationRepository conversations;
    private final MessageRepository messages;
    private final LlmGateway llm;

    public ConversationService(ConversationRepository c, MessageRepository m, LlmGateway llm) {
        this.conversations = c; this.messages = m; this.llm = llm;
    }

    @Transactional
    public ChatReply ask(String userId, String conversationId, String content) {
        Conversation conv = getOrCreate(userId, conversationId);
        messages.save(new Message(null, conv, "user", content, LocalDateTime.now()));

        List<LlmMessage> history = messages
            .findByConversationIdOrderByCreatedAtAsc(conv.getId())
            .stream()
            .map(m -> new LlmMessage(m.getRole(), m.getContent()))
            .toList();

        String reply = llm.chat(history);
        messages.save(new Message(null, conv, "assistant", reply, LocalDateTime.now()));
        return new ChatReply(conv.getId(), reply);
    }
}
```

## 5. 模型网关

`LlmGateway` 封装大模型调用（见 [大模型 API](../ai/llm-api.md)）：密钥走 `app.llm.api-key` 环境变量，超时与错误统一转换为 `BizException`。流式版本见 [SSE 章节](../ai/streaming.md)，提供 `/api/ai/chat-stream`。

## 6. 接口清单

| 方法 | 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | 登录获取 Token | 否 |
| GET | `/api/health` | 健康检查 | 否 |
| GET | `/api/conversations` | 当前用户会话列表 | 是 |
| GET | `/api/conversations/{id}/messages` | 会话历史消息 | 是 |
| POST | `/api/messages` | 发送消息（非流式） | 是 |
| POST | `/api/ai/chat-stream` | 流式对话 SSE | 是 |

## 7. 本地运行

```bash
cd examples/backend/ai-chat-api
# 准备环境变量：DB_PASSWORD、JWT_SECRET、LLM_API_KEY
mvn spring-boot:run
```

用 curl 验证：

```bash
TOKEN=$(curl -s -X POST localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"name":"demo"}' | jq -r '.data.token')

curl -X POST localhost:8080/api/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"content":"用一句话介绍 React"}'
```

## 8. 自检清单

- [ ] 未带 Token 访问 `/api/messages` 返回 401；
- [ ] 消息落库后可通过历史接口读回；
- [ ] 模型不可用时返回标准错误结构，不抛出堆栈给前端；
- [ ] OpenAPI 文档可访问，接口描述完整。

下一步：[Step 2 · 前端落地](./step2-frontend.md)。
