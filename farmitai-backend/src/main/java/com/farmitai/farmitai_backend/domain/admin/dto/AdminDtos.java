package com.farmitai.farmitai_backend.domain.admin.dto;

import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessStatus;
import com.farmitai.farmitai_backend.domain.farmer.FarmStatus;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class AdminDtos {

	private AdminDtos() {
	}

	public record UserItem(
			UUID id,
			String name,
			String email,
			String phone,
			List<String> roles,
			String status,
			Instant lastLoginAt,
			Instant createdAt) {
	}

	public record PatchUserRequest(@NotNull UserStatus status) {
	}

	public record CreateUserRequest(
			@NotBlank @Email String email,
			@NotBlank String phone,
			@NotBlank @Size(min = 8, max = 72) String password) {
	}

	public record FarmerItem(
			UUID id,
			UUID userId,
			String name,
			String phone,
			String email,
			String district,
			String province,
			String farmingType,
			String status,
			long farms,
			Instant joinedAt) {
	}

	public record FarmerDetail(
			UUID id,
			UUID userId,
			String name,
			String firstName,
			String lastName,
			String phone,
			String email,
			String location,
			String district,
			String province,
			String farmingType,
			String status,
			Instant joinedAt,
			List<FarmItem> farms) {
	}

	public record CreateFarmerRequest(
			@NotBlank String name,
			@NotBlank String phone,
			String email,
			String district,
			String province,
			String farmingType,
			UserStatus status) {
	}

	public record PatchFarmerRequest(
			String firstName,
			String lastName,
			String email,
			String district,
			String province,
			String farmingType,
			UserStatus status) {
	}

	public record AgronomistItem(
			UUID id,
			UUID userId,
			String name,
			String phone,
			String email,
			String district,
			String specialty,
			String status,
			Instant createdAt) {
	}

	public record CreateAgronomistRequest(
			@NotBlank String name,
			@NotBlank String phone,
			String email,
			String district,
			String specialty,
			UserStatus status) {
	}

	public record PatchAgronomistRequest(
			String firstName,
			String lastName,
			String email,
			String district,
			String specialty,
			UserStatus status) {
	}

	public record FarmItem(
			UUID id,
			UUID farmerId,
			String farmerName,
			String name,
			String district,
			BigDecimal hectares,
			String status,
			Instant createdAt) {
	}

	public record FarmDetail(
			UUID id,
			UUID farmerId,
			String farmerName,
			String name,
			String description,
			String district,
			String province,
			BigDecimal hectares,
			Double latitude,
			Double longitude,
			String status,
			Instant createdAt,
			List<FieldItem> fields) {
	}

	public record FieldItem(
			UUID id, String name, BigDecimal hectares, String soilType, Double latitude, Double longitude) {
	}

	public record CreateFarmRequest(
			@NotNull UUID farmerId,
			@NotBlank String name,
			String description,
			String district,
			String province,
			BigDecimal hectares,
			Double latitude,
			Double longitude) {
	}

	public record CreateFieldRequest(
			@NotBlank String name,
			BigDecimal hectares,
			String soilType,
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

	public record CropItem(UUID id, String name, String scientificName, String description, Instant createdAt) {
	}

	public record CreateCropRequest(@NotBlank String name, String scientificName, String description) {
	}

	public record PatchCropRequest(String name, String scientificName, String description) {
	}

	public record AgroBusinessItem(
			UUID id, String name, String phone, String email, String status, long locations, Instant createdAt) {
	}

	public record AgroBusinessDetail(
			UUID id,
			String name,
			String description,
			String phone,
			String email,
			String status,
			Instant createdAt,
			List<LocationItem> locations) {
	}

	public record LocationItem(
			UUID id,
			String name,
			String address,
			String district,
			String province,
			Double latitude,
			Double longitude) {
	}

	public record CreateAgroBusinessRequest(@NotBlank String name, String description, String phone, String email) {
	}

	public record PatchAgroBusinessRequest(
			String name, String description, String phone, String email, AgroBusinessStatus status) {
	}

	public record CreateLocationRequest(
			@NotBlank String name,
			String address,
			String district,
			String province,
			Double latitude,
			Double longitude) {
	}

	public record ConversationItem(
			UUID id,
			UUID userId,
			String farmerName,
			String phone,
			String channel,
			String lastMessage,
			Instant lastMessageAt) {
	}

	public record ConversationDetail(
			UUID id,
			UUID userId,
			String farmerName,
			String phone,
			String channel,
			Instant startedAt,
			Instant lastMessageAt,
			List<MessageItem> messages) {
	}

	public record MessageItem(
			UUID id, String sender, String messageType, String content, String status, Instant createdAt) {
	}
}
