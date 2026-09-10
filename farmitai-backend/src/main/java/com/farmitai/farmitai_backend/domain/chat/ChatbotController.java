package com.farmitai.farmitai_backend.domain.chat;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.domain.chat.dto.ChatDtos;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatbot")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("isAuthenticated()")
public class ChatbotController {

	private final ChatbotService chatbotService;

	public ChatbotController(ChatbotService chatbotService) {
		this.chatbotService = chatbotService;
	}

	@PostMapping("/messages")
	public ApiResponse<ChatDtos.SendMessageResponse> send(
			@Valid @RequestBody ChatDtos.SendMessageRequest request,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(chatbotService.send(principal.getId(), request));
	}

	@GetMapping("/conversations/me")
	public ApiResponse<ChatDtos.ConversationResponse> me(
			@RequestParam(required = false) ConversationChannel channel,
			@AuthenticationPrincipal UserPrincipal principal) {
		return ApiResponse.ok(chatbotService.myConversation(principal.getId(), channel));
	}
}
