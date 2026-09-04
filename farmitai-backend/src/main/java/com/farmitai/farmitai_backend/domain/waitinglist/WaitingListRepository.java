package com.farmitai.farmitai_backend.domain.waitinglist;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WaitingListRepository extends JpaRepository<WaitingList, UUID>, JpaSpecificationExecutor<WaitingList> {

	Optional<WaitingList> findByUserId(UUID userId);

	boolean existsByUserId(UUID userId);

	long countByLocationIgnoreCase(String location);
}
