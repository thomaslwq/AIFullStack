---
title: 大模型 API 与 Prompt 工程
description: 兼容 OpenAI 协议的消息结构、后端调用方式、参数控制与 Prompt 设计原则
sidebar_position: 2
---

# 大模型 API 与 Prompt 工程

## 1. 通用消息结构

主流模型 API（OpenAI 兼容协议）以「角色 + 内容」的消息数组组织对话：

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "你是一个简洁的编程助教，只回答与代码相关的问题。" },
    { "role": "user", "content": "解释一下 React 的 useEffect。" },
    { "role": "assistant", "content": "useEffect 用于处理组件副作用……" },
    { "role": "user", "content": "它的依赖数组有什么用？" }
  ],
  "temperature": 0.3,
  "max_tokens": 1024
}
```

角色：

- `system`：全局行为约束，最先放置；
- `user`：用户输入；
- `assistant`：模型历史回复，用于维持多轮上下文。

## 2. 后端调用（Java 示例）

后端统一作为网关调用模型，密钥从环境变量读取：

```java
@Service
public class LlmGateway {

    private final WebClient webClient;
    private final String apiKey;
    private final String baseUrl;

    public LlmGateway(@Value("${app.llm.base-url}") String baseUrl,
                      @Value("${app.llm.api-key}") String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.webClient = WebClient.builder().build();
    }

    public String chat(List<LlmMessage> messages) {
        var body = Map.of(
            "model", "gpt-4o-mini",
            "messages", messages,
            "temperature", 0.3,
            "max_tokens", 1024
        );

        LlmResponse resp = webClient.post()
            .uri(baseUrl + "/chat/completions")
            .header("Authorization", "Bearer " + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(body)
            .retrieve()
            .bodyToMono(LlmResponse.class)
            .block();

        return resp.choices().get(0).message().content();
    }
}
```

> 生产环境用连接池、超时与熔断；`block()` 仅为示例简化，响应式服务应保持 Mono/Flux 链路。

## 3. 参数控制

| 参数 | 作用 | 取值建议 |
| --- | --- | --- |
| `temperature` | 输出随机性 | 代码/事实类 0–0.4；创意类 0.7+ |
| `max_tokens` | 最大生成长度 | 按场景限制，控制成本 |
| `top_p` | 核采样 | 一般保持默认，不与 temperature 同时大改 |
| `response_format` | 结构化输出（如 JSON） | 需要前端解析时强制 JSON |

## 4. Prompt 设计原则

1. **角色与任务明确**：在 system 中说明身份、目标、语气与禁止事项；
2. **给上下文而非只给问题**：把相关资料、历史对话、约束条件组织进消息；
3. **要求输出格式**：需要 JSON/表格/分点时显式给出格式示例；
4. **拆分复杂任务**：先列大纲再展开，比一次性要求长文更稳定；
5. **负面约束具体化**：「不要编造 API」优于「认真回答」；
6. **迭代验证**：准备一组典型问题作为回归用例，改动 Prompt 后对比输出。

## 5. 上下文与成本

- 对话过长会超出上下文窗口并推高成本：按 token 预算裁剪历史，保留最近若干轮 + 摘要；
- 系统 Prompt 与知识库片段单独管理，便于版本化与 A/B 测试；
- 敏感信息在送入模型前做脱敏。

## 实践任务

1. 在后端实现 `/api/ai/chat`，接收消息数组并返回模型回复。
2. 设计一个「代码解释助手」system Prompt，限定输出结构：原理 + 示例 + 注意事项。
3. 准备 5 条回归问题，记录不同 temperature 下的输出差异。

## 常见坑

- 把密钥写进前端或仓库 → 密钥泄露；
- 直接拼接用户输入进系统指令 → Prompt 注入风险，需隔离角色内容；
- 无长度限制导致超长回复与超时；
- 模型输出被当作可信业务数据直接落库或执行。
