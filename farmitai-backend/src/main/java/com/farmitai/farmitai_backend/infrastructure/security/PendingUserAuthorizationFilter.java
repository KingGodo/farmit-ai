package com.farmitai.farmitai_backend.infrastructure.security;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.common.dto.ErrorBody;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import tools.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class PendingUserAuthorizationFilter extends OncePerRequestFilter {

	private static final Set<String> ALLOWED_PREFIXES = Set.of(
			"/api/v1/auth/me",
			"/api/v1/auth/logout",
			"/api/v1/waiting-list");

	private final ObjectMapper objectMapper;

	public PendingUserAuthorizationFilter(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal
				&& principal.getStatus() == UserStatus.PENDING) {
			String path = request.getRequestURI();
			boolean allowed = ALLOWED_PREFIXES.stream().anyMatch(path::startsWith);
			if (!allowed) {
				response.setStatus(HttpServletResponse.SC_FORBIDDEN);
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);
				objectMapper.writeValue(response.getOutputStream(), ApiResponse.fail(
						new ErrorBody(ErrorCode.FORBIDDEN.name(), ErrorCode.FORBIDDEN.defaultMessage())));
				return;
			}
		}
		filterChain.doFilter(request, response);
	}
}
