package com.farmitai.farmitai_backend.domain.waitinglist.dto;

import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PublicJoinWaitingListRequest(
		@NotBlank
		@Pattern(regexp = "^\\+[1-9]\\d{7,14}$", message = "must be E.164")
		String phone,
		@NotBlank @Size(max = 255) String name,
		@Size(max = 255) String location,
		@Size(max = 100) String farmingType,
		@Size(max = 255) String email,
		@NotNull ApplicantType applicantType) {
}
