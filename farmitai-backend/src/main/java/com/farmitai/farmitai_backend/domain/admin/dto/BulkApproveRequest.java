package com.farmitai.farmitai_backend.domain.admin.dto;

import java.util.List;
import java.util.UUID;

public record BulkApproveRequest(List<UUID> ids) {
}
