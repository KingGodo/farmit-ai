package com.farmitai.farmitai_backend.domain.whatsapp;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/whatsapp/webhook")
public class WhatsAppWebhookController {

	private final FarmitProperties properties;

	public WhatsAppWebhookController(FarmitProperties properties) {
		this.properties = properties;
	}

	@GetMapping(produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<String> verify(
			@RequestParam(name = "hub.mode", required = false) String mode,
			@RequestParam(name = "hub.verify_token", required = false) String token,
			@RequestParam(name = "hub.challenge", required = false) String challenge) {
		if ("subscribe".equals(mode) && properties.whatsapp().verifyToken().equals(token)) {
			return ResponseEntity.ok(challenge == null ? "" : challenge);
		}
		return ResponseEntity.status(403).build();
	}

	@PostMapping
	public ResponseEntity<ApiResponse<Void>> inbound(
			@RequestHeader(name = "X-Hub-Signature-256", required = false) String signature,
			@RequestBody(required = false) String body) {
		String secret = properties.whatsapp().appSecret();
		if (StringUtils.hasText(secret) && !validSignature(secret, body == null ? "" : body, signature)) {
			return ResponseEntity.status(403).build();
		}
		return ResponseEntity.ok(ApiResponse.empty());
	}

	private static boolean validSignature(String secret, String body, String signature) {
		if (signature == null || !signature.startsWith("sha256=")) {
			return false;
		}
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			String expected = "sha256=" + HexFormat.of().formatHex(mac.doFinal(body.getBytes(StandardCharsets.UTF_8)));
			return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
		} catch (NoSuchAlgorithmException | InvalidKeyException ex) {
			return false;
		}
	}
}
