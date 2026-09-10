package com.farmitai.farmitai_backend.domain.farmer;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmFieldRepository extends JpaRepository<FarmField, UUID> {

	List<FarmField> findByFarm_IdOrderByCreatedAtAsc(UUID farmId);
}
