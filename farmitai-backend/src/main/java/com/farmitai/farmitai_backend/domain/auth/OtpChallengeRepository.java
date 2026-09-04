package com.farmitai.farmitai_backend.domain.auth;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, UUID> {

	Optional<OtpChallenge> findFirstByPhoneAndConsumedAtIsNullOrderByCreatedAtDesc(String phone);
}
