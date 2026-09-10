package com.farmitai.farmitai_backend.domain.chat;

import com.farmitai.farmitai_backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "whatsapp_accounts")
public class WhatsAppAccount {

	@Id
	private UUID id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "phone_number", nullable = false, unique = true, length = 20)
	private String phoneNumber;

	@Column(name = "whatsapp_id", length = 80)
	private String whatsappId;

	@Column(nullable = false, length = 20)
	private String status;

	@Column(name = "linked_at", nullable = false)
	private Instant linkedAt;

	protected WhatsAppAccount() {
	}

	public static WhatsAppAccount link(User user, String phoneNumber, String whatsappId) {
		WhatsAppAccount account = new WhatsAppAccount();
		account.id = UUID.randomUUID();
		account.user = user;
		account.phoneNumber = phoneNumber;
		account.whatsappId = whatsappId;
		account.status = "ACTIVE";
		return account;
	}

	@PrePersist
	void onCreate() {
		linkedAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public String getWhatsappId() {
		return whatsappId;
	}

	public String getStatus() {
		return status;
	}

	public Instant getLinkedAt() {
		return linkedAt;
	}
}
