package com.farmitai.farmitai_backend.domain.admin.dto;

import java.time.Instant;
import java.util.UUID;

public record AdminWaitingListItem(
		UUID id,
		UUID userId,
		String name,
		String phone,
		String email,
		String location,
		String farmingType,
		String applicantType,
		String status,
		String notes,
		Instant createdAt,
		Instant reviewedAt) {
}
