package com.farmitai.farmitai_backend.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

public final class Pages {

	private Pages() {
	}

	public static PageRequest newest(int page, int size, String property) {
		int bounded = Math.min(Math.max(size, 1), 100);
		return PageRequest.of(Math.max(page, 0), bounded, Sort.by(Sort.Direction.DESC, property));
	}

	public static PageRequest named(int page, int size, String property) {
		int bounded = Math.min(Math.max(size, 1), 100);
		return PageRequest.of(Math.max(page, 0), bounded, Sort.by(Sort.Direction.ASC, property));
	}
}
