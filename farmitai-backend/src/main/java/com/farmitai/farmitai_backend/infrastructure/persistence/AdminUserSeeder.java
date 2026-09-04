package com.farmitai.farmitai_backend.infrastructure.persistence;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.RoleRepository;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2)
public class AdminUserSeeder implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

	private final FarmitProperties properties;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	public AdminUserSeeder(
			FarmitProperties properties,
			UserRepository userRepository,
			RoleRepository roleRepository,
			PasswordEncoder passwordEncoder) {
		this.properties = properties;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		String email = properties.admin().email();
		String phone = properties.admin().phone();
		String password = properties.admin().password();
		Role adminRole = roleRepository.findByName(RoleName.ADMIN)
				.orElseThrow(() -> new IllegalStateException("ADMIN role missing — did Flyway run?"));

		User admin = userRepository.findByEmailIgnoreCase(email)
				.orElseGet(() -> User.admin(phone, email, "pending"));
		admin.applyAdminSeed(phone, email, passwordEncoder.encode(password));
		if (!admin.hasRole(RoleName.ADMIN)) {
			admin.addRole(adminRole);
		}
		userRepository.save(admin);
		log.info("Seeded admin login {}", email);
	}
}
