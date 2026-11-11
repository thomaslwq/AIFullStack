---
title: Cloud Code：容器化辅助开发实操
description: Cloud Code 插件如何用标准化容器环境运行与调试 Spring Boot / Node 项目，减少本地环境配置困扰
sidebar_position: 1
---

# Cloud Code：容器化辅助开发实操

## 学习目标

了解 Cloud Code 适用场景，学会用它为项目生成容器配置、在容器内运行与调试服务；理解「环境标准化」为什么能帮新手避开本地安装问题。

## 1. 它是什么

Cloud Code 是 Google 提供的编辑器插件（支持 VS Code 与 JetBrains IDE），面向容器化与云原生开发：

- 在本地容器中运行、调试应用，环境与开发团队保持一致；
- 一键生成 Dockerfile、Kubernetes / Skaffold 配置；
- 对接 Google Cloud 与 Kubernetes，查看服务、日志与端口；
- 支持 Java、Node.js、Python、Go 等运行时。

> 对基础薄弱的同学，它的最大价值是：**不必在本机折腾 JDK、Maven、Node 的版本与环境变量**，把运行环境交给容器标准化处理。

## 2. 前置准备

- 安装 Docker Desktop（或本地容器运行时）并保持启动；
- VS Code 插件市场搜索 **Cloud Code** 安装；
- 首次使用按插件提示完成初始化。

## 3. 实操：在容器内运行 Spring Boot

1. 打开上一篇建好的 `my-ai-backend` 工程；
2. 打开 Cloud Code 面板，选择添加容器 / Kubernetes 运行配置；
3. 选择 Java 运行时，插件据此生成 Dockerfile 与调试配置；
4. 点击 Run，插件自动构建镜像、启动容器并映射端口；
5. 在插件面板看到服务运行后，通过映射端口访问 `/hello` 接口；
6. 可在代码断点处调试，容器内调试流程与本地一致。

前端 Vite + React 工程同理：选择 Node 运行时生成容器配置，开发服务器端口映射到本地浏览器访问。

## 4. 什么时候用、什么时候不用

| 场景 | 是否适合 Cloud Code |
| --- | --- |
| 团队环境统一、避免「我本地能跑」 | 适合 |
| 需要调试容器内依赖（数据库、向量库） | 适合 |
| 简单单文件练习、零基础刚入门命令行 | 先用本地 Node/JDK 跑通，再上容器 |
| 不使用 Docker / 云服务的纯本地学习 | 非必需 |

## 5. 与本课程结合

后续实战项目会用 Docker Compose 同时拉起后端、前端与数据库（见[工程化与部署](../integration/devops.md)）。Cloud Code 可以作为容器开发的可视化辅助；RAG、Agent 章节涉及向量库时，也可用容器一次性拉起整套依赖服务。

## 实践任务

1. 为 `my-ai-backend` 用 Cloud Code 生成 Docker 配置并在容器中启动；
2. 记录容器内访问接口的端口映射方式。

## 常见坑

- **Docker Desktop 未启动**：插件无法构建或启动容器；
- **镜像拉取慢**：配置 Docker 镜像加速器；
- **端口未映射到本地**：在运行配置中确认容器端口与本地端口的映射；
- **调试断点不生效**：确认使用插件生成的调试配置，而非普通本地启动。

> 同类工具对照：除 Cloud Code 外，Docker Dev Containers（VS Code Dev Containers 扩展）也能把开发环境放进容器，思路一致，可按团队习惯选择。

下一篇：[Cursor：AI 编辑器辅助写全栈代码](./cursor-practice.md)。
