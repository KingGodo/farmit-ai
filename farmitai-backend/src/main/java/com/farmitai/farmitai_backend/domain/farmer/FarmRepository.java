package com.farmitai.farmitai_backend.domain.farmer;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FarmRepository extends JpaRepository<Farm, UUID>, JpaSpecificationExecutor<Farm> {

	List<Farm> findByFarmer_IdOrderByCreatedAtDesc(UUID farmerId);

	long countByFarmer_Id(UUID farmerId);

	List<Farm> findAllByFarmer_IdIn(Collection<UUID> farmerIds);
}
