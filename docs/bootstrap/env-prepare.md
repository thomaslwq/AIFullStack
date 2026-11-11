---
title: 环境准备：零基础配齐全栈开发环境
description: 手把手安装 Git、VS Code、Node.js、JDK 17、Maven，Windows 与 macOS 双平台说明与校验清单
sidebar_position: 1
---

# 环境准备：零基础配齐全栈开发环境

> 本篇面向基础薄弱的同学：先把开发环境一次性装好，知道每个工具的作用，不在安装环节卡住。后续前端 React、后端 Java 章节都依赖这里的环境。

## 学习目标

完成本篇后，你应当能在终端跑通下表所有版本号命令，并装好编辑器与必备插件。

## 1. 工具清单与作用

| 工具 | 版本要求 | 作用 |
| --- | --- | --- |
| Git | 任意现代版本 | 版本管理，拉取与提交 GitHub 仓库 |
| VS Code | 最新稳定版 | 主力代码编辑器（后端也可用 IntelliJ IDEA） |
| Node.js | 18 LTS 及以上 | 前端 Vite / React 构建运行，包管理 npm |
| JDK | 17+（推荐 Temurin 17） | Java 编译与运行 Spring Boot |
| Maven | 3.9+ | Java 依赖管理与构建 |
| Chrome | 最新版 | 前端调试与预览 |

## 2. Windows 安装步骤

1. **Git**：到 Git 官网下载安装包，一路默认；安装时勾选使用 Git Bash。
2. **Node.js**：到 Node 官网下载 **LTS** 安装包，默认勾选「Add to PATH」。
3. **JDK 17**：下载 [Temurin 17](https://adoptium.net/) 安装包；安装后配置环境变量：
   - 新建系统变量 `JAVA_HOME`，值为 JDK 安装目录（如 `C:\Program Files\Eclipse Adoptium\jdk-17`）；
   - 在 `Path` 中加入 `%JAVA_HOME%\bin`。
4. **Maven**：解压官方压缩包到固定目录，配置 `MAVEN_HOME`，并把 `%MAVEN_HOME%\bin` 加入 `Path`。
5. **VS Code 插件**：ESLint、Prettier、Java Extension Pack、Spring Boot Extension Pack。

## 3. macOS 安装步骤

推荐使用 Homebrew：

```bash
brew install git node@20 openjdk@17 maven
```

安装后按终端提示把 OpenJDK 链接到系统 JVM 目录即可；Maven 与 Node 由 Homebrew 自动配好 PATH。

## 4. 校验命令（逐条执行）

打开终端（Windows 用 Git Bash 或 PowerShell），依次输入：

```bash
git --version
node -v
npm -v
java -version
javac -version
mvn -v
```

每条都打印出版本号即安装成功；提示「command not found / 不是内部命令」通常是 PATH 未生效，**重开一个终端**再试。

## 5. 国内网络优化（可选但推荐）

npm 切换到国内镜像，提升依赖下载速度：

```bash
npm config set registry https://registry.npmmirror.com
```

Maven 可在 `~/.m2/settings.xml` 配置国内仓库镜像；Docker 拉取镜像慢时同理配置镜像加速器。

## 实践任务

1. 把上述 6 条版本命令的输出截图保存，作为环境就绪凭证；
2. 在 VS Code 安装推荐插件，确认编辑器能打开一个空文件夹。

## 常见坑

- **装完 JDK 仍找不到 `java`**：`JAVA_HOME` 或 `Path` 未配置，或终端是安装前打开的，重开终端；
- **Node 版本过高/过低**：优先用 LTS，不要用尝鲜版；Spring Boot 3 要求 JDK 17 及以上；
- **npm install 报网络错误**：切换镜像源后重试；
- **端口冲突**：默认前端 5173、后端 8080，被占用时在对应配置里改端口即可。

下一篇：[前端从零搭建：Vite + React + TypeScript](./frontend-init-vite-react.md)。
