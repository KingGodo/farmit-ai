package com.farmitai.farmitai_backend.common.dto;

import java.util.List;

public record ErrorBody(String code, String message, List<FieldErrorDetail> details) {

	public ErrorBody(String code, String message) {
		this(code, message, List.of());
	}
}
