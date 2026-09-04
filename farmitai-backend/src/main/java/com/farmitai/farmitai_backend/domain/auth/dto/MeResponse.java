package com.farmitai.farmitai_backend.domain.auth.dto;

import java.time.Instant;

public record MeResponse(
		java.util.UUID id,
		String phone,
		String email,
		String status,
		java.util.List<String> roles,
		WaitingListSummary waitingList) {

	public record WaitingListSummary(String status, Instant createdAt) {
	}
}
