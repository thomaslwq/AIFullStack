---
title: 持久层：MySQL 与数据访问
description: 实体映射、JPA Repository / MyBatis-Plus 查询、分页与事务边界
sidebar_position: 4
---

# 持久层：MySQL 与数据访问

## 1. 依赖与数据源配置

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_chat?useUnicode=true&characterEncoding=utf8
    username: root
    password: ${DB_PASSWORD:}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 2. 实体与 Repository

```java
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String role;
    @Column(length = 2000)
    private String content;
    private LocalDateTime createdAt;

    // 构造器、getter/setter（或用 Lombok @Data）
}
```

```java
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    Page<Message> findByRole(String role, Pageable pageable);
}
```

Spring Data JPA 根据方法名自动生成查询；复杂查询用 `@Query` 写 JPQL/SQL。

## 3. 事务边界

```java
@Service
public class ConversationService {

    private final MessageRepository messageRepository;

    public ConversationService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional
    public Message appendMessage(String conversationId, String role, String content) {
        Message msg = new Message();
        msg.setRole(role);
        msg.setContent(content);
        msg.setCreatedAt(LocalDateTime.now());
        return messageRepository.save(msg);
    }
}
```

- `@Transactional` 标注在 Service 方法上，方法内多个数据库操作同生共死；
- 只读查询可加 `@Transactional(readOnly = true)` 优化；
- 同类内部方法自调用会绕过代理，导致事务失效。

## 4. MyBatis-Plus 备选

若团队使用 MyBatis-Plus：继承 `BaseMapper<Message>`，内置 `insert/updateById/selectPage` 等方法，条件构造器 `LambdaQueryWrapper` 组装查询；XML 或注解 SQL 处理复杂联表。

## 实践任务

1. 建一张 `conversation` 表，完成会话与消息的一对多查询。
2. 实现消息分页接口：`GET /api/messages?page=0&size=20`。

## 常见坑

- `ddl-auto=update` 生产环境谨慎使用，结构变更应走迁移脚本；
- N+1 查询：列表场景注意关联实体的懒加载与抓取策略；
- 长事务持有数据库连接过久，应缩短事务边界，把远程调用移出事务。
