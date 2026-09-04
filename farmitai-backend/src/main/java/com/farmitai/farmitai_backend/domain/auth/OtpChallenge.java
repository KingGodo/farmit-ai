package com.farmitai.farmitai_backend.domain.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "otp_challenges")
public class OtpChallenge {

	@Id
	private UUID id;

	@Column(nullable = false, length = 20)
	private String phone;

	@Column(name = "code_hash", nullable = false)
	private String codeHash;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(name = "attempt_count", nullable = false)
	private int attemptCount;

	@Column(name = "consumed_at")
	private Instant consumedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected OtpChallenge() {
	}

	public static OtpChallenge open(String phone, String codeHash, Instant expiresAt) {
		OtpChallenge challenge = new OtpChallenge();
		challenge.id = UUID.randomUUID();
		challenge.phone = phone;
		challenge.codeHash = codeHash;
		challenge.expiresAt = expiresAt;
		challenge.attemptCount = 0;
		challenge.createdAt = Instant.now();
		return challenge;
	}

	public boolean isConsumed() {
		return consumedAt != null;
	}

	public boolean isExpired(Instant now) {
		return now.isAfter(expiresAt);
	}

	public void incrementAttempts() {
		attemptCount++;
	}

	public void consume() {
		consumedAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public String getPhone() {
		return phone;
	}

	public String getCodeHash() {
		return codeHash;
	}

	public Instant getExpiresAt() {
		return expiresAt;
	}

	public int getAttemptCount() {
		return attemptCount;
	}

	public Instant getConsumedAt() {
		return consumedAt;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
