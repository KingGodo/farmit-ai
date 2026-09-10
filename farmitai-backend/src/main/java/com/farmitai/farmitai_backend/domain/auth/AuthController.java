package com.farmitai.farmitai_backend.domain.auth;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.ChangePasswordRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.ForgotPasswordRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.ForgotPasswordResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.LoginRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.MeResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.PatchMeRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.RegisterRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.OtpRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.OtpRequestResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.OtpVerifyRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.RefreshRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.ResetPasswordRequest;
import com.farmitai.farmitai_backend.domain.auth.dto.TokenResponse;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final AuthService authService;
	private final TokenRefreshService tokenRefreshService;

	public AuthController(AuthService authService, TokenRefreshService tokenRefreshService) {
		this.authService = authService;
		this.tokenRefreshService = tokenRefreshService;
	}

	@PostMapping("/otp/request")
	public ApiResponse<OtpRequestResponse> requestOtp(@Valid @RequestBody OtpRequest request) {
		return ApiResponse.ok(authService.requestOtp(request.phone()));
	}

	@PostMapping("/otp/verify")
	public ApiResponse<TokenResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
		return ApiResponse.ok(authService.verifyOtp(request.phone(), request.code(), request.applicantType()));
	}

	@PostMapping("/login")
	public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
		return ApiResponse.ok(authService.login(request.email(), request.password()));
	}

	@PostMapping("/register")
	public ApiResponse<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ApiResponse.ok(authService.registerAdmin(request.email(), request.password(), request.phone()));
	}

	@PostMapping("/forgot-password")
	public ApiResponse<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		return ApiResponse.ok(authService.forgotPassword(request.email()));
	}

	@PostMapping("/reset-password")
	public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		authService.resetPassword(request.token(), request.password());
		return ApiResponse.empty();
	}

	@PostMapping("/refresh")
	public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
		return ApiResponse.ok(tokenRefreshService.rotate(request.refreshToken()));
	}

	@PostMapping("/logout")
	@SecurityRequirement(name = "bearer-jwt")
	public ApiResponse<Void> logout(@Valid @RequestBody RefreshRequest request) {
		tokenRefreshService.revoke(request.refreshToken());
		return ApiResponse.empty();
	}

	@GetMapping("/me")
	@SecurityRequirement(name = "bearer-jwt")
	public ApiResponse<MeResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(authService.me(principal));
	}

	@PatchMapping("/me")
	@SecurityRequirement(name = "bearer-jwt")
	public ApiResponse<MeResponse> patchMe(
			@Valid @RequestBody PatchMeRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(authService.patchMe(principal, request));
	}

	@PostMapping("/change-password")
	@SecurityRequirement(name = "bearer-jwt")
	public ApiResponse<Void> changePassword(
			@Valid @RequestBody ChangePasswordRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		authService.changePassword(principal, request.currentPassword(), request.newPassword());
		return ApiResponse.empty();
	}
}
