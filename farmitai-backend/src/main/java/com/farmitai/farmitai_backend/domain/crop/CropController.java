package com.farmitai.farmitai_backend.domain.crop;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.domain.admin.AdminCropsService;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/crops")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("isAuthenticated()")
public class CropController {

	private final AdminCropsService adminCropsService;

	public CropController(AdminCropsService adminCropsService) {
		this.adminCropsService = adminCropsService;
	}

	@GetMapping
	public ApiResponse<PaginatedData<AdminDtos.CropItem>> list(
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "50") int size) {
		return ApiResponse.ok(adminCropsService.list(q, page, size));
	}
}
