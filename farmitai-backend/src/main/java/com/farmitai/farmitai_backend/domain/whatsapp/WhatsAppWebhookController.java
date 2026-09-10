package com.farmitai.farmitai_backend.domain.whatsapp;

import com.farmitai.farmitai_backend.common.config.FarmitProperties;
import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.domain.chat.ChatbotService;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/v1/whatsapp/webhook")
public class WhatsAppWebhookController {

	private static final Logger log = LoggerFactory.getLogger(WhatsAppWebhookController.class);

	private final FarmitProperties properties;
	private final ChatbotService chatbotService;
	private final ObjectMapper objectMapper;

	public WhatsAppWebhookController(
			FarmitProperties properties, ChatbotService chatbotService, ObjectMapper objectMapper) {
		this.properties = properties;
		this.chatbotService = chatbotService;
		this.objectMapper = objectMapper;
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
		ingest(body);
		return ResponseEntity.ok(ApiResponse.empty());
	}

	private void ingest(String body) {
		if (!StringUtils.hasText(body)) {
			return;
		}
		try {
			JsonNode root = objectMapper.readTree(body);
			JsonNode entries = root.path("entry");
			if (!entries.isArray()) {
				return;
			}
			for (JsonNode entry : entries) {
				for (JsonNode change : entry.path("changes")) {
					JsonNode value = change.path("value");
					for (JsonNode message : value.path("messages")) {
						String from = text(message.path("from"));
						String id = text(message.path("id"));
						String content = text(message.path("text").path("body"));
						if (!StringUtils.hasText(content) && "image".equals(text(message.path("type")))) {
							content = "I sent a crop photo.";
						}
						chatbotService.ingestWhatsApp(from, id, content);
					}
				}
			}
		} catch (Exception ex) {
			log.warn("WhatsApp payload was stored without a reply: {}", ex.getMessage());
		}
	}

	private static String text(JsonNode node) {
		return node == null || node.isMissingNode() || node.isNull() ? "" : node.asText();
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
