package com.farmitai.farmitai_backend.domain.auth.dto;

public record TokenResponse(String accessToken, String refreshToken, long expiresInSeconds, UserSummary user) {
}
