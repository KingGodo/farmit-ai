package com.farmitai.farmitai_backend.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "roles")
public class Role {

	@Id
	private UUID id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, unique = true, length = 50)
	private RoleName name;

	protected Role() {
	}

	public static Role seeded(UUID id, RoleName name) {
		Role role = new Role();
		role.id = id;
		role.name = name;
		return role;
	}

	public UUID getId() {
		return id;
	}

	public RoleName getName() {
		return name;
	}
}
