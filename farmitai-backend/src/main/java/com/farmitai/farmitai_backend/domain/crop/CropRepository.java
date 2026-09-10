package com.farmitai.farmitai_backend.domain.crop;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CropRepository extends JpaRepository<Crop, UUID>, JpaSpecificationExecutor<Crop> {

	Optional<Crop> findByNameIgnoreCase(String name);

	boolean existsByNameIgnoreCase(String name);
}
