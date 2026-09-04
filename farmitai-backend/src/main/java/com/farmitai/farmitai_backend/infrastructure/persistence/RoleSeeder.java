package com.farmitai.farmitai_backend.infrastructure.persistence;

import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.RoleRepository;
import java.util.UUID;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(1)
public class RoleSeeder implements ApplicationRunner {

	private final RoleRepository roleRepository;

	public RoleSeeder(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		seed(RoleName.FARMER, "11111111-1111-1111-1111-111111111111");
		seed(RoleName.AGRO_BUSINESS, "22222222-2222-2222-2222-222222222222");
		seed(RoleName.ADMIN, "33333333-3333-3333-3333-333333333333");
		seed(RoleName.AGRONOMIST, "44444444-4444-4444-4444-444444444444");
	}

	private void seed(RoleName name, String id) {
		if (roleRepository.findByName(name).isEmpty()) {
			roleRepository.save(Role.seeded(UUID.fromString(id), name));
		}
	}
}
