package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminWaitingListItem;
import com.farmitai.farmitai_backend.domain.admin.dto.BulkApproveRequest;
import com.farmitai.farmitai_backend.domain.admin.dto.BulkApproveResponse;
import com.farmitai.farmitai_backend.domain.admin.dto.ReviewWaitingListRequest;
import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListStatus;
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
@RequestMapping("/api/v1/admin/waiting-list")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class AdminWaitingListController {

	private final AdminWaitingListService adminWaitingListService;

	public AdminWaitingListController(AdminWaitingListService adminWaitingListService) {
		this.adminWaitingListService = adminWaitingListService;
	}

	@GetMapping
	public ApiResponse<PaginatedData<AdminWaitingListItem>> list(
			@RequestParam(required = false) WaitingListStatus status,
			@RequestParam(required = false) ApplicantType applicantType,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@RequestParam(required = false) String q,
			@AuthenticationPrincipal UserPrincipal principal) {
		requireActiveAdmin(principal);
		return ApiResponse.ok(adminWaitingListService.list(status, applicantType, q, page, size));
	}

	@GetMapping("/{id}")
	public ApiResponse<AdminWaitingListItem> get(
			@PathVariable UUID id,
			@AuthenticationPrincipal UserPrincipal principal) {
		requireActiveAdmin(principal);
		return ApiResponse.ok(adminWaitingListService.get(id));
	}

	@PatchMapping("/{id}")
	public ApiResponse<AdminWaitingListItem> review(
			@PathVariable UUID id,
			@Valid @RequestBody ReviewWaitingListRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		requireActiveAdmin(principal);
		return ApiResponse.ok(adminWaitingListService.review(id, request, principal));
	}

	@PostMapping("/bulk-approve")
	public ApiResponse<BulkApproveResponse> bulkApprove(
			@RequestBody(required = false) BulkApproveRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		requireActiveAdmin(principal);
		return ApiResponse.ok(adminWaitingListService.bulkApprove(
				request == null ? null : request.ids(), principal));
	}

	private void requireActiveAdmin(UserPrincipal principal) {
		if (principal.getStatus() != com.farmitai.farmitai_backend.domain.user.UserStatus.ACTIVE) {
			throw new com.farmitai.farmitai_backend.common.exception.ApiException(
					com.farmitai.farmitai_backend.common.exception.ErrorCode.FORBIDDEN);
		}
	}
}
