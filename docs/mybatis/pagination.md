---
title: MyBatis 分页查询
description: 原生 limit 分页原理、偏移量计算、总数统计，以及 PageHelper 插件简化分页的扩展方式
sidebar_position: 5
---

# MyBatis 分页查询

## 1. 原生 limit 分页（先理解原理）

分页 = 当前页数据 + 总数。SQL 用 `limit #{offset}, #{pageSize}`，偏移量 `offset = (pageNum - 1) * pageSize`。

### Mapper 接口

```java
List<User> selectPage(@Param("offset") Integer offset, @Param("pageSize") Integer pageSize);

long countTotal();
```

### XML

```xml
<select id="selectPage" resultMap="userMap">
    SELECT id, username, age, email, create_time
    FROM user
    ORDER BY id DESC
    LIMIT #{offset}, #{pageSize}
</select>

<select id="countTotal" resultType="long">
    SELECT COUNT(*) FROM user
</select>
```

### Service 组装分页结果

```java
public Map<String, Object> page(int pageNum, int pageSize) {
    int offset = (pageNum - 1) * pageSize;
    List<User> records = userMapper.selectPage(offset, pageSize);
    long total = userMapper.countTotal();

    Map<String, Object> result = new HashMap<>();
    result.put("records", records);
    result.put("total", total);
    result.put("pageNum", pageNum);
    result.put("pageSize", pageSize);
    return result;
}
```

> 生产环境建议定义专门的分页 DTO（如 `PageResult<T>`）替代 `Map`，字段类型与泛型更清晰；参考[统一响应结构](../backend/spring-boot-quickstart.md)。

### Controller

```java
@GetMapping("/page")
public ApiResponse<Map<String, Object>> page(
        @RequestParam(defaultValue = "1") Integer pageNum,
        @RequestParam(defaultValue = "5") Integer pageSize) {
    return ApiResponse.ok(userService.page(pageNum, pageSize));
}
```

## 2. PageHelper 插件（简化分页，扩展提示）

原生分页需要自己算偏移量、写 count SQL。引入 PageHelper 后，只需在查询前调用 `PageHelper.startPage(pageNum, pageSize)`，插件自动拦截 SQL 追加 limit 并生成总数。

依赖：

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
```

用法：

```java
PageHelper.startPage(pageNum, pageSize);
List<User> list = userMapper.selectAll();
PageInfo<User> pageInfo = new PageInfo<>(list); // 含 total、pageNum、pages 等
```

> PageHelper 基于线程本地变量，`startPage` 必须紧跟查询语句，中间不能插入其他查询。

## 3. 分页注意事项

- **深分页**：`limit offset, size` 在 offset 很大时变慢，可改为基于主键的游标分页（`WHERE id < #{lastId} ORDER BY id DESC LIMIT #{size}`）；
- **总数与列表一致性**：数据频繁写入时，总数与当前页可能有少量偏差，属正常现象；
- **排序字段唯一**：分页排序建议用主键或唯一索引，避免翻页重复/遗漏；
- **pageSize 上限**：后端应限制每页最大条数，防止前端一次拉全表。

## 实践任务

1. 实现 `GET /api/user/page?pageNum=1&pageSize=5`，返回当前页列表与总数；
2. 计算总页数 `pages = ceil(total / pageSize)`，一并返回给前端；
3. （扩展）接入 PageHelper 对比两种写法的代码量差异。

下一篇：[MyBatis-Plus 扩展](./plus-extension.md)。
