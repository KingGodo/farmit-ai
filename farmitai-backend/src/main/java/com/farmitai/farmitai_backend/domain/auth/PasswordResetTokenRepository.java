package com.farmitai.farmitai_backend.domain.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

	List<PasswordResetToken> findAllByUserIdAndConsumedAtIsNull(UUID userId);

	Optional<PasswordResetToken> findFirstByTokenHashAndConsumedAtIsNullOrderByCreatedAtDesc(String tokenHash);
}
