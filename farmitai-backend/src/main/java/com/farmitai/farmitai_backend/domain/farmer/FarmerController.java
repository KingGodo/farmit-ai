package com.farmitai.farmitai_backend.domain.farmer;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.domain.farmer.dto.FarmerDtos;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

	private final FarmerService farmerService;

	public FarmerController(FarmerService farmerService) {
		this.farmerService = farmerService;
	}

	@GetMapping("/api/v1/farmers/me")
	public ApiResponse<FarmerDtos.MeResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.me(principal.getId()));
	}

	@PatchMapping("/api/v1/farmers/me")
	public ApiResponse<FarmerDtos.MeResponse> patchMe(
			@RequestBody FarmerDtos.PatchMeRequest request, @AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.patchMe(principal.getId(), request));
	}

	@GetMapping("/api/v1/farms")
	public ApiResponse<List<FarmerDtos.FarmResponse>> farms(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.myFarms(principal.getId()));
	}

	@PostMapping("/api/v1/farms")
	public ApiResponse<FarmerDtos.FarmResponse> createFarm(
			@Valid @RequestBody FarmerDtos.CreateFarmRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.createFarm(principal.getId(), request));
	}

	@GetMapping("/api/v1/farms/{id}")
	public ApiResponse<FarmerDtos.FarmResponse> farm(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.farm(principal.getId(), id));
	}

	@PatchMapping("/api/v1/farms/{id}")
	public ApiResponse<FarmerDtos.FarmResponse> patchFarm(
			@PathVariable UUID id,
			@RequestBody FarmerDtos.PatchFarmRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.patchFarm(principal.getId(), id, request));
	}

	@PostMapping("/api/v1/farms/{id}/fields")
	public ApiResponse<FarmerDtos.FieldResponse> addField(
			@PathVariable UUID id,
			@Valid @RequestBody FarmerDtos.CreateFieldRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(farmerService.addField(principal.getId(), id, request));
	}
}
