package com.farmitai.farmitai_backend.domain.crop;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "crops")
public class Crop {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true, length = 120)
	private String name;

	@Column(name = "scientific_name")
	private String scientificName;

	private String description;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected Crop() {
	}

	public static Crop create(String name, String scientificName, String description) {
		Crop crop = new Crop();
		crop.id = UUID.randomUUID();
		crop.name = name;
		crop.scientificName = scientificName;
		crop.description = description;
		return crop;
	}

	public void update(String name, String scientificName, String description) {
		if (name != null) {
			this.name = name;
		}
		if (scientificName != null) {
			this.scientificName = scientificName;
		}
		if (description != null) {
			this.description = description;
		}
	}

	@PrePersist
	void onCreate() {
		createdAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getScientificName() {
		return scientificName;
	}

	public String getDescription() {
		return description;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
