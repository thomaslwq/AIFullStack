# ai-chat-api（实战后端核心源码）

对应教程：[Step 1 · 后端落地](../../../docs/project/step1-backend.md)。

## 技术栈

Java 17 · Spring Boot 3 · Spring Security · JWT · Spring Data JPA · MySQL。

## 目录与文件

```
src/main/
├── java/com/example/aichat/
│   ├── AiChatApplication.java      # 启动类
│   ├── common/                     # 统一响应、业务异常、全局异常处理
│   ├── config/                     # Security、CORS 配置
│   ├── security/                    # JWT 服务与认证过滤器
│   ├── dto/                        # 请求 / 响应记录类型
│   ├── entity/                     # JPA 实体
│   ├── repository/                 # 数据访问
│   ├── service/                    # 业务逻辑与模型网关
│   └── controller/                 # REST 接口
└── resources/application.yml
```

## 如何组装完整工程

1. 用 [Spring Initializr](https://start.spring.io/) 选择 Java 17、Spring Boot 3、Web、Validation、JPA、MySQL 依赖；
2. 按包路径拷入本目录 Java 类与 `application.yml`；
3. 补齐 `pom.xml` 中 jjwt 等依赖（见下文）；
4. 配置环境变量后启动。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `DB_PASSWORD` | MySQL 密码 |
| `JWT_SECRET` | JWT 签名密钥（足够长度随机串） |
| `LLM_API_KEY` | 大模型 API Key（仅后端持有） |
| `LLM_BASE_URL` | 模型接口地址 |

## 运行

```bash
mvn spring-boot:run
# 健康检查
curl localhost:8080/api/health
```

## 说明

示例聚焦教学关键路径，省略了单元测试、Dockerfile 与部分样板；完整落地步骤见教程 Step 1。
