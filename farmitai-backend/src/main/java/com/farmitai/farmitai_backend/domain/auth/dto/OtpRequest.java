package com.farmitai.farmitai_backend.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpRequest(
		@NotBlank
		@Pattern(regexp = "^\\+[1-9]\\d{7,14}$", message = "must be E.164")
		String phone) {
}
