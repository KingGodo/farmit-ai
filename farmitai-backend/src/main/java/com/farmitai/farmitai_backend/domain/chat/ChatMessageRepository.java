package com.farmitai.farmitai_backend.domain.chat;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

	List<ChatMessage> findByConversation_IdOrderByCreatedAtAsc(UUID conversationId);
}
