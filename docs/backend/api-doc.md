---
title: 接口文档：OpenAPI / Swagger
description: 基于 springdoc-openapi 自动生成接口文档，统一描述请求、响应与鉴权方式
sidebar_position: 6
---

# 接口文档：OpenAPI / Swagger

## 1. 依赖

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

启动后访问 `/swagger-ui.html` 查看文档，`/v3/api-docs` 输出 OpenAPI JSON。

## 2. 全局配置与 JWT 描述

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI()
            .info(new Info().title("AI Chat API").version("v1").description("AI 对话应用后端接口"))
            .components(new Components().addSecuritySchemes("bearer",
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
            .addSecurityItem(new SecurityRequirement().addList("bearer"));
    }
}
```

## 3. 接口注解

```java
@RestController
@RequestMapping("/api/messages")
@Tag(name = "消息", description = "对话消息相关接口")
public class MessageController {

    @Operation(summary = "发送消息", description = "提交用户消息，返回模型回复")
    @PostMapping
    public ApiResponse<ChatReply> send(
        @Valid @RequestBody ChatRequest request) {
        // ...
    }
}
```

- `@Tag`：分组；`@Operation`：接口说明；`@Parameter`：参数说明；
- DTO 字段可用 `@Schema(description = "...")` 描述；
- 前端可直接导入 OpenAPI JSON 生成 TypeScript 请求代码（如 OpenAPI Generator）。

## 4. 前后端契约协作

1. 后端先定义 DTO 与响应结构，生成 OpenAPI；
2. 前端基于契约生成类型与请求函数；
3. 接口变更必须同步更新文档，破坏性变更走版本号或兼容字段。

## 实践任务

1. 为实战后端所有接口补全 `@Operation` 与 `@Schema` 描述。
2. 导出 OpenAPI JSON，用工具生成前端 TypeScript 类型与请求函数。
