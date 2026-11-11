package com.example.aichat.controller;

import com.example.aichat.common.ApiResponse;
import com.example.aichat.dto.ChatReply;
import com.example.aichat.dto.ChatRequest;
import com.example.aichat.service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final ConversationService conversationService;

    public MessageController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/health")
    public ApiResponse<Map<String, String>> health() {
        return ApiResponse.ok(Map.of("status", "up", "time", LocalDateTime.now().toString()));
    }

    @PostMapping("/messages")
    public ApiResponse<ChatReply> send(@Valid @RequestBody ChatRequest request,
                                        Authentication auth) {
        String userId = auth.getName();
        return ApiResponse.ok(conversationService.ask(userId, request.conversationId(), request.content()));
    }
}
