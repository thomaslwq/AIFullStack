package com.example.aichat.service;

import com.example.aichat.common.BizException;
import com.example.aichat.dto.ChatReply;
import com.example.aichat.dto.LlmMessage;
import com.example.aichat.entity.Conversation;
import com.example.aichat.entity.Message;
import com.example.aichat.repository.ConversationRepository;
import com.example.aichat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversations;
    private final MessageRepository messages;
    private final LlmGateway llm;

    public ConversationService(ConversationRepository conversations,
                               MessageRepository messages,
                               LlmGateway llm) {
        this.conversations = conversations;
        this.messages = messages;
        this.llm = llm;
    }

    @Transactional
    public ChatReply ask(String userId, String conversationId, String content) {
        Conversation conv = getOrCreate(userId, conversationId);

        messages.save(new Message(conv, "user", content, LocalDateTime.now()));

        List<LlmMessage> history = messages
                .findByConversationIdOrderByCreatedAtAsc(conv.getId())
                .stream()
                .map(m -> new LlmMessage(m.getRole(), m.getContent()))
                .toList();

        String reply = llm.chat(history);
        messages.save(new Message(conv, "assistant", reply, LocalDateTime.now()));

        return new ChatReply(String.valueOf(conv.getId()), reply);
    }

    private Conversation getOrCreate(String userId, String conversationId) {
        if (conversationId != null && !conversationId.isBlank()) {
            Long id = Long.valueOf(conversationId);
            return conversations.findById(id)
                    .orElseThrow(() -> new BizException(404, "会话不存在"));
        }
        Conversation conv = new Conversation(userId, "新会话", LocalDateTime.now());
        return conversations.save(conv);
    }
}
