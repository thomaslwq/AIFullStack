---
title: XML 方式 CRUD（MyBatis 主流写法）
description: 建表语句、实体类、Mapper 接口、XML 映射文件、Service 与 Controller，完成一套分层增删改查
sidebar_position: 3
---

# XML 方式 CRUD（MyBatis 主流写法）

本篇按「实体 → Mapper 接口 → XML → Service → Controller」分层完成用户表的增删改查，风格与[后端 Spring Boot 入门](../backend/spring-boot-quickstart.md)的统一响应结构保持一致。

## 1. 建表 SQL

```sql
CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `age` INT,
  `email` VARCHAR(100),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 2. 实体类 `entity/User.java`

```java
package com.example.demo.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String username;
    private Integer age;
    private String email;
    private LocalDateTime createTime;
}
```

## 3. Mapper 接口 `mapper/UserMapper.java`

```java
package com.example.demo.mapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface UserMapper {

    List<User> selectAll();

    User selectById(@Param("id") Integer id);

    int insert(User user);

    int update(User user);

    int deleteById(@Param("id") Integer id);
}
```

多参数方法用 `@Param` 命名；单个实体参数可直接在 XML 中引用属性名。

## 4. XML 映射 `resources/mapper/UserMapper.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.UserMapper">

    <resultMap id="userMap" type="com.example.demo.entity.User">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="age" property="age"/>
        <result column="email" property="email"/>
        <result column="create_time" property="createTime"/>
    </resultMap>

    <select id="selectAll" resultMap="userMap">
        SELECT id, username, age, email, create_time
        FROM user
        ORDER BY id DESC
    </select>

    <select id="selectById" resultMap="userMap">
        SELECT id, username, age, email, create_time
        FROM user
        WHERE id = #{id}
    </select>

    <insert id="insert" parameterType="com.example.demo.entity.User"
            useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user(username, age, email)
        VALUES (#{username}, #{age}, #{email})
    </insert>

    <update id="update" parameterType="com.example.demo.entity.User">
        UPDATE user
        SET username = #{username}, age = #{age}, email = #{email}
        WHERE id = #{id}
    </update>

    <delete id="deleteById">
        DELETE FROM user WHERE id = #{id}
    </delete>

</mapper>
```

要点：

- `namespace` 绑定接口全限定名；`id` 对应方法名；
- `#{id}` 是预编译占位符（PreparedStatement），可防 SQL 注入；不要用 `${}` 拼接用户输入；
- `useGeneratedKeys="true" keyProperty="id"` 让插入后主键回填到实体；
- 开启了驼峰映射时简单查询也可用 `resultType`，显式 `resultMap` 更清晰可控。

## 5. Service 层

接口 `service/UserService.java`：

```java
package com.example.demo.service;

import com.example.demo.entity.User;
import java.util.List;

public interface UserService {
    List<User> list();
    User getById(Integer id);
    boolean add(User user);
    boolean edit(User user);
    boolean remove(Integer id);
}
```

实现 `service/impl/UserServiceImpl.java`：

```java
package com.example.demo.service.impl;

import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    // 构造器注入
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public List<User> list() {
        return userMapper.selectAll();
    }

    @Override
    public User getById(Integer id) {
        return userMapper.selectById(id);
    }

    @Override
    public boolean add(User user) {
        return userMapper.insert(user) > 0;
    }

    @Override
    public boolean edit(User user) {
        return userMapper.update(user) > 0;
    }

    @Override
    public boolean remove(Integer id) {
        return userMapper.deleteById(id) > 0;
    }
}
```

## 6. Controller 接口

```java
package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public ApiResponse<List<User>> list() {
        return ApiResponse.ok(userService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<User> get(@PathVariable Integer id) {
        return ApiResponse.ok(userService.getById(id));
    }

    @PostMapping
    public ApiResponse<Boolean> add(@RequestBody User user) {
        userService.add(user);
        return ApiResponse.ok(Boolean.TRUE);
    }

    @PutMapping
    public ApiResponse<Boolean> edit(@RequestBody User user) {
        userService.edit(user);
        return ApiResponse.ok(Boolean.TRUE);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        userService.remove(id);
        return ApiResponse.ok(Boolean.TRUE);
    }
}
```

## 7. 接口验证

```bash
# 新增
curl -X POST localhost:8080/api/user -H 'Content-Type: application/json' \
  -d '{"username":"文钦","age":36,"email":"demo@example.com"}'

# 列表
curl localhost:8080/api/user/list
```

## 实践任务

1. 为 `username`、`email` 增加 `@NotBlank` / `@Email` 校验注解；
2. 新增「按用户名模糊查询」方法，在 XML 中使用 `LIKE CONCAT('%', #{keyword}, '%')`；
3. 对照 `examples/mybatis-demo/` 的分层实现检查。

## 常见坑

- **`Invalid bound statement (not found)`**：namespace、方法 id 与接口不一致，或 XML 路径未被 `mapper-locations` 扫描到；
- **插入后实体 id 为 null**：未配置 `useGeneratedKeys`；
- **字段映射不上**：驼峰映射未开启，或 `resultMap` 属性名写错；
- **SQL 注入风险**：用户输入必须走 `#{}`，`${}` 仅用于排序字段等可信动态结构。

下一篇：[注解 SQL](./annotation.md)。
