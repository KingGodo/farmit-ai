package com.farmitai.farmitai_backend.domain.farmer.dto;

import com.farmitai.farmitai_backend.domain.farmer.FarmStatus;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class FarmerDtos {

	private FarmerDtos() {
	}

	public record MeResponse(
			UUID id,
			UUID userId,
			String name,
			String firstName,
			String lastName,
			String phone,
			String email,
			String district,
			String province,
			String farmingType,
			String status) {
	}

	public record PatchMeRequest(
			String firstName, String lastName, String district, String province, String farmingType) {
	}

	public record FarmResponse(
			UUID id,
			String name,
			String description,
			String district,
			String province,
			BigDecimal hectares,
			Double latitude,
			Double longitude,
			String status,
			Instant createdAt,
			List<FieldResponse> fields) {
	}

	public record FieldResponse(
			UUID id, String name, BigDecimal hectares, String soilType, Double latitude, Double longitude) {
	}

	public record CreateFarmRequest(
			@NotBlank String name,
			String description,
			String district,
			String province,
			BigDecimal hectares,
			Double latitude,
			Double longitude) {
	}

	public record PatchFarmRequest(
			String name,
			String description,
			String district,
			String province,
			BigDecimal hectares,
			Double latitude,
			Double longitude,
			FarmStatus status) {
	}

	public record CreateFieldRequest(
			@NotBlank String name, BigDecimal hectares, String soilType, Double latitude, Double longitude) {
	}
}
