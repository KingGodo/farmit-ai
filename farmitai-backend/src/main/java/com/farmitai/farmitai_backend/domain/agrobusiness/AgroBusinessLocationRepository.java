package com.farmitai.farmitai_backend.domain.agrobusiness;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgroBusinessLocationRepository extends JpaRepository<AgroBusinessLocation, UUID> {

	List<AgroBusinessLocation> findByAgroBusiness_IdOrderByCreatedAtAsc(UUID agroBusinessId);

	long countByAgroBusiness_Id(UUID agroBusinessId);
}
