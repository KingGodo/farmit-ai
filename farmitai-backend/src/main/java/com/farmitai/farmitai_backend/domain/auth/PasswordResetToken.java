package com.farmitai.farmitai_backend.domain.auth;

import com.farmitai.farmitai_backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "token_hash", nullable = false)
	private String tokenHash;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(name = "consumed_at")
	private Instant consumedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected PasswordResetToken() {
	}

	public static PasswordResetToken open(User user, String tokenHash, Instant expiresAt) {
		PasswordResetToken token = new PasswordResetToken();
		token.id = UUID.randomUUID();
		token.user = user;
		token.tokenHash = tokenHash;
		token.expiresAt = expiresAt;
		token.createdAt = Instant.now();
		return token;
	}

	public boolean isExpired(Instant now) {
		return now.isAfter(expiresAt);
	}

	public void consume() {
		consumedAt = Instant.now();
	}

	public User getUser() {
		return user;
	}

	public String getTokenHash() {
		return tokenHash;
	}
}
