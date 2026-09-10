package com.farmitai.farmitai_backend.domain.user;

import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.PhoneNumbers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountFactory {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;

	public AccountFactory(UserRepository userRepository, RoleRepository roleRepository) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	@Transactional
	public User create(String phone, String email, RoleName roleName, UserStatus status) {
		String e164;
		try {
			e164 = PhoneNumbers.requireE164(phone);
		} catch (IllegalArgumentException ex) {
			throw new ApiException(ErrorCode.VALIDATION_ERROR, "phone must be E.164");
		}
		if (userRepository.findByPhone(e164).isPresent()) {
			throw new ApiException(ErrorCode.CONFLICT, "A user with that phone already exists.");
		}
		if (email != null && !email.isBlank() && userRepository.existsByEmailIgnoreCase(email.trim())) {
			throw new ApiException(ErrorCode.CONFLICT, "A user with that email already exists.");
		}
		Role role = roleRepository.findByName(roleName)
				.orElseThrow(() -> new ApiException(ErrorCode.INTERNAL_ERROR, "Role is not seeded."));
		User user = User.farmer(e164);
		user.setEmail(email);
		user.setStatus(status);
		user.addRole(role);
		return userRepository.save(user);
	}

	@Transactional
	public User createAdmin(String phone, String email, String passwordHash) {
		String e164;
		try {
			e164 = PhoneNumbers.requireE164(phone);
		} catch (IllegalArgumentException ex) {
			throw new ApiException(ErrorCode.VALIDATION_ERROR, "phone must be E.164");
		}
		String normalizedEmail = email == null ? "" : email.trim();
		if (normalizedEmail.isBlank()) {
			throw new ApiException(ErrorCode.VALIDATION_ERROR, "email is required");
		}
		if (userRepository.findByPhone(e164).isPresent()) {
			throw new ApiException(ErrorCode.CONFLICT, "A user with that phone already exists.");
		}
		if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
			throw new ApiException(ErrorCode.CONFLICT, "A user with that email already exists.");
		}
		Role role = roleRepository.findByName(RoleName.ADMIN)
				.orElseThrow(() -> new ApiException(ErrorCode.INTERNAL_ERROR, "Role is not seeded."));
		User user = User.admin(e164, normalizedEmail, passwordHash);
		user.addRole(role);
		return userRepository.save(user);
	}
}
