package com.farmitai.farmitai_backend.domain.farmer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "farms")
public class Farm {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "farmer_id", nullable = false)
	private FarmerProfile farmer;

	@Column(nullable = false)
	private String name;

	private String description;

	private Double latitude;

	private Double longitude;

	@Column(name = "area_hectares", precision = 12, scale = 2)
	private BigDecimal areaHectares;

	private String location;

	@Column(length = 120)
	private String district;

	@Column(length = 120)
	private String province;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private FarmStatus status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected Farm() {
	}

	public static Farm create(
			FarmerProfile farmer,
			String name,
			String description,
			Double latitude,
			Double longitude,
			BigDecimal areaHectares,
			String location,
			String district,
			String province) {
		Farm farm = new Farm();
		farm.id = UUID.randomUUID();
		farm.farmer = farmer;
		farm.name = name;
		farm.description = description;
		farm.latitude = latitude;
		farm.longitude = longitude;
		farm.areaHectares = areaHectares;
		farm.location = location;
		farm.district = district != null ? district : farmer.getDistrict();
		farm.province = province != null ? province : farmer.getProvince();
		farm.status = FarmStatus.ACTIVE;
		return farm;
	}

	public void update(
			String name,
			String description,
			Double latitude,
			Double longitude,
			BigDecimal areaHectares,
			String location,
			String district,
			String province,
			FarmStatus status) {
		if (name != null) {
			this.name = name;
		}
		if (description != null) {
			this.description = description;
		}
		if (latitude != null) {
			this.latitude = latitude;
		}
		if (longitude != null) {
			this.longitude = longitude;
		}
		if (areaHectares != null) {
			this.areaHectares = areaHectares;
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

	public FarmerProfile getFarmer() {
		return farmer;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public Double getLatitude() {
		return latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public BigDecimal getAreaHectares() {
		return areaHectares;
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

	public FarmStatus getStatus() {
		return status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
