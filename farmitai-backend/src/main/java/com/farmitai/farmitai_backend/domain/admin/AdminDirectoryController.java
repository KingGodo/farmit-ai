package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDirectoryController {

	private final AdminUsersService adminUsersService;
	private final AdminFarmersService adminFarmersService;
	private final AdminAgronomistsService adminAgronomistsService;
	private final AdminFarmsService adminFarmsService;
	private final AdminCropsService adminCropsService;
	private final AdminAgroBusinessesService adminAgroBusinessesService;

	public AdminDirectoryController(
			AdminUsersService adminUsersService,
			AdminFarmersService adminFarmersService,
			AdminAgronomistsService adminAgronomistsService,
			AdminFarmsService adminFarmsService,
			AdminCropsService adminCropsService,
			AdminAgroBusinessesService adminAgroBusinessesService) {
		this.adminUsersService = adminUsersService;
		this.adminFarmersService = adminFarmersService;
		this.adminAgronomistsService = adminAgronomistsService;
		this.adminFarmsService = adminFarmsService;
		this.adminCropsService = adminCropsService;
		this.adminAgroBusinessesService = adminAgroBusinessesService;
	}

	@GetMapping("/users")
	public ApiResponse<PaginatedData<AdminDtos.UserItem>> users(
			@RequestParam(required = false) UserStatus status,
			@RequestParam(required = false) RoleName role,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminUsersService.list(status, role, q, page, size));
	}

	@PatchMapping("/users/{id}")
	public ApiResponse<AdminDtos.UserItem> patchUser(
			@PathVariable UUID id,
			@Valid @RequestBody AdminDtos.PatchUserRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminUsersService.patch(id, request));
	}

	@GetMapping("/farmers")
	public ApiResponse<PaginatedData<AdminDtos.FarmerItem>> farmers(
			@RequestParam(required = false) UserStatus status,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmersService.list(status, q, page, size));
	}

	@GetMapping("/farmers/{id}")
	public ApiResponse<AdminDtos.FarmerDetail> farmer(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmersService.get(id));
	}

	@PostMapping("/farmers")
	public ApiResponse<AdminDtos.FarmerItem> createFarmer(
			@Valid @RequestBody AdminDtos.CreateFarmerRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmersService.create(request));
	}

	@PatchMapping("/farmers/{id}")
	public ApiResponse<AdminDtos.FarmerItem> patchFarmer(
			@PathVariable UUID id,
			@RequestBody AdminDtos.PatchFarmerRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmersService.patch(id, request));
	}

	@GetMapping("/agronomists")
	public ApiResponse<PaginatedData<AdminDtos.AgronomistItem>> agronomists(
			@RequestParam(required = false) UserStatus status,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgronomistsService.list(status, q, page, size));
	}

	@GetMapping("/agronomists/{id}")
	public ApiResponse<AdminDtos.AgronomistItem> agronomist(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgronomistsService.get(id));
	}

	@PostMapping("/agronomists")
	public ApiResponse<AdminDtos.AgronomistItem> createAgronomist(
			@Valid @RequestBody AdminDtos.CreateAgronomistRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgronomistsService.create(request));
	}

	@PatchMapping("/agronomists/{id}")
	public ApiResponse<AdminDtos.AgronomistItem> patchAgronomist(
			@PathVariable UUID id,
			@RequestBody AdminDtos.PatchAgronomistRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgronomistsService.patch(id, request));
	}

	@GetMapping("/farms")
	public ApiResponse<PaginatedData<AdminDtos.FarmItem>> farms(
			@RequestParam(required = false) com.farmitai.farmitai_backend.domain.farmer.FarmStatus status,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmsService.list(status, q, page, size));
	}

	@GetMapping("/farms/{id}")
	public ApiResponse<AdminDtos.FarmDetail> farm(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmsService.get(id));
	}

	@PostMapping("/farms")
	public ApiResponse<AdminDtos.FarmItem> createFarm(
			@Valid @RequestBody AdminDtos.CreateFarmRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmsService.create(request));
	}

	@PatchMapping("/farms/{id}")
	public ApiResponse<AdminDtos.FarmItem> patchFarm(
			@PathVariable UUID id,
			@RequestBody AdminDtos.PatchFarmRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmsService.patch(id, request));
	}

	@PostMapping("/farms/{id}/fields")
	public ApiResponse<AdminDtos.FieldItem> addField(
			@PathVariable UUID id,
			@Valid @RequestBody AdminDtos.CreateFieldRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminFarmsService.addField(id, request));
	}

	@GetMapping("/crops")
	public ApiResponse<PaginatedData<AdminDtos.CropItem>> crops(
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminCropsService.list(q, page, size));
	}

	@GetMapping("/crops/{id}")
	public ApiResponse<AdminDtos.CropItem> crop(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminCropsService.get(id));
	}

	@PostMapping("/crops")
	public ApiResponse<AdminDtos.CropItem> createCrop(
			@Valid @RequestBody AdminDtos.CreateCropRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminCropsService.create(request));
	}

	@PatchMapping("/crops/{id}")
	public ApiResponse<AdminDtos.CropItem> patchCrop(
			@PathVariable UUID id,
			@RequestBody AdminDtos.PatchCropRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminCropsService.patch(id, request));
	}

	@GetMapping("/agro-businesses")
	public ApiResponse<PaginatedData<AdminDtos.AgroBusinessItem>> agroBusinesses(
			@RequestParam(required = false) com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessStatus status,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgroBusinessesService.list(status, q, page, size));
	}

	@GetMapping("/agro-businesses/{id}")
	public ApiResponse<AdminDtos.AgroBusinessDetail> agroBusiness(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgroBusinessesService.get(id));
	}

	@PostMapping("/agro-businesses")
	public ApiResponse<AdminDtos.AgroBusinessItem> createAgroBusiness(
			@Valid @RequestBody AdminDtos.CreateAgroBusinessRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgroBusinessesService.create(request));
	}

	@PatchMapping("/agro-businesses/{id}")
	public ApiResponse<AdminDtos.AgroBusinessItem> patchAgroBusiness(
			@PathVariable UUID id,
			@RequestBody AdminDtos.PatchAgroBusinessRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgroBusinessesService.patch(id, request));
	}

	@PostMapping("/agro-businesses/{id}/locations")
	public ApiResponse<AdminDtos.LocationItem> addLocation(
			@PathVariable UUID id,
			@Valid @RequestBody AdminDtos.CreateLocationRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(adminAgroBusinessesService.addLocation(id, request));
	}
}
