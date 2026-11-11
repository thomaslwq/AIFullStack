package com.example.aichat.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank(message = "用户名不能为空") String name) {}
