package com.farmitai.farmitai_backend.domain.auth;

import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class OtpRateLimiter {

	private static final Duration PER_REQUEST = Duration.ofSeconds(60);
	private static final Duration PER_HOUR_WINDOW = Duration.ofHours(1);
	private static final int PER_HOUR_MAX = 5;

	private final Map<String, List<Instant>> requests = new ConcurrentHashMap<>();

	public void check(String phone) {
		Instant now = Instant.now();
		List<Instant> stamps = requests.computeIfAbsent(phone, key -> new ArrayList<>());
		synchronized (stamps) {
			stamps.removeIf(stamp -> stamp.isBefore(now.minus(PER_HOUR_WINDOW)));
			if (!stamps.isEmpty() && Duration.between(stamps.get(stamps.size() - 1), now).compareTo(PER_REQUEST) < 0) {
				throw new ApiException(ErrorCode.RATE_LIMITED);
			}
			if (stamps.size() >= PER_HOUR_MAX) {
				throw new ApiException(ErrorCode.RATE_LIMITED);
			}
			stamps.add(now);
		}
		prune(now);
	}

	private void prune(Instant now) {
		if (requests.size() < 1_000) {
			return;
		}
		Iterator<Map.Entry<String, List<Instant>>> iterator = requests.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry<String, List<Instant>> entry = iterator.next();
			List<Instant> stamps = entry.getValue();
			synchronized (stamps) {
				stamps.removeIf(stamp -> stamp.isBefore(now.minus(PER_HOUR_WINDOW)));
				if (stamps.isEmpty()) {
					iterator.remove();
				}
			}
		}
	}
}
