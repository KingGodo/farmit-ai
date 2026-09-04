package com.farmitai.farmitai_backend.infrastructure.security;

import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class FarmitUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public FarmitUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmailIgnoreCase(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return fromUser(user);
	}

	public UserPrincipal fromUser(User user) {
		List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
				.map(Role::getName)
				.map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
				.toList();
		return new UserPrincipal(
				user.getId(),
				user.getPhone(),
				user.getEmail(),
				user.getPasswordHash(),
				user.getStatus(),
				authorities);
	}
}
