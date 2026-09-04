package com.farmitai.farmitai_backend.domain.auth.dto;

import java.util.List;
import java.util.UUID;

public record UserSummary(UUID id, String phone, String email, String status, List<String> roles) {
}
