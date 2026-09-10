package com.farmitai.farmitai_backend.domain.agrobusiness;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agro_business_locations")
public class AgroBusinessLocation {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "agro_business_id", nullable = false)
	private AgroBusiness agroBusiness;

	@Column(nullable = false)
	private String name;

	private String address;

	private Double latitude;

	private Double longitude;

	@Column(length = 120)
	private String district;

	@Column(length = 120)
	private String province;

	@Column(nullable = false, length = 80)
	private String country;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected AgroBusinessLocation() {
	}

	public static AgroBusinessLocation create(
			AgroBusiness agroBusiness,
			String name,
			String address,
			Double latitude,
			Double longitude,
			String district,
			String province) {
		AgroBusinessLocation location = new AgroBusinessLocation();
		location.id = UUID.randomUUID();
		location.agroBusiness = agroBusiness;
		location.name = name;
		location.address = address;
		location.latitude = latitude;
		location.longitude = longitude;
		location.district = district;
		location.province = province;
		location.country = "Zimbabwe";
		return location;
	}

	@PrePersist
	void onCreate() {
		createdAt = Instant.now();
		if (country == null) {
			country = "Zimbabwe";
		}
	}

	public UUID getId() {
		return id;
	}

	public AgroBusiness getAgroBusiness() {
		return agroBusiness;
	}

	public String getName() {
		return name;
	}

	public String getAddress() {
		return address;
	}

	public Double getLatitude() {
		return latitude;
	}

	public Double getLongitude() {
		return longitude;
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

	public Instant getCreatedAt() {
		return createdAt;
	}
}
