package com.farmitai.farmitai_backend.infrastructure.security;

import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UserRepository userRepository;
	private final FarmitUserDetailsService userDetailsService;

	public JwtAuthenticationFilter(
			JwtService jwtService,
			UserRepository userRepository,
			FarmitUserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userRepository = userRepository;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			try {
				JWTClaimsSet claims = jwtService.parse(token);
				UUID userId = UUID.fromString(claims.getSubject());
				userRepository.findById(userId).ifPresent(user -> {
					UserPrincipal principal = userDetailsService.fromUser(user);
					UsernamePasswordAuthenticationToken authentication =
							new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(authentication);
				});
			} catch (IllegalArgumentException ignored) {
				SecurityContextHolder.clearContext();
			}
		}
		filterChain.doFilter(request, response);
	}
}
