package com.farmitai.farmitai_backend.domain.admin.dto;

import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewWaitingListRequest(
		@NotNull WaitingListStatus status,
		String notes) {
}
