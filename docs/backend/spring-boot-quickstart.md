---
title: Spring Boot 入门：REST 服务骨架
description: 工程结构、依赖注入、Controller/Service 分层、统一响应与参数校验，跑起第一个 REST 接口
sidebar_position: 3
---

# Spring Boot 入门：REST 服务骨架

## 1. 工程结构与依赖

一个最小 Spring Boot 工程：

```
ai-chat-api/
├── pom.xml
└── src/main/
    ├── java/com/example/aichat/
    │   ├── AiChatApplication.java
    │   ├── common/        # 统一响应、异常处理
    │   ├── controller/
    │   ├── service/
    │   └── dto/
    └── resources/
        └── application.yml
```

`pom.xml` 关键依赖（Web + Validation + Lombok 可选）：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.2</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

启动类：

```java
@SpringBootApplication
public class AiChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiChatApplication.class, args);
    }
}
```

## 2. 统一响应结构

```java
public record ApiResponse<T>(int code, String message, T data) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(0, "ok", data);
    }
    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
```

## 3. DTO 与参数校验

```java
public record ChatRequest(
    @NotBlank(message = "消息内容不能为空") String content,
    String conversationId
) {}
```

## 4. Controller 与 Service

```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    // 构造器注入：Spring 自动装配依赖
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ApiResponse<ChatReply> send(@Valid @RequestBody ChatRequest request) {
        return ApiResponse.ok(messageService.reply(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<Message> get(@PathVariable Long id) {
        return ApiResponse.ok(messageService.findById(id));
    }
}
```

```java
@Service
public class MessageService {

    public ChatReply reply(ChatRequest request) {
        // 业务逻辑：记录消息、调用模型网关等
        return new ChatReply("echo: " + request.content(), LocalDateTime.now().toString());
    }

    public Message findById(Long id) {
        // 示例占位：真实实现查询数据库
        return new Message(id, "示例消息");
    }
}
```

### 依赖注入要点

- Spring 容器管理 Bean；`@Service`、`@RestController`、`@Component` 标注的类会被扫描注册；
- 推荐**构造器注入**（如上），字段可声明为 `final`，便于测试与明确依赖；
- 同一接口多个实现时用 `@Qualifier` 或 `@Primary` 指定。

## 5. 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BizException.class)
    public ApiResponse<Void> handleBiz(BizException e) {
        return ApiResponse.fail(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
            .map(f -> f.getDefaultMessage())
            .findFirst().orElse("参数错误");
        return ApiResponse.fail(400, msg);
    }
}
```

## 6. 配置文件 `application.yml`

```yaml
server:
  port: 8080
spring:
  application:
    name: ai-chat-api
app:
  llm:
    base-url: https://api.example.com
    api-key: ${LLM_API_KEY:}
```

敏感配置通过环境变量注入，不写死在代码库。

## 实践任务

1. 实现 `GET /api/health` 返回服务状态与当前时间。
2. 为 `ChatRequest` 增加长度校验（`@Size`），启动服务并用 curl 测试非法参数返回 400 结构错误。
3. 对照 `examples/backend/ai-chat-api/` 的分层实现检查。

## 常见坑

- 忘记 `@RestController` / `@RequestMapping`，接口 404；
- 校验注解加了但 Controller 参数没加 `@Valid`，校验不生效；
- Bean 循环依赖：优先重构职责划分，而非打开循环依赖配置。

下一篇：[持久层](./persistence.md)。
