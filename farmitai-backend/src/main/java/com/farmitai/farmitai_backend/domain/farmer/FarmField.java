package com.farmitai.farmitai_backend.domain.farmer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "farm_fields")
public class FarmField {

	@Id
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "farm_id", nullable = false)
	private Farm farm;

	@Column(nullable = false)
	private String name;

	@Column(name = "area_hectares", precision = 12, scale = 2)
	private BigDecimal areaHectares;

	private Double latitude;

	private Double longitude;

	@Column(name = "soil_type", length = 80)
	private String soilType;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected FarmField() {
	}

	public static FarmField create(
			Farm farm, String name, BigDecimal areaHectares, Double latitude, Double longitude, String soilType) {
		FarmField field = new FarmField();
		field.id = UUID.randomUUID();
		field.farm = farm;
		field.name = name;
		field.areaHectares = areaHectares;
		field.latitude = latitude;
		field.longitude = longitude;
		field.soilType = soilType;
		return field;
	}

	@PrePersist
	void onCreate() {
		createdAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public Farm getFarm() {
		return farm;
	}

	public String getName() {
		return name;
	}

	public BigDecimal getAreaHectares() {
		return areaHectares;
	}

	public Double getLatitude() {
		return latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public String getSoilType() {
		return soilType;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
