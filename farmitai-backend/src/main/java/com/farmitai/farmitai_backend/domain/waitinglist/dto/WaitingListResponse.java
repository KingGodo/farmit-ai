package com.farmitai.farmitai_backend.domain.waitinglist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record WaitingListResponse(
		UUID id,
		String status,
		String applicantType,
		String name,
		String phone,
		String location,
		String farmingType,
		Instant createdAt,
		Long districtSignups) {
}
