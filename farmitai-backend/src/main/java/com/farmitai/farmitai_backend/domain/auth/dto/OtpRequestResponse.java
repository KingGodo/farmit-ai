package com.farmitai.farmitai_backend.domain.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OtpRequestResponse(String phone, long expiresInSeconds, String devCode) {
}
