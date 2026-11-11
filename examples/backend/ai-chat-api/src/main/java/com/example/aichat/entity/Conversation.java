package com.example.aichat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversation")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String title;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public Conversation() {}

    public Conversation(String userId, String title, LocalDateTime createdAt) {
        this.userId = userId;
        this.title = title;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<Message> getMessages() { return messages; }
}
