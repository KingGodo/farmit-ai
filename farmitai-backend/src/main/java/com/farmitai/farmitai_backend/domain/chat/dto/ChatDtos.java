package com.farmitai.farmitai_backend.domain.chat.dto;

import com.farmitai.farmitai_backend.domain.chat.ConversationChannel;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class ChatDtos {

	private ChatDtos() {
	}

	public record SendMessageRequest(@NotBlank String content, ConversationChannel channel) {
	}

	public record MessageResponse(
			UUID id, String sender, String messageType, String content, String status, Instant createdAt) {
	}

	public record ConversationResponse(
			UUID id,
			String channel,
			Instant startedAt,
			Instant lastMessageAt,
			List<MessageResponse> messages) {
	}

	public record SendMessageResponse(ConversationResponse conversation, MessageResponse reply) {
	}
}
