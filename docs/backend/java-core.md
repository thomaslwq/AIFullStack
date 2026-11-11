---
title: Java 核心速通
description: 面向有其他语言经验的工程师，快速掌握 Java 类型系统、集合、异常、泛型、Lambda 与 Stream
sidebar_position: 2
---

# Java 核心速通

本篇不追求面面俱到，只覆盖阅读与编写 Spring Boot 代码所需的核心语法。

## 1. 类、接口与记录类型

```java
// 普通类
public class User {
    private Long id;
    private String name;

    public User(Long id, String name) { this.id = id; this.name = name; }
    public String getName() { return name; }
}

// 接口与默认方法
public interface Reader {
    String read();
    default String describe() { return "Reader: " + read(); }
}

// 记录类型（不可变数据载体，类似 DTO）
public record ChatMessage(String role, String content) {}
```

## 2. 集合与泛型

```java
List<String> names = new ArrayList<>();
names.add("文钦");
names.add("FullStack");

Map<String, Integer> score = new HashMap<>();
score.put("math", 90);

// 泛型方法
public <T> T first(List<T> list) {
    return list.isEmpty() ? null : list.get(0);
}
```

常用集合：`List`（有序可重复）、`Set`（去重）、`Map`（键值）；实现类 `ArrayList`、`HashSet`、`HashMap`。

## 3. 异常处理

```java
public Order createOrder(OrderRequest req) {
    if (req.items().isEmpty()) {
        throw new BizException("订单商品不能为空");
    }
    // ...
}
```

受检异常（checked）必须声明 `throws` 或捕获；运行时异常（`RuntimeException` 子类）可不声明。业务中自定义 `BizException extends RuntimeException`，由全局异常处理器统一转换响应。

## 4. Lambda 与 Stream

```java
List<String> result = names.stream()
    .filter(n -> n.startsWith("文"))
    .map(String::toUpperCase)
    .sorted()
    .toList();
```

- `stream()`：集合转流式管道；
- `filter`：过滤；`map`：转换；`sorted`：排序；`toList`：收集；
- `Optional` 用于避免空指针：`name.map(String::trim).orElse("匿名")`。

## 5. 模块与依赖管理

- Java 源码位于 `src/main/java`，资源位于 `src/main/resources`；
- Maven 通过 `pom.xml` 声明依赖，Spring Boot 用 starter 聚合一组相关库；
- 构建命令：`mvn spring-boot:run` 启动，`mvn package` 打包 jar。

## 实践任务

1. 定义 `record Article(Long id, String title, List<String> tags)`，用 Stream 按标签过滤并排序。
2. 为一个可能返回 null 的查询结果编写 `Optional` 安全处理逻辑。

## 常见坑

- `==` 比较包装类型/字符串可能不是内容相等，用 `equals`；
- 泛型不协变，`List<Dog>` 不是 `List<Animal>`；
- 自动拆箱遇到 null 会抛 `NullPointerException`。
