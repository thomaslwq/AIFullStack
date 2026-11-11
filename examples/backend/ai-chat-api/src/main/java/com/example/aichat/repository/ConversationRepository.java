package com.example.aichat.repository;

import com.example.aichat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUserIdOrderByCreatedAtDesc(String userId);
}
