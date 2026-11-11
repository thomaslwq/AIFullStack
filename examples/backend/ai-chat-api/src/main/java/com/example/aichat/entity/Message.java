package com.example.aichat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Conversation conversation;

    private String role; // user / assistant / system

    @Column(length = 2000)
    private String content;

    private LocalDateTime createdAt;

    public Message() {}

    public Message(Conversation conversation, String role, String content, LocalDateTime createdAt) {
        this.conversation = conversation;
        this.role = role;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getRole() { return role; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
