---
title: MyBatis 注解 SQL（不用 XML）
description: "@Select、@Insert、@Update、@Delete 注解写法，适用场景，以及注解与 XML 的取舍"
sidebar_position: 4
---

# MyBatis 注解 SQL（不用 XML）

对于简单 SQL，可以直接把语句写在 Mapper 接口的注解上，省去 XML 文件。

## 1. 注解写法示例

```java
package com.example.demo.mapper;

import com.example.demo.entity.User;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface UserAnnoMapper {

    @Select("SELECT id, username, age, email, create_time FROM user")
    List<User> selectAll();

    @Select("SELECT id, username, age, email, create_time FROM user WHERE id = #{id}")
    User selectById(@Param("id") Integer id);

    @Insert("INSERT INTO user(username, age, email) VALUES(#{username}, #{age}, #{email})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE user SET username = #{username}, age = #{age}, email = #{email} WHERE id = #{id}")
    int update(User user);

    @Delete("DELETE FROM user WHERE id = #{id}")
    int deleteById(@Param("id") Integer id);
}
```

- `@Mapper` 标注在接口上时，无需再在启动类用 `@MapperScan` 扫描该包；
- `@Options(useGeneratedKeys = true, keyProperty = "id")` 对应 XML 中的主键回填；
- 动态 SQL（条件拼装、`<if>`、`<foreach>`）注解方式用 `@SelectProvider` 等 Provider 类实现，可读性不如 XML。

## 2. 注解 vs XML 怎么选

| 维度 | 注解 | XML |
| --- | --- | --- |
| 简单单表 CRUD | 代码集中，少一个文件 | 略显啰嗦 |
| 长 SQL / 多表关联 | 注解字符串膨胀，难维护 | 结构清晰，便于 DBA 优化 |
| 动态条件（if / foreach / choose） | 需 Provider 类 | 原生标签支持，直观 |
| SQL 与代码分离 | 否，SQL 在 Java 接口里 | 是，集中在 mapper 目录 |

**经验法则**：简单、固定的单表语句用注解；业务复杂、需要动态拼装或团队要求 SQL 集中管理时用 XML。中型以上项目通常以 XML 为主。

## 实践任务

1. 新建一个注解 Mapper，实现「按邮箱查询用户」并在 Controller 暴露接口；
2. 对比同一查询的 XML 版本，体会两种写法在可读性上的差异。

## 常见坑

- 注解 SQL 较长时，Java 字符串换行与空格容易出错，注意保留关键字间空格；
- 多参数忘记 `@Param`，SQL 中无法按名引用；
- 混用注解与 XML 时，同一方法不能两边同时定义，否则启动报绑定冲突。

下一篇：[分页查询](./pagination.md)。
