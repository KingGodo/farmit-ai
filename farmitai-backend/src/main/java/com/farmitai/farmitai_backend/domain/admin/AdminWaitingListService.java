package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminWaitingListItem;
import com.farmitai.farmitai_backend.domain.admin.dto.BulkApproveResponse;
import com.farmitai.farmitai_backend.domain.admin.dto.ReviewWaitingListRequest;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingList;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListRepository;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListStatus;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminWaitingListService {

	private final WaitingListRepository waitingListRepository;
	private final UserRepository userRepository;

	public AdminWaitingListService(WaitingListRepository waitingListRepository, UserRepository userRepository) {
		this.waitingListRepository = waitingListRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminWaitingListItem> list(
			WaitingListStatus status,
			ApplicantType applicantType,
			String q,
			int page,
			int size) {
		int bounded = Math.min(Math.max(size, 1), 100);
		Page<WaitingList> result = waitingListRepository.findAll(
				filters(status, applicantType, q),
				PageRequest.of(Math.max(page, 0), bounded, Sort.by(Sort.Direction.DESC, "createdAt")));
		return PaginatedData.from(result.map(AdminWaitingListService::toItem));
	}

	@Transactional(readOnly = true)
	public AdminWaitingListItem get(UUID id) {
		return toItem(waitingListRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND)));
	}

	@Transactional
	public AdminWaitingListItem review(UUID id, ReviewWaitingListRequest request, UserPrincipal principal) {
		if (request.status() != WaitingListStatus.APPROVED && request.status() != WaitingListStatus.REJECTED) {
			throw new ApiException(ErrorCode.VALIDATION_ERROR, "status must be APPROVED or REJECTED");
		}
		WaitingList entry = waitingListRepository.findById(id)
				.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		User reviewer = userRepository.findById(principal.getId())
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		applyReview(entry, request.status(), request.notes(), reviewer);
		return toItem(entry);
	}

	@Transactional
	public BulkApproveResponse bulkApprove(List<UUID> ids, UserPrincipal principal) {
		User reviewer = userRepository.findById(principal.getId())
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		List<WaitingList> targets;
		if (ids == null || ids.isEmpty()) {
			targets = waitingListRepository.findAll(filters(WaitingListStatus.PENDING, null, null));
		} else {
			targets = waitingListRepository.findAllById(ids).stream()
					.filter(entry -> entry.getStatus() == WaitingListStatus.PENDING)
					.toList();
		}
		targets.forEach(entry -> applyReview(entry, WaitingListStatus.APPROVED, entry.getNotes(), reviewer));
		return new BulkApproveResponse(targets.size());
	}

	private void applyReview(WaitingList entry, WaitingListStatus status, String notes, User reviewer) {
		entry.review(status, notes, reviewer);
		if (status == WaitingListStatus.APPROVED) {
			entry.getUser().activate();
		}
	}

	private static Specification<WaitingList> filters(WaitingListStatus status, ApplicantType applicantType, String q) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			if (applicantType != null) {
				predicates.add(cb.equal(root.get("applicantType"), applicantType));
			}
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("name")), like),
						cb.like(root.get("phone"), "%" + q + "%")));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static AdminWaitingListItem toItem(WaitingList entry) {
		return new AdminWaitingListItem(
				entry.getId(),
				entry.getUser().getId(),
				entry.getName(),
				entry.getPhone(),
				entry.getEmail(),
				entry.getLocation(),
				entry.getFarmingType(),
				entry.getApplicantType().name(),
				entry.getStatus().name(),
				entry.getNotes(),
				entry.getCreatedAt(),
				entry.getReviewedAt());
	}
}
