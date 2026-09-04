package com.farmitai.farmitai_backend.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true, length = 20)
	private String phone;

	@Column(unique = true)
	private String email;

	@Column(name = "password_hash")
	private String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private UserStatus status;

	@Column(name = "last_login_at")
	private Instant lastLoginAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
			name = "user_roles",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	protected User() {
	}

	public static User farmer(String phone) {
		User user = new User();
		user.id = UUID.randomUUID();
		user.phone = phone;
		user.status = UserStatus.PENDING;
		user.roles = new HashSet<>();
		return user;
	}

	public static User admin(String phone, String email, String passwordHash) {
		User user = new User();
		user.id = UUID.randomUUID();
		user.phone = phone;
		user.email = email;
		user.passwordHash = passwordHash;
		user.status = UserStatus.ACTIVE;
		user.roles = new HashSet<>();
		return user;
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

	public void addRole(Role role) {
		roles.add(role);
	}

	public void assignWaitlistRole(Role role) {
		roles.removeIf(existing -> existing.getName() == RoleName.FARMER
				|| existing.getName() == RoleName.AGRONOMIST);
		roles.add(role);
	}

	public void applyAdminSeed(String phone, String email, String passwordHash) {
		this.phone = phone;
		this.email = email;
		this.passwordHash = passwordHash;
		this.status = UserStatus.ACTIVE;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void markLogin() {
		lastLoginAt = Instant.now();
	}

	public void activate() {
		status = UserStatus.ACTIVE;
	}

	public UUID getId() {
		return id;
	}

	public String getPhone() {
		return phone;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public UserStatus getStatus() {
		return status;
	}

	public Instant getLastLoginAt() {
		return lastLoginAt;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public boolean hasRole(RoleName name) {
		return roles.stream().anyMatch(role -> role.getName() == name);
	}
}
