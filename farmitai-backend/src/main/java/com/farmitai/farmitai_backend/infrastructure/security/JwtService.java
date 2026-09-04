package com.farmitai.farmitai_backend.infrastructure.security;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	private final byte[] secret;
	private final FarmitProperties properties;

	public JwtService(FarmitProperties properties) {
		this.properties = properties;
		this.secret = sha256(properties.jwt().secret());
	}

	public String createAccessToken(UUID userId, List<String> roles, String status) {
		Instant now = Instant.now();
		Instant expires = now.plus(properties.jwt().accessTtl());
		try {
			JWTClaimsSet claims = new JWTClaimsSet.Builder()
					.subject(userId.toString())
					.claim("roles", roles)
					.claim("status", status)
					.issueTime(Date.from(now))
					.expirationTime(Date.from(expires))
					.build();
			SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
			jwt.sign(new MACSigner(secret));
			return jwt.serialize();
		} catch (JOSEException ex) {
			throw new IllegalStateException("Unable to sign JWT", ex);
		}
	}

	public JWTClaimsSet parse(String token) {
		try {
			SignedJWT jwt = SignedJWT.parse(token);
			if (!jwt.verify(new MACVerifier(secret))) {
				throw new JOSEException("Invalid signature");
			}
			JWTClaimsSet claims = jwt.getJWTClaimsSet();
			Date expiration = claims.getExpirationTime();
			if (expiration == null || expiration.toInstant().isBefore(Instant.now())) {
				throw new JOSEException("Expired");
			}
			return claims;
		} catch (Exception ex) {
			throw new IllegalArgumentException("Invalid access token", ex);
		}
	}

	public long accessExpiresInSeconds() {
		return properties.jwt().accessTtl().toSeconds();
	}

	private static byte[] sha256(String value) {
		try {
			return MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException(ex);
		}
	}
}
