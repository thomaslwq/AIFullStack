---
title: 数据源与 MyBatis 基础配置
description: Maven 依赖、application.yml 数据源与 MyBatis 配置、Mapper 扫描注解、目录约定与常见配置报错
sidebar_position: 2
---

# 数据源与 MyBatis 基础配置

## 1. Maven 依赖

`pom.xml` 加入 MyBatis Spring Boot Starter、MySQL 驱动与 Lombok（简化实体）：

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

> `mybatis-spring-boot-starter` 版本需与 Spring Boot 3 兼容；3.0.x 对应 Spring Boot 3.x。

## 2. application.yml

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/ai_fullstack?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Shanghai
    username: root
    password: ${DB_PASSWORD:你的mysql密码}

mybatis:
  # Mapper XML 文件位置（相对 classpath）
  mapper-locations: classpath:mapper/*.xml
  configuration:
    # 下划线自动转驼峰：create_time -> createTime
    map-underscore-to-camel-case: true
    # 打印执行 SQL，新手排错用；生产环境可关闭
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## 3. 启动类增加 Mapper 扫描

```java
package com.example.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.demo.mapper")
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

`@MapperScan` 指定 Mapper 接口所在包，Spring 会为每个接口生成代理实现并纳入容器。也可以在每个 Mapper 接口上标注 `@Mapper`，二选一即可。

## 4. 目录约定（新手容易放错）

```text
src/main/
├── java/com/example/demo/
│   ├── controller/
│   ├── service/
│   │   └── impl/
│   ├── mapper/          # Mapper 接口
│   └── entity/          # 实体类
└── resources/
    └── mapper/          # Mapper XML 映射文件
        └── UserMapper.xml
```

- 接口在 `mapper/` 包，XML 在 `resources/mapper/`；
- XML 的 `namespace` 必须与 Mapper 接口全限定名一致；
- XML 中 `id` 必须与接口方法名一致。

## 实践任务

配置好依赖与 `application.yml`，启动项目：无数据源连接报错、MyBatis 初始化日志正常，即配置成功。

## 常见坑

- **`@MapperScan` 包路径写错**：Mapper 注入失败，启动报 `NoSuchBeanDefinitionException`；
- **`mapper-locations` 路径写错**：找不到 XML，方法调用报 `Invalid bound statement`；
- **时区/密码错误**：连接被拒，检查 `serverTimezone` 与 `password`；
- **下划线字段未映射到驼峰属性**：确认开启 `map-underscore-to-camel-case`，或在 XML 中显式写 `resultMap`；
- **Lombok 不生效**：确认 IDE 安装 Lombok 插件且注解处理已开启。

下一篇：[XML 方式 CRUD](./crud-xml.md)。
