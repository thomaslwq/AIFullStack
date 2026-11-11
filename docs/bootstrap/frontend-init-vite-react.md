---
title: 前端从零搭建：Vite + React + TypeScript
description: 用脚手架命令逐行创建 React 项目，理解目录结构，改出第一个页面并跑起开发服务器
sidebar_position: 2
---

# 前端从零搭建：Vite + React + TypeScript

## 学习目标

不依赖现成模板下载，用命令行独立创建一个 React + TS 项目；看懂每个目录文件的作用；修改代码并看到页面热更新。

## 1. 创建项目

在你存放代码的目录下执行：

```bash
npm create vite@latest my-ai-frontend -- --template react-ts
cd my-ai-frontend
npm install
npm run dev
```

命令说明：

- `npm create vite@latest`：拉取最新 Vite 脚手架；
- `--template react-ts`：选择 React + TypeScript 模板；
- `npm install`：下载依赖（首次较慢）；
- `npm run dev`：启动开发服务器，默认地址 `http://localhost:5173`。

## 2. 目录逐行讲解

```text
my-ai-frontend/
├── index.html          # 页面入口 HTML，挂载 #root 节点
├── src/
│   ├── main.tsx        # JS 入口：把根组件挂载到 #root
│   ├── App.tsx         # 根组件，页面内容从这里组织
│   ├── App.css         # 根组件样式
│   └── vite-env.d.ts   # Vite 的 TypeScript 类型声明
├── package.json        # 依赖列表与启动脚本
├── tsconfig.json       # TypeScript 编译配置
└── vite.config.ts      # Vite 构建与代理配置
```

## 3. 改出第一个页面

打开 `src/App.tsx`，替换为最小内容：

```tsx
function App() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>我的第一个 AI FullStack React 页面</h1>
      <p>如果你能在浏览器看到这句话，说明前端项目已经跑起来了。</p>
    </main>
  );
}

export default App;
```

保存后浏览器会**自动热更新**，无需手动刷新。这就是 Vite 的开发体验。

## 4. 常用脚本（package.json）

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器，支持热更新 |
| `npm run build` | 打包生产环境静态资源到 `dist/` |
| `npm run preview` | 本地预览打包产物 |
| `npm run lint` | 代码规范检查（模板自带） |

## 实践任务

1. 独立创建项目并成功启动，浏览器看到自定义文字；
2. 在页面上再加一个计数器按钮（提示：`useState`），对照 [React 速通](../frontend/react-quickstart.md)。

## 常见坑

- **端口被占用**：`npm run dev -- --port 3001` 指定新端口；
- **`npm install` 报错**：网络问题，先切换国内镜像（见[环境准备](./env-prepare.md)）；
- **改了页面没变**：确认保存成功、文件在 `src/` 下；浏览器强刷一次；
- **TypeScript 红色报错**：先读提示的类型行，模板默认配置无需改动。

下一篇：[后端从零搭建：Spring Boot 项目](./backend-init-springboot.md)。
