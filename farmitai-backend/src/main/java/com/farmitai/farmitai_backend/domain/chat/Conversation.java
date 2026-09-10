package com.farmitai.farmitai_backend.domain.chat;

import com.farmitai.farmitai_backend.domain.user.User;
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
@Table(name = "conversations")
public class Conversation {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ConversationChannel channel;

	@Column(name = "started_at", nullable = false)
	private Instant startedAt;

	@Column(name = "last_message_at", nullable = false)
	private Instant lastMessageAt;

	protected Conversation() {
	}

	public static Conversation open(User user, ConversationChannel channel) {
		Conversation conversation = new Conversation();
		conversation.id = UUID.randomUUID();
		conversation.user = user;
		conversation.channel = channel;
		return conversation;
	}

	public void touch() {
		lastMessageAt = Instant.now();
	}

	@PrePersist
	void onCreate() {
		Instant now = Instant.now();
		startedAt = now;
		lastMessageAt = now;
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public ConversationChannel getChannel() {
		return channel;
	}

	public Instant getStartedAt() {
		return startedAt;
	}

	public Instant getLastMessageAt() {
		return lastMessageAt;
	}
}
