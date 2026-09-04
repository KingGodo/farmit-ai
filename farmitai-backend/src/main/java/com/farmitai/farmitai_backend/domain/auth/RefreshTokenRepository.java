package com.farmitai.farmitai_backend.domain.auth;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

	@Query("select t from RefreshToken t join fetch t.user u left join fetch u.roles where t.tokenHash = :hash")
	Optional<RefreshToken> findWithUserByTokenHash(@Param("hash") String hash);

	List<RefreshToken> findAllByFamilyId(UUID familyId);
}
