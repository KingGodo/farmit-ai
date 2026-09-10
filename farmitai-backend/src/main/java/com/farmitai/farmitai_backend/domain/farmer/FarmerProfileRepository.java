package com.farmitai.farmitai_backend.domain.farmer;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FarmerProfileRepository
		extends JpaRepository<FarmerProfile, UUID>, JpaSpecificationExecutor<FarmerProfile> {

	Optional<FarmerProfile> findByUser_Id(UUID userId);

	List<FarmerProfile> findAllByUser_IdIn(Collection<UUID> userIds);

	boolean existsByUser_Id(UUID userId);
}
