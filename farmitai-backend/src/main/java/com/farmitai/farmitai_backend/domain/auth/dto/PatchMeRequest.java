package com.farmitai.farmitai_backend.domain.auth.dto;

import jakarta.validation.constraints.Email;

public record PatchMeRequest(@Email String email, String phone) {
}
