package com.farmitai.farmitai_backend.domain.auth;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Hashes;
import com.farmitai.farmitai_backend.domain.auth.dto.MeResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.OtpRequestResponse;
import com.farmitai.farmitai_backend.domain.auth.dto.TokenResponse;
import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.RoleRepository;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListRepository;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

	private static final Logger log = LoggerFactory.getLogger(AuthService.class);

	private final FarmitProperties properties;
	private final OtpChallengeRepository otpChallengeRepository;
	private final OtpRateLimiter otpRateLimiter;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final WaitingListRepository waitingListRepository;
	private final TokenRefreshService tokenRefreshService;
	private final PasswordEncoder passwordEncoder;
	private final PasswordResetTokenRepository passwordResetTokenRepository;

	public AuthService(
			FarmitProperties properties,
			OtpChallengeRepository otpChallengeRepository,
			OtpRateLimiter otpRateLimiter,
			UserRepository userRepository,
			RoleRepository roleRepository,
			WaitingListRepository waitingListRepository,
			TokenRefreshService tokenRefreshService,
			PasswordEncoder passwordEncoder,
			PasswordResetTokenRepository passwordResetTokenRepository) {
		this.properties = properties;
		this.otpChallengeRepository = otpChallengeRepository;
		this.otpRateLimiter = otpRateLimiter;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.waitingListRepository = waitingListRepository;
		this.tokenRefreshService = tokenRefreshService;
		this.passwordEncoder = passwordEncoder;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
	}

	@Transactional
	public OtpRequestResponse requestOtp(String phone) {
		otpRateLimiter.check(phone);
		otpChallengeRepository.findFirstByPhoneAndConsumedAtIsNullOrderByCreatedAtDesc(phone)
				.ifPresent(OtpChallenge::consume);

		String code = Hashes.sixDigitCode();
		Instant expiresAt = Instant.now().plus(properties.otp().ttl());
		otpChallengeRepository.save(OtpChallenge.open(phone, hashOtp(phone, code), expiresAt));

		if (properties.otp().logCode()) {
			log.info("OTP for {} is {}", phone, code);
		}

		return new OtpRequestResponse(
				phone,
				properties.otp().ttl().toSeconds(),
				properties.otp().logCode() ? code : null);
	}

	@Transactional
	public TokenResponse verifyOtp(String phone, String code, ApplicantType applicantType) {
		OtpChallenge challenge = otpChallengeRepository
				.findFirstByPhoneAndConsumedAtIsNullOrderByCreatedAtDesc(phone)
				.orElseThrow(() -> new ApiException(ErrorCode.INVALID_OTP));

		if (challenge.isExpired(Instant.now())) {
			challenge.consume();
			throw new ApiException(ErrorCode.OTP_EXPIRED);
		}

		if (!challenge.getCodeHash().equals(hashOtp(phone, code))) {
			challenge.incrementAttempts();
			if (challenge.getAttemptCount() >= properties.otp().maxAttempts()) {
				challenge.consume();
			}
			throw new ApiException(ErrorCode.INVALID_OTP);
		}

		challenge.consume();
		ApplicantType type = applicantType == null ? ApplicantType.FARMER : applicantType;
		User user = userRepository.findByPhone(phone).orElseGet(() -> createWaitlistUser(phone, type));
		if (!waitingListRepository.existsByUserId(user.getId())) {
			user.assignWaitlistRole(requireRole(waitlistRole(type)));
		}
		user.markLogin();
		return tokenRefreshService.issue(user);
	}

	@Transactional
	public TokenResponse login(String email, String password) {
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
			throw new ApiException(ErrorCode.UNAUTHENTICATED);
		}
		user.markLogin();
		return tokenRefreshService.issue(user);
	}

	@Transactional
	public void forgotPassword(String email) {
		userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
			if (user.getPasswordHash() == null) {
				return;
			}
			passwordResetTokenRepository.findAllByUserIdAndConsumedAtIsNull(user.getId())
					.forEach(PasswordResetToken::consume);
			String token = Hashes.randomToken();
			Instant expiresAt = Instant.now().plus(java.time.Duration.ofMinutes(30));
			passwordResetTokenRepository.save(PasswordResetToken.open(user, hashResetToken(token), expiresAt));
			if (properties.otp().logCode()) {
				log.info("Password reset for {} is http://localhost:3000/reset-password?token={}", email, token);
			}
		});
	}

	@Transactional
	public void resetPassword(String token, String password) {
		PasswordResetToken reset = passwordResetTokenRepository
				.findFirstByTokenHashAndConsumedAtIsNullOrderByCreatedAtDesc(hashResetToken(token))
				.orElseThrow(() -> new ApiException(ErrorCode.INVALID_RESET_TOKEN));
		if (reset.isExpired(Instant.now())) {
			reset.consume();
			throw new ApiException(ErrorCode.RESET_TOKEN_EXPIRED);
		}
		reset.consume();
		reset.getUser().setPasswordHash(passwordEncoder.encode(password));
	}

	@Transactional(readOnly = true)
	public MeResponse me(UserPrincipal principal) {
		User user = userRepository.findById(principal.getId())
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		List<String> roles = user.getRoles().stream().map(Role::getName).map(Enum::name).toList();
		MeResponse.WaitingListSummary waiting = waitingListRepository.findByUserId(user.getId())
				.map(entry -> new MeResponse.WaitingListSummary(entry.getStatus().name(), entry.getCreatedAt()))
				.orElse(null);
		return new MeResponse(user.getId(), user.getPhone(), user.getEmail(), user.getStatus().name(), roles, waiting);
	}

	private User createWaitlistUser(String phone, ApplicantType applicantType) {
		User user = User.farmer(phone);
		user.addRole(requireRole(waitlistRole(applicantType)));
		return userRepository.save(user);
	}

	private Role requireRole(RoleName name) {
		return roleRepository.findByName(name)
				.orElseThrow(() -> new IllegalStateException(name + " role missing"));
	}

	private static RoleName waitlistRole(ApplicantType applicantType) {
		return applicantType == ApplicantType.AGRONOMIST ? RoleName.AGRONOMIST : RoleName.FARMER;
	}

	private String hashResetToken(String token) {
		return Hashes.sha256(token + ":" + properties.jwt().secret());
	}

	private String hashOtp(String phone, String code) {
		return Hashes.sha256(phone + ":" + code + ":" + properties.jwt().secret());
	}
}
