package com.farmitai.farmitai_backend.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
	VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Request is invalid."),
	UNAUTHENTICATED(HttpStatus.UNAUTHORIZED, "Authentication is required."),
	INVALID_OTP(HttpStatus.UNAUTHORIZED, "That code is not valid."),
	OTP_EXPIRED(HttpStatus.UNAUTHORIZED, "That code has expired. Request a new one."),
	INVALID_RESET_TOKEN(HttpStatus.UNAUTHORIZED, "That reset link is not valid."),
	RESET_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "That reset link has expired. Request a new one."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "You cannot perform this action."),
	NOT_FOUND(HttpStatus.NOT_FOUND, "The requested resource was not found."),
	WAITING_LIST_ALREADY_JOINED(HttpStatus.CONFLICT, "This account is already on the waiting list."),
	RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Try again shortly."),
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong.");

	private final HttpStatus status;
	private final String defaultMessage;

	ErrorCode(HttpStatus status, String defaultMessage) {
		this.status = status;
		this.defaultMessage = defaultMessage;
	}

	public HttpStatus status() {
		return status;
	}

	public String defaultMessage() {
		return defaultMessage;
	}
}
