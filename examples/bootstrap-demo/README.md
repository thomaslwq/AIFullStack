# bootstrap-demo：0 到 1 最小全栈示例

对应教程：

- [环境准备](../../docs/bootstrap/env-prepare.md)
- [前端从零搭建](../../docs/bootstrap/frontend-init-vite-react.md)
- [后端从零搭建](../../docs/bootstrap/backend-init-springboot.md)
- [前后端联调](../../docs/bootstrap/fullstack-run-first.md)

本目录提供搭建完成后的**关键源码**；脚手架由命令生成，避免重复提交依赖配置。

## 目录

```text
bootstrap-demo/
├── frontend/
│   └── src/App.tsx          # 最小 React + TS 页面，请求后端 /hello
└── backend/
    ├── pom.xml               # Spring Boot 3 + Web + Validation
    └── src/main/
        ├── java/com/example/demo/
        │   ├── DemoApplication.java
        │   ├── HelloController.java
        │   └── config/CorsConfig.java
        └── resources/application.yml
```

## 组装步骤

### 前端

```bash
npm create vite@latest my-ai-frontend -- --template react-ts
cd my-ai-frontend && npm install
# 将本目录 frontend/src/App.tsx 拷入 src/，替换默认内容
npm run dev
```

### 后端

1. 在 [start.spring.io](https://start.spring.io/) 选 Maven、Java 17、Spring Boot 3.3、依赖 Spring Web + Validation；
2. 按包路径拷入 `backend/` 下的 Java 类与 `application.yml`；
3. 运行：

```bash
mvn spring-boot:run
```

## 联调验证

1. 后端启动在 `8080`，前端在 `5173`；
2. 打开前端页面，应显示后端 `/hello` 返回的文字；
3. 若跨域被拦截，检查 `CorsConfig` 放行来源是否为 `http://localhost:5173`。

## 说明

示例聚焦最小闭环：一个接口、一次请求、一段展示。完整分层、鉴权与持久化见后端实战工程 [`../backend/ai-chat-api/`](../backend/ai-chat-api/README.md)。
