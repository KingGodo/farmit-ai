package com.farmitai.farmitai_backend.common.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PaginatedData<T>(List<T> items, int page, int size, long totalItems, int totalPages) {

	public static <T> PaginatedData<T> from(Page<T> page) {
		return new PaginatedData<>(
				page.getContent(),
				page.getNumber(),
				page.getSize(),
				page.getTotalElements(),
				page.getTotalPages());
	}
}
