---
title: MyBatis 简介与学习路线
description: 理解 MyBatis 半自动 ORM 的定位、与 JPA 的区别、适用场景，以及本模块章节顺序
sidebar_position: 1
---

# MyBatis 简介与学习路线

## 1. MyBatis 是什么

MyBatis 是一款**半自动 ORM 持久层框架**：SQL 由开发者自己编写（写在 XML 或注解上），框架负责参数绑定、SQL 执行与结果集到实体的映射。它在国内企业 Java 后端中使用非常广泛，尤其适合复杂 SQL、多表关联与 SQL 优化场景。

## 2. MyBatis 与 JPA 的区别

| 维度 | MyBatis | JPA / Hibernate |
| --- | --- | --- |
| SQL 编写 | 手写 SQL，灵活可控 | 框架自动生成，少写 SQL |
| 复杂查询 | 直观，便于优化与排查慢 SQL | 复杂 JPQL/条件拼装相对受限 |
| 学习成本 | 需熟悉 SQL 与映射配置 | 注解与方法名推导，上手快 |
| 适用场景 | 业务查询复杂、对 SQL 有要求 | 简单 CRUD、领域模型驱动 |

> 本模块以 **Spring Boot 3 + 原生 MyBatis** 为主线；[MyBatis-Plus 扩展](./plus-extension.md)在原生 MyBatis 之上提供通用 CRUD 与条件构造器，作为提效方案介绍。

## 3. 章节顺序

| 章节 | 主题 | 你将掌握 |
| --- | --- | --- |
| [数据源与基础配置](./datasource-config.md) | Maven 依赖、`application.yml`、Mapper 扫描、目录约定 | 跑通 MyBatis 工程骨架 |
| [XML 方式 CRUD](./crud-xml.md) | 建表、实体、Mapper 接口、XML 映射、Service、Controller | 完成一套分层增删改查 |
| [注解 SQL](./annotation.md) | `@Select`/`@Insert`/`@Update`/`@Delete` 注解写法 | 用注解完成简单 SQL，对比 XML 取舍 |
| [分页查询](./pagination.md) | 原生 `limit` 分页原理，PageHelper 插件提示 | 实现分页列表接口 |
| [MyBatis-Plus 扩展](./plus-extension.md) | BaseMapper、IService、条件构造器、分页插件 | 在原生基础上用 MP 减少样板代码 |
| [React 联调](./react-integration.md) | 前端请求分页列表、新增、删除 | 前后端跑通用户管理闭环 |

## 4. 前置准备

- MySQL 8.0 已安装并可连接；
- 已完成 [Spring Boot 入门](../backend/spring-boot-quickstart.md) 或[后端从零搭建](../bootstrap/backend-init-springboot.md)；
- 了解基础 SQL：`select / insert / update / delete` 与 `where / limit`。

## 5. 实践任务

本地启动 MySQL，创建课程示例数据库：

```sql
CREATE DATABASE ai_fullstack DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 与其他持久层章节的关系

- [后端持久层（JPA 视角）](../backend/persistence.md)：介绍 Spring Data JPA 的实体映射、Repository 与事务；
- 本模块：以 MyBatis 为主线，SQL 显式可控；两者解决同一问题（数据库访问），按团队技术栈选择。

下一篇：[数据源与 MyBatis 基础配置](./datasource-config.md)。
