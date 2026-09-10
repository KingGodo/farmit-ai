package com.farmitai.farmitai_backend.domain.agrobusiness;

import com.farmitai.farmitai_backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agro_businesses")
public class AgroBusiness {

	@Id
	private UUID id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", unique = true)
	private User user;

	@Column(nullable = false)
	private String name;

	private String description;

	@Column(length = 20)
	private String phone;

	private String email;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private AgroBusinessStatus status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected AgroBusiness() {
	}

	public static AgroBusiness create(User user, String name, String description, String phone, String email) {
		AgroBusiness business = new AgroBusiness();
		business.id = UUID.randomUUID();
		business.user = user;
		business.name = name;
		business.description = description;
		business.phone = phone;
		business.email = email;
		business.status = AgroBusinessStatus.PENDING;
		return business;
	}

	public void update(
			String name, String description, String phone, String email, AgroBusinessStatus status) {
		if (name != null) {
			this.name = name;
		}
		if (description != null) {
			this.description = description;
		}
		if (phone != null) {
			this.phone = phone;
		}
		if (email != null) {
			this.email = email;
		}
		if (status != null) {
			this.status = status;
		}
	}

	@PrePersist
	void onCreate() {
		Instant now = Instant.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getPhone() {
		return phone;
	}

	public String getEmail() {
		return email;
	}

	public AgroBusinessStatus getStatus() {
		return status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
