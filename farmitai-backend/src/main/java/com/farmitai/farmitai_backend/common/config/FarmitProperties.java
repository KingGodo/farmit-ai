package com.farmitai.farmitai_backend.common.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "farmit")
public record FarmitProperties(
		Jwt jwt,
		Otp otp,
		Admin admin,
		Whatsapp whatsapp
) {
	public record Jwt(String secret, Duration accessTtl, Duration refreshTtl) {
	}

	public record Otp(Duration ttl, boolean logCode, int maxAttempts) {
	}

	public record Admin(String email, String password, String phone) {
	}

	public record Whatsapp(String verifyToken, String appSecret) {
	}
}
