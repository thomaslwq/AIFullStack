---
title: 前后端联调：第一个全栈 Demo
description: 让 React 前端请求 Spring Boot 后端接口，理解跨域成因并解决，完成 0 到 1 的全栈闭环
sidebar_position: 4
---

# 前后端联调：第一个全栈 Demo

## 学习目标

前端页面请求后端接口并展示返回数据；理解浏览器跨域是怎么回事、后端如何放行；完成「前端 → 后端 → 数据回到页面」的最小闭环。

## 1. 跨域是怎么回事

前端运行在 `http://localhost:5173`，后端在 `http://localhost:8080`，协议、域名、端口任一不同即为**跨域**。浏览器默认禁止页面脚本读取跨域响应，需要后端通过 CORS（跨域资源共享）显式放行前端来源。

## 2. 后端添加跨域配置

在后端工程新建 `config/CorsConfig.java`：

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

> 生产环境不要用 `*` 通配来源，应配置为正式前端域名；更完整的 CORS 讨论见[接口契约章节](../integration/rest-contract.md)。

## 3. 前端发起请求

在前端 `src/App.tsx` 中用 `fetch` 请求后端：

```tsx
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/hello')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((data) => setMessage(data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>第一个全栈 Demo</h1>
      {error ? <p style={{ color: 'crimson' }}>出错了：{error}</p> : <p>后端返回：{message}</p>}
    </main>
  );
}

export default App;
```

## 4. 启动顺序

1. 先启动后端（`mvn spring-boot:run`，监听 8080）；
2. 再启动前端（`npm run dev`，监听 5173）；
3. 打开前端页面，看到后端返回的文字 —— 全栈链路打通。

## 5. 另一种做法：Vite 代理（推荐联调）

生产中前端与后端通常同源，开发期也可以用 Vite 代理规避跨域。在 `vite.config.ts` 中：

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
});
```

此时前端请求 `/api/hello`，由 Vite 转发到后端 `http://localhost:8080/hello`，浏览器看到的始终是同源请求。实战项目即采用此方式，见 [Step 2 · 前端落地](../project/step2-frontend.md)。

## 实践任务

1. 独立完成联调，截图前端页面展示后端返回结果；
2. 把后端 `/hello` 改成返回 JSON（对象），前端改用 `res.json()` 解析并展示字段。

## 常见坑

- **控制台报 CORS / 跨域**：后端放行来源与前端实际端口不一致；先确认前端端口是 5173；
- **网络请求失败（连接被拒绝）**：后端没启动，或端口写错；
- **接口 404**：后端控制器路径与前端请求路径对不上；
- **改了后端不生效**：Spring Boot 需重启才加载新代码（ devtools 热重载除外）。

至此你已完成 0 到 1 的全栈搭建。接下来可以进入 [前端 React](../frontend/overview.md) 或[后端 Java](../backend/overview.md) 的系统学习，也可以先了解 [AI 辅助开发工具](../ai-tools/cloudcode-guide.md) 如何提效。
