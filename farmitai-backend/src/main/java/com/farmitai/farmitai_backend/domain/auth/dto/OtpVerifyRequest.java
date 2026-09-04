package com.farmitai.farmitai_backend.domain.auth.dto;

import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(
		@NotBlank
		@Pattern(regexp = "^\\+[1-9]\\d{7,14}$", message = "must be E.164")
		String phone,
		@NotBlank
		@Pattern(regexp = "^\\d{6}$", message = "must be a 6-digit code")
		String code,
		ApplicantType applicantType) {
}
