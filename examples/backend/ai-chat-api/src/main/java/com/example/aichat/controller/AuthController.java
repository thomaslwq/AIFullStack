package com.example.aichat.controller;

import com.example.aichat.common.ApiResponse;
import com.example.aichat.dto.LoginRequest;
import com.example.aichat.dto.LoginVO;
import com.example.aichat.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginVO> login(@Valid @RequestBody LoginRequest req) {
        // 真实场景：校验用户名密码（密码 BCrypt 哈希比对），此处仅教学简化
        String token = jwtService.issue(1L, req.name());
        return ApiResponse.ok(new LoginVO(token, req.name()));
    }
}
