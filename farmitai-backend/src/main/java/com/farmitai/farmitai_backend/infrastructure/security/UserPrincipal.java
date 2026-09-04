package com.farmitai.farmitai_backend.infrastructure.security;

import java.util.Collection;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.farmitai.farmitai_backend.domain.user.UserStatus;

public class UserPrincipal implements UserDetails {

	private final UUID id;
	private final String phone;
	private final String email;
	private final String passwordHash;
	private final UserStatus status;
	private final Collection<? extends GrantedAuthority> authorities;

	public UserPrincipal(
			UUID id,
			String phone,
			String email,
			String passwordHash,
			UserStatus status,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.phone = phone;
		this.email = email;
		this.passwordHash = passwordHash;
		this.status = status;
		this.authorities = authorities;
	}

	public UUID getId() {
		return id;
	}

	public String getPhone() {
		return phone;
	}

	public UserStatus getStatus() {
		return status;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return passwordHash;
	}

	@Override
	public String getUsername() {
		return email != null ? email : phone;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return status != UserStatus.SUSPENDED && status != UserStatus.DELETED;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return status != UserStatus.DELETED;
	}
}
