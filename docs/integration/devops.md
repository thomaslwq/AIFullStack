---
title: 工程化与部署：构建、容器化与 CI/CD
description: Vite 构建、Docker 多容器、Nginx 静态托管与反向代理、GitHub Actions 自动化流水线
sidebar_position: 2
---

# 工程化与部署

## 1. 前端构建（Vite）

```bash
npm install
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览构建产物
```

环境变量以 `VITE_` 前缀暴露给前端代码：

```
VITE_API_BASE=/api
```

## 2. 后端打包（Maven）

```bash
mvn -DskipTests package
java -jar target/ai-chat-api.jar
```

## 3. Docker 容器化

后端 `Dockerfile`：

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/ai-chat-api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

前端 `Dockerfile`（构建后由 Nginx 托管）：

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

`docker-compose.yml` 串联前端、后端、数据库：

```yaml
services:
  backend:
    build: ./examples/backend/ai-chat-api
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
      - LLM_API_KEY=${LLM_API_KEY}
    ports: ["8080:8080"]
  frontend:
    build: ./examples/frontend/ai-chat-web
    ports: ["8081:80"]
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
```

## 4. Nginx 反向代理

Nginx 同时托管前端静态资源并把 `/api` 转发到后端：

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;

  location / {
    try_files $uri $uri/ /index.html;   # SPA 回退
  }

  location /api/ {
    proxy_pass http://backend:8080;
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;   # 支持 SSE / WebSocket
    proxy_set_header Connection "upgrade";
  }
}
```

## 5. CI/CD 概览

本仓库的文档站使用 GitHub Actions：推送 `main` → 安装依赖 → 构建 Docusaurus → 发布到 `gh-pages` 分支（见仓库 `.github/workflows/deploy.yml`）。

业务应用的流水线通常包含：lint/类型检查 → 单元测试 → 构建产物 → 推送镜像 → 部署到测试/生产环境。

## 实践任务

1. 为实战项目补全前端、后端 Dockerfile 与 compose 文件。
2. 在 CI 中加入前端类型检查与后端测试步骤。
