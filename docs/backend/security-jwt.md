---
title: 鉴权：Spring Security 与 JWT
description: JWT 签发与校验、自定义过滤器、Security 配置保护接口，密钥与过期时间管理
sidebar_position: 5
---

# 鉴权：Spring Security 与 JWT

## 1. 为什么后端做鉴权

前端登录拿到 Token，后续请求在 `Authorization` 头携带；后端校验 Token 解析出用户身份，再决定是否放行。JWT（JSON Web Token）是自包含令牌，服务端无需存储会话。

## 2. 签发与校验

依赖：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
```

```java
@Component
public class JwtService {

    private final SecretKey key = Keys.hmacShaKeyFor(
        System.getenv("JWT_SECRET").getBytes(StandardCharsets.UTF_8));

    public String issue(Long userId, String name) {
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("name", name)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 3600_000))
            .signWith(key)
            .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload();
    }
}
```

## 3. 认证过滤器

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            Claims claims = jwtService.parse(header.substring(7));
            var auth = new UsernamePasswordAuthenticationToken(
                claims.getSubject(), null, List.of(new SimpleGrantedAuthority("USER")));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(req, res);
    }
}
```

## 4. Security 配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/health").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

## 5. 登录接口示例

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginVO> login(@Valid @RequestBody LoginRequest req) {
        // 真实场景：校验用户名密码（密码哈希比对）
        String token = jwtService.issue(1L, req.name());
        return ApiResponse.ok(new LoginVO(token, req.name()));
    }
}
```

## 实践任务

1. 增加刷新令牌（refresh token）机制，access token 过期后换取新令牌。
2. 为接口增加角色校验：`ADMIN` 才能访问管理接口。

## 安全要点

- 密钥必须来自环境变量，长度满足 HMAC 要求，不入库；
- Token 过期时间不宜过长；登出若需主动失效，配合 Redis 黑名单；
- 密码存储使用哈希（如 BCrypt），绝不存明文；
- 后端只在自己的服务校验密钥，**大模型等第三方密钥永不暴露到前端**。
