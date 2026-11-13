---
title: MyBatis-Plus 扩展：通用 CRUD 与条件构造器
description: 在原生 MyBatis 之上使用 MyBatis-Plus：BaseMapper、IService、LambdaQueryWrapper、分页插件，以及与原生 SQL 共存的边界
sidebar_position: 6
---

# MyBatis-Plus 扩展：通用 CRUD 与条件构造器

> 本篇是原生 MyBatis 的**提效扩展**。MyBatis-Plus（简称 MP）在 MyBatis 之上增强而不改变其原生能力：单表通用 CRUD 无需写 SQL，复杂查询仍可保留 XML。建议先掌握[原生 XML CRUD](./crud-xml.md)，再使用 MP。

## 1. MP 提供了什么

| 能力 | 说明 |
| --- | --- |
| BaseMapper | 内置 insert、deleteById、updateById、selectById、selectList 等单表方法 |
| IService / ServiceImpl | 业务层通用封装，批量操作、链式调用 |
| 条件构造器 Wrapper | 用 Java API 拼装 where 条件，避免拼接 SQL 字符串 |
| 分页插件 | 拦截 SQL 自动追加 limit 与 count，无需手写分页 |
| 主键策略、逻辑删除、字段自动填充 | 通用数据库约定的框架级支持 |

## 2. 依赖（Spring Boot 3）

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.7</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

> Spring Boot 3 必须使用 `mybatis-plus-spring-boot3-starter`；旧的 `mybatis-plus-boot-starter` 面向 Spring Boot 2。数据源配置与[数据源章节](./datasource-config.md)一致。

## 3. 实体与表映射

```java
package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String username;
    private Integer age;
    private String email;

    private LocalDateTime createTime;
}
```

- `@TableName("user")`：指定表名；类名与表名驼峰一致时可省略；
- `@TableId(type = IdType.AUTO)`：主键自增；
- 实体属性默认按驼峰映射下划线字段；字段名不一致时用 `@TableField("email")` 指定。

## 4. BaseMapper：免 XML 的单表 CRUD

```java
package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.User;

public interface UserMapper extends BaseMapper<User> {
    // 通用 CRUD 已由 BaseMapper 提供，无需写 XML
    // 自定义复杂查询仍可在此声明方法 + XML
}
```

Service 层继承 `IService` 与 `ServiceImpl`：

```java
public interface UserService extends IService<User> {
}

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
```

调用示例（在 Controller 或业务代码中）：

```java
User user = new User();
user.setUsername("文钦");
user.setAge(36);
user.setEmail("demo@example.com");

userService.save(user);                 // 新增
User found = userService.getById(1);     // 按主键查询
userService.updateById(user);            // 按主键更新
userService.removeById(1);              // 按主键删除
List<User> all = userService.list();     // 全表列表
```

## 5. 条件构造器 LambdaQueryWrapper

用 Lambda 引用实体属性，字段名在重构时可被编译器检查，优于字符串列名：

```java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

// 查询年龄大于 18、邮箱包含 example、按 id 倒序
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
        .gt(User::getAge, 18)
        .like(User::getEmail, "example")
        .orderByDesc(User::getId);

List<User> list = userService.list(wrapper);
```

常用条件：

| 方法 | 含义 | 对应 SQL |
| --- | --- | --- |
| `eq(col, val)` | 等于 | `col = val` |
| `ne(col, val)` | 不等于 | `col <> val` |
| `gt / ge / lt / le` | 大于 / 大于等于 / 小于 / 小于等于 | `> / >= / < / <=` |
| `like(col, val)` | 模糊匹配 | `col LIKE %val%` |
| `between(col, a, b)` | 区间 | `col BETWEEN a AND b` |
| `orderByDesc(col)` | 降序排序 | `ORDER BY col DESC` |
| `isNull(col)` / `isNotNull(col)` | 空值判断 | `IS NULL / IS NOT NULL` |

条件可按业务动态拼接：

```java
LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
if (keyword != null && !keyword.isBlank()) {
    wrapper.like(User::getUsername, keyword);
}
if (minAge != null) {
    wrapper.ge(User::getAge, minAge);
}
```

## 6. 分页插件配置

MP 3.5.x 需要显式注册分页拦截器，否则分页不生效：

```java
package com.example.demo.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyBatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

分页查询：

```java
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

Page<User> page = new Page<>(pageNum, pageSize);
Page<User> result = userService.page(page, wrapper);

List<User> records = result.getRecords();   // 当前页数据
long total = result.getTotal();              // 总数
long pages = result.getPages();              // 总页数
```

## 7. MP 与原生 MyBatis 如何共存

- **单表通用操作**：用 BaseMapper / IService，省掉样板 XML；
- **多表关联、复杂动态 SQL、报表查询**：在 Mapper 接口声明方法，仍走 XML 或注解，MP 不强行接管；
- 同一个 Mapper 接口可以同时继承 `BaseMapper<User>` 并定义自定义 XML 方法。

## 8. 常用数据库约定（可选）

- **逻辑删除**：实体字段加 `@TableLogic`，删除操作转为 `UPDATE ... SET deleted = 1`，查询自动过滤已删除记录；
- **自动填充**：`createTime`、`updateTime` 可通过 `MetaObjectHandler` 在插入/更新时自动赋值；
- **主键策略**：根据表设计选择 `AUTO`（数据库自增）、`ASSIGN_ID`（雪花算法）等。

## 实践任务

1. 用 MP 重写[XML CRUD](./crud-xml.md) 的用户管理接口，对比样板代码量；
2. 用 `LambdaQueryWrapper` 实现「按用户名模糊 + 年龄区间 + 分页」查询接口；
3. 保留一条多表关联查询仍用 XML 实现，体会 MP 与原生共存的边界。

## 常见坑

- **分页不生效**：未注册 `PaginationInnerInterceptor`；
- **Spring Boot 3 启动报错**：误用了 Spring Boot 2 版 starter，需换 `mybatis-plus-spring-boot3-starter`；
- **字段映射不上**：检查 `@TableName`、`@TableField` 与驼峰映射配置；
- **Wrapper 用字符串列名**：重构易出错，优先用 `LambdaQueryWrapper` 引用方法引用；
- **过度依赖 MP 忽略 SQL 能力**：复杂查询不要硬套 Wrapper，回到 XML 写清晰 SQL。

下一篇：[React 联调](./react-integration.md)。
