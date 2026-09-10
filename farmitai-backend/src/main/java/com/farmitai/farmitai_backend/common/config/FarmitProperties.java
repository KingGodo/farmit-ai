package com.farmitai.farmitai_backend.common.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "farmit")
public record FarmitProperties(
		Jwt jwt,
		Otp otp,
		Admin admin,
		Whatsapp whatsapp,
		Dashboard dashboard
) {
	public FarmitProperties {
		if (whatsapp == null) {
			whatsapp = new Whatsapp("farmit-dev-verify", "");
		}
		if (dashboard == null) {
			dashboard = new Dashboard("http://localhost:3000");
		}
	}

	public record Jwt(String secret, Duration accessTtl, Duration refreshTtl) {
	}

	public record Otp(Duration ttl, boolean logCode, int maxAttempts) {
	}

	public record Admin(String email, String password, String phone) {
	}

	public record Whatsapp(String verifyToken, String appSecret) {
	}

	public record Dashboard(String publicUrl) {
		public Dashboard {
			if (publicUrl == null || publicUrl.isBlank()) {
				publicUrl = "http://localhost:3000";
			} else {
				publicUrl = publicUrl.replaceAll("/+$", "");
			}
		}
	}
}
