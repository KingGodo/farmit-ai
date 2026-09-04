package com.farmitai.farmitai_backend.domain.auth;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Hashes;
import com.farmitai.farmitai_backend.domain.auth.dto.TokenResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.UserSummary;
import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.infrastructure.security.JwtService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenRefreshService {

	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtService jwtService;
	private final FarmitProperties properties;

	public TokenRefreshService(
			RefreshTokenRepository refreshTokenRepository,
			JwtService jwtService,
			FarmitProperties properties) {
		this.refreshTokenRepository = refreshTokenRepository;
		this.jwtService = jwtService;
		this.properties = properties;
	}

	@Transactional
	public TokenResponse issue(User user) {
		return issue(user, UUID.randomUUID());
	}

	@Transactional
	public TokenResponse rotate(String rawRefreshToken) {
		String hash = Hashes.sha256(rawRefreshToken);
		RefreshToken existing = refreshTokenRepository.findWithUserByTokenHash(hash)
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));

		if (existing.isRevoked()) {
			revokeFamily(existing.getFamilyId());
			throw new ApiException(ErrorCode.UNAUTHENTICATED);
		}
		if (existing.isExpired(Instant.now())) {
			existing.revoke();
			throw new ApiException(ErrorCode.UNAUTHENTICATED);
		}

		existing.revoke();
		return issue(existing.getUser(), existing.getFamilyId());
	}

	@Transactional
	public void revoke(String rawRefreshToken) {
		refreshTokenRepository.findByTokenHash(Hashes.sha256(rawRefreshToken))
				.ifPresent(RefreshToken::revoke);
	}

	private TokenResponse issue(User user, UUID familyId) {
		String refreshRaw = Hashes.randomToken();
		Instant expiresAt = Instant.now().plus(properties.jwt().refreshTtl());
		refreshTokenRepository.save(RefreshToken.issue(user, familyId, Hashes.sha256(refreshRaw), expiresAt));

		List<String> roles = user.getRoles().stream().map(Role::getName).map(Enum::name).toList();
		String access = jwtService.createAccessToken(user.getId(), roles, user.getStatus().name());
		UserSummary summary = new UserSummary(user.getId(), user.getPhone(), user.getEmail(), user.getStatus().name(), roles);
		return new TokenResponse(access, refreshRaw, jwtService.accessExpiresInSeconds(), summary);
	}

	private void revokeFamily(UUID familyId) {
		refreshTokenRepository.findAllByFamilyId(familyId).forEach(RefreshToken::revoke);
	}
}
