package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.ApiResponse;
import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.chat.ChatbotService;
import com.farmitai.farmitai_backend.domain.chat.ConversationChannel;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/conversations")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class AdminConversationsController {

	private final ChatbotService chatbotService;

	public AdminConversationsController(ChatbotService chatbotService) {
		this.chatbotService = chatbotService;
	}

	@GetMapping
	public ApiResponse<PaginatedData<AdminDtos.ConversationItem>> list(
			@RequestParam(required = false) ConversationChannel channel,
			@RequestParam(required = false) String q,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size,
			@AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(chatbotService.list(channel, q, page, size));
	}

	@GetMapping("/{id}")
	public ApiResponse<AdminDtos.ConversationDetail> get(
			@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
		AdminAccess.requireActive(principal);
		return ApiResponse.ok(chatbotService.get(id));
	}
}
