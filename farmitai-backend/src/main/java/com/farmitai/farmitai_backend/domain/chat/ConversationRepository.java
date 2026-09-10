package com.farmitai.farmitai_backend.domain.chat;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ConversationRepository
		extends JpaRepository<Conversation, UUID>, JpaSpecificationExecutor<Conversation> {

	Optional<Conversation> findByUser_IdAndChannel(UUID userId, ConversationChannel channel);
}
