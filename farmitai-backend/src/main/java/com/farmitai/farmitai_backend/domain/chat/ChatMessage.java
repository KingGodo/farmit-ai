package com.farmitai.farmitai_backend.domain.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class ChatMessage {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "conversation_id", nullable = false)
	private Conversation conversation;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private MessageSender sender;

	@Enumerated(EnumType.STRING)
	@Column(name = "message_type", nullable = false, length = 20)
	private MessageType messageType;

	@Column(columnDefinition = "TEXT")
	private String content;

	@Column(name = "media_url", length = 1024)
	private String mediaUrl;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private MessageStatus status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected ChatMessage() {
	}

	public static ChatMessage text(Conversation conversation, MessageSender sender, String content) {
		ChatMessage message = new ChatMessage();
		message.id = UUID.randomUUID();
		message.conversation = conversation;
		message.sender = sender;
		message.messageType = MessageType.TEXT;
		message.content = content;
		message.status = MessageStatus.DELIVERED;
		return message;
	}

	@PrePersist
	void onCreate() {
		createdAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public Conversation getConversation() {
		return conversation;
	}

	public MessageSender getSender() {
		return sender;
	}

	public MessageType getMessageType() {
		return messageType;
	}

	public String getContent() {
		return content;
	}

	public String getMediaUrl() {
		return mediaUrl;
	}

	public MessageStatus getStatus() {
		return status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
