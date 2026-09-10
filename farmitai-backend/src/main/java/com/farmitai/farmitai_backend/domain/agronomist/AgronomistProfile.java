package com.farmitai.farmitai_backend.domain.agronomist;

import com.farmitai.farmitai_backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "agronomist_profiles")
public class AgronomistProfile {

	@Id
	private UUID id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "first_name", nullable = false, length = 120)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 120)
	private String lastName;

	@Column(length = 120)
	private String district;

	@Column(length = 255)
	private String specialty;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected AgronomistProfile() {
	}

	public static AgronomistProfile create(User user, String firstName, String lastName, String district) {
		AgronomistProfile profile = new AgronomistProfile();
		profile.id = UUID.randomUUID();
		profile.user = user;
		profile.firstName = firstName;
		profile.lastName = lastName == null ? "" : lastName;
		profile.district = district;
		return profile;
	}

	public void updateFromWaitlist(String firstName, String lastName, String district) {
		this.firstName = firstName;
		this.lastName = lastName == null ? "" : lastName;
		if (this.district == null || this.district.isBlank()) {
			this.district = district;
		}
	}

	public void update(String firstName, String lastName, String district, String specialty) {
		if (firstName != null) {
			this.firstName = firstName;
		}
		if (lastName != null) {
			this.lastName = lastName;
		}
		if (district != null) {
			this.district = district;
		}
		if (specialty != null) {
			this.specialty = specialty;
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

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getDistrict() {
		return district;
	}

	public String getSpecialty() {
		return specialty;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
