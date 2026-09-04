package com.farmitai.farmitai_backend.domain.waitinglist;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.JoinWaitingListRequest;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.PublicJoinWaitingListRequest;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.WaitingListResponse;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/waiting-list")
public class WaitingListController {

	private final WaitingListService waitingListService;

	public WaitingListController(WaitingListService waitingListService) {
		this.waitingListService = waitingListService;
	}

	@PostMapping("/open")
	public ApiResponse<WaitingListResponse> joinOpen(@Valid @RequestBody PublicJoinWaitingListRequest request) {
		return ApiResponse.ok(waitingListService.joinOpen(request));
	}

	@PostMapping
	@SecurityRequirement(name = "bearer-jwt")
	@PreAuthorize("hasAnyRole('FARMER', 'AGRONOMIST')")
	public ApiResponse<WaitingListResponse> join(
			@AuthenticationPrincipal UserPrincipal principal,
			@Valid @RequestBody JoinWaitingListRequest request) {
		return ApiResponse.ok(waitingListService.join(principal, request));
	}

	@GetMapping("/me")
	@SecurityRequirement(name = "bearer-jwt")
	@PreAuthorize("hasAnyRole('FARMER', 'AGRONOMIST')")
	public ApiResponse<WaitingListResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(waitingListService.me(principal.getId()));
	}
}
