---
title: 前后端接口契约与联调
description: RESTful 设计、统一响应与错误码、CORS 跨域、鉴权头传递与联调流程
sidebar_position: 1
---

# 前后端接口契约与联调

## 1. RESTful 约定

| 操作 | 方法 | 路径示例 |
| --- | --- | --- |
| 列表 | GET | `/api/messages?page=0&size=20` |
| 详情 | GET | `/api/messages/{id}` |
| 新建 | POST | `/api/messages` |
| 更新 | PUT/PATCH | `/api/messages/{id}` |
| 删除 | DELETE | `/api/messages/{id}` |

- 路径用名词复数；动作体现在 HTTP 方法上；
- 查询条件走 query 参数；资源标识走路径参数；
- 时间统一 ISO-8601（`2026-11-11T13:00:00+08:00`），金额用最小单位或明确小数位。

## 2. 统一响应与错误码

```json
{
  "code": 0,
  "message": "ok",
  "data": { "id": 1, "content": "你好" }
}
```

| code | 含义 | HTTP 状态 |
| --- | --- | --- |
| 0 | 成功 | 200 |
| 400 | 参数错误 | 400 |
| 401 | 未登录 / Token 失效 | 401 |
| 403 | 无权限 | 403 |
| 500 | 服务端错误 | 500 |

前端拦截器根据 `code` 统一提示，HTTP 状态与业务码保持一致语义。

## 3. CORS 跨域

浏览器出于同源策略，禁止页面脚本读取跨域响应；需要后端显式放行来源。

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return new CorsFilter(source);
    }
}
```

生产环境 `allowedOrigins` 应配置为正式前端域名，不要用 `*` 同时携带凭证。

## 4. 鉴权头传递

前端请求拦截器附加 Token：

```ts
const token = useAuthStore.getState().token;
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
if (token) headers.Authorization = `Bearer ${token}`;
```

后端过滤器从 `Authorization` 解析身份（见 [鉴权章节](../backend/security-jwt.md)）。

## 5. 联调流程

1. 后端提供 OpenAPI 文档，前端据此生成类型与请求函数；
2. 本地通过代理（Vite `server.proxy`）把 `/api` 转发到后端，规避开发期跨域；
3. 约定 mock 数据与错误场景，前端在后端未就绪时先用 mock；
4. 联调记录表：接口、请求示例、响应示例、已知问题。

## 实践任务

1. 配置 Vite 代理：`/api` → `http://localhost:8080`。
2. 为 401 响应实现前端自动跳转登录页。
