package com.farmitai.farmitai_backend.domain.chat;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WhatsAppAccountRepository extends JpaRepository<WhatsAppAccount, UUID> {

	Optional<WhatsAppAccount> findByPhoneNumber(String phoneNumber);

	Optional<WhatsAppAccount> findByUser_Id(UUID userId);
}
