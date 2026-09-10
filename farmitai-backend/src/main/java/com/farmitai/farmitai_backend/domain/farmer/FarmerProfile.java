package com.farmitai.farmitai_backend.domain.farmer;

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
@Table(name = "farmer_profiles")
public class FarmerProfile {

	@Id
	private UUID id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "first_name", nullable = false, length = 120)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 120)
	private String lastName;

	private String location;

	@Column(length = 120)
	private String district;

	@Column(length = 120)
	private String province;

	@Column(nullable = false, length = 80)
	private String country;

	@Column(name = "farming_type", length = 100)
	private String farmingType;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected FarmerProfile() {
	}

	public static FarmerProfile create(
			User user, String firstName, String lastName, String location, String farmingType) {
		FarmerProfile profile = new FarmerProfile();
		profile.id = UUID.randomUUID();
		profile.user = user;
		profile.firstName = firstName;
		profile.lastName = lastName == null ? "" : lastName;
		profile.location = location;
		profile.district = location;
		profile.country = "Zimbabwe";
		profile.farmingType = farmingType;
		return profile;
	}

	public void updateFromWaitlist(String firstName, String lastName, String location, String farmingType) {
		this.firstName = firstName;
		this.lastName = lastName == null ? "" : lastName;
		this.location = location;
		if (this.district == null || this.district.isBlank()) {
			this.district = location;
		}
		this.farmingType = farmingType;
	}

	public void update(
			String firstName,
			String lastName,
			String location,
			String district,
			String province,
			String farmingType) {
		if (firstName != null) {
			this.firstName = firstName;
		}
		if (lastName != null) {
			this.lastName = lastName;
		}
		if (location != null) {
			this.location = location;
		}
		if (district != null) {
			this.district = district;
		}
		if (province != null) {
			this.province = province;
		}
		if (farmingType != null) {
			this.farmingType = farmingType;
		}
	}

	@PrePersist
	void onCreate() {
		Instant now = Instant.now();
		createdAt = now;
		updatedAt = now;
		if (country == null) {
			country = "Zimbabwe";
		}
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

	public String getLocation() {
		return location;
	}

	public String getDistrict() {
		return district;
	}

	public String getProvince() {
		return province;
	}

	public String getCountry() {
		return country;
	}

	public String getFarmingType() {
		return farmingType;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
