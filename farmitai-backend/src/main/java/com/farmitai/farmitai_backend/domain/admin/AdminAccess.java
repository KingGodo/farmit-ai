package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;

public final class AdminAccess {

	private AdminAccess() {
	}

	public static void requireActive(UserPrincipal principal) {
		if (principal == null || principal.getStatus() != UserStatus.ACTIVE) {
			throw new ApiException(ErrorCode.FORBIDDEN);
		}
	}
}
