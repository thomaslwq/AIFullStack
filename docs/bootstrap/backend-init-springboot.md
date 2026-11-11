---
title: 后端从零搭建：Spring Boot 项目
description: 通过 start.spring.io 或命令行生成 Spring Boot 工程，理解基础结构，写出并访问第一个接口
sidebar_position: 3
---

# 后端从零搭建：Spring Boot 项目

## 学习目标

从零生成 Spring Boot 工程，看懂基础目录，写出第一个 REST 接口并在浏览器访问到返回结果。

## 1. 方式一：start.spring.io（推荐零基础）

访问 [start.spring.io](https://start.spring.io/)，按下面填写：

| 配置项 | 选择 |
| --- | --- |
| Project | Maven |
| Language | Java |
| Spring Boot | 3.3.x（最新稳定版） |
| Java | 17 |
| Dependencies | Spring Web、Validation |

点击 **GENERATE** 下载 zip，解压后用 VS Code 或 IntelliJ IDEA 打开。

## 2. 方式二：命令行直接生成（进阶）

```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,validation \
  -d type=maven-project \
  -d javaVersion=17 \
  -d baseDir=my-ai-backend \
  -o my-ai-backend.zip

unzip my-ai-backend.zip -d my-ai-backend
cd my-ai-backend
```

## 3. 项目结构

```text
my-ai-backend/
├── pom.xml                                   # Maven 依赖与构建配置
└── src/main/
    ├── java/com/example/demo/
    │   └── DemoApplication.java             # 启动类
    └── resources/
        └── application.yml                   # 应用配置（端口、数据库等）
```

启动类带有 `@SpringBootApplication`，`main` 方法调用 `SpringApplication.run` 即启动内嵌 Tomcat。

## 4. 写第一个 Hello 接口

在启动类同包下新建 `HelloController.java`：

```java
package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Spring Boot 后端启动成功！";
    }
}
```

## 5. 启动并访问

```bash
mvn spring-boot:run
```

启动成功后，浏览器或 curl 访问：

```bash
curl http://localhost:8080/hello
```

返回 `Spring Boot 后端启动成功！` 即后端跑通。

## 6. 改端口（可选）

如果 8080 被占用，编辑 `src/main/resources/application.yml`：

```yaml
server:
  port: 8081
```

## 实践任务

1. 成功启动后端，访问 `/hello` 拿到返回文本；
2. 再加一个 `GET /api/health` 接口，返回 `{"status":"up"}`，对照 [Spring Boot 入门](../backend/spring-boot-quickstart.md)。

## 常见坑

- **JDK 版本不匹配**：Spring Boot 3 强制要求 JDK 17+；
- **8080 端口占用**：在 `application.yml` 修改 `server.port`；
- **依赖下载慢**：配置 Maven 国内镜像；
- **控制器 404**：确认类在启动类所在包或其子包内（组件扫描范围），且标注了 `@RestController`。

下一篇：[前后端联调：第一个全栈 Demo](./fullstack-run-first.md)。
