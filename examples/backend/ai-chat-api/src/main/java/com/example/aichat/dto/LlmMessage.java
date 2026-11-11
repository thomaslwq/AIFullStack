package com.example.aichat.dto;

/** 发给大模型的消息结构 */
public record LlmMessage(String role, String content) {}
