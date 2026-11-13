# mybatis-demo：MyBatis + MyBatis-Plus 用户管理示例

对应教程：

- [MyBatis 简介与学习路线](../../docs/mybatis/overview.md)
- [XML 方式 CRUD](../../docs/mybatis/crud-xml.md)
- [分页查询](../../docs/mybatis/pagination.md)
- [MyBatis-Plus 扩展](../../docs/mybatis/plus-extension.md)
- [React 联调](../../docs/mybatis/react-integration.md)

本示例同时演示 **原生 MyBatis XML** 与 **MyBatis-Plus 通用 CRUD** 共存：单表通用操作走 MP `BaseMapper`/`IService`，一条自定义模糊查询走 XML。

## 目录

```text
mybatis-demo/
├── sql/schema.sql                 # 建库建表脚本
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java
│       │   ├── config/MyBatisPlusConfig.java   # 分页插件
│       │   ├── entity/User.java
│       │   ├── mapper/UserMapper.java
│       │   ├── service/UserService.java
│       │   ├── service/impl/UserServiceImpl.java
│       │   └── controller/UserController.java
│       └── resources/
│           ├── application.yml
│           └── mapper/UserMapper.xml
└── frontend/
    └── src/pages/UserPage.tsx     # React 用户管理页面
```

## 后端组装与运行

1. 用 [start.spring.io](https://start.spring.io/) 生成 Maven、Java 17、Spring Boot 3.3 工程；
2. 按包路径拷入 `backend/` 下 Java 类、`application.yml` 与 `mapper/UserMapper.xml`；
3. 执行 `sql/schema.sql` 建好库表；
4. 配置环境变量 `DB_PASSWORD`，启动：

```bash
mvn spring-boot:run
```

## 接口清单

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/user/page?pageNum=1&pageSize=5` | MP 分页 + 条件查询 |
| GET | `/api/user/{id}` | 按主键查询 |
| POST | `/api/user` | 新增 |
| PUT | `/api/user` | 更新 |
| DELETE | `/api/user/{id}` | 删除 |
| GET | `/api/user/search?keyword=` | XML 自定义模糊查询 |

## 前端

将 `frontend/src/pages/UserPage.tsx` 拷入 Vite + React + TS 工程；开发期在 `vite.config.ts` 把 `/api` 代理到 `http://localhost:8080`（见[前后端联调](../../docs/bootstrap/fullstack-run-first.md)）。

## 说明

示例聚焦持久层与联调关键路径；鉴权、统一异常处理等见实战工程 [`../backend/ai-chat-api/`](../backend/ai-chat-api/README.md)。
