package com.farmitai.farmitai_backend.domain.agronomist;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AgronomistProfileRepository
		extends JpaRepository<AgronomistProfile, UUID>, JpaSpecificationExecutor<AgronomistProfile> {

	Optional<AgronomistProfile> findByUser_Id(UUID userId);

	List<AgronomistProfile> findAllByUser_IdIn(Collection<UUID> userIds);
}
