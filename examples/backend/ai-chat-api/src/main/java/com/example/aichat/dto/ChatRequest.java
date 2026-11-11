package com.example.aichat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 发送消息请求 */
public record ChatRequest(
        @NotBlank(message = "消息内容不能为空")
        @Size(max = 2000, message = "消息内容过长")
        String content,
        String conversationId
) {}
