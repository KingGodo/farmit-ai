package com.farmitai.farmitai_backend.domain.agrobusiness;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AgroBusinessRepository
		extends JpaRepository<AgroBusiness, UUID>, JpaSpecificationExecutor<AgroBusiness> {
}
