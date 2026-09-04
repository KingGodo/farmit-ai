package com.farmitai.farmitai_backend.domain.waitinglist;

import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.RoleRepository;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.JoinWaitingListRequest;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.PublicJoinWaitingListRequest;
import com.farmitai.farmitai_backend.domain.waitinglist.dto.WaitingListResponse;
import com.farmitai.farmitai_backend.infrastructure.security.UserPrincipal;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WaitingListService {

	private final WaitingListRepository waitingListRepository;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;

	public WaitingListService(
			WaitingListRepository waitingListRepository,
			UserRepository userRepository,
			RoleRepository roleRepository) {
		this.waitingListRepository = waitingListRepository;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	@Transactional
	public WaitingListResponse join(UserPrincipal principal, JoinWaitingListRequest request) {
		if (waitingListRepository.existsByUserId(principal.getId())) {
			throw new ApiException(ErrorCode.WAITING_LIST_ALREADY_JOINED);
		}
		User user = userRepository.findById(principal.getId())
				.orElseThrow(() -> new ApiException(ErrorCode.UNAUTHENTICATED));
		return saveJoin(user, request.name(), request.location(), request.farmingType(), request.email(),
				request.applicantType());
	}

	@Transactional
	public WaitingListResponse joinOpen(PublicJoinWaitingListRequest request) {
		User user = userRepository.findByPhone(request.phone()).orElse(null);
		if (user != null) {
			if (user.hasRole(RoleName.ADMIN)) {
				throw new ApiException(ErrorCode.FORBIDDEN);
			}
			if (waitingListRepository.existsByUserId(user.getId())) {
				throw new ApiException(ErrorCode.WAITING_LIST_ALREADY_JOINED);
			}
		} else {
			user = userRepository.save(User.farmer(request.phone()));
		}
		return saveJoin(user, request.name(), request.location(), request.farmingType(), request.email(),
				request.applicantType());
	}

	@Transactional(readOnly = true)
	public WaitingListResponse me(UUID userId) {
		WaitingList entry = waitingListRepository.findByUserId(userId)
				.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		return toResponse(entry);
	}

	private WaitingListResponse saveJoin(
			User user,
			String name,
			String location,
			String farmingType,
			String email,
			ApplicantType applicantType) {
		ApplicantType type = applicantType == null ? ApplicantType.FARMER : applicantType;
		RoleName roleName = type == ApplicantType.AGRONOMIST ? RoleName.AGRONOMIST : RoleName.FARMER;
		user.assignWaitlistRole(roleRepository.findByName(roleName)
				.orElseThrow(() -> new IllegalStateException(roleName + " role missing")));
		WaitingList saved = waitingListRepository.save(
				WaitingList.join(user, name, location, farmingType, email, type));
		return toResponse(saved);
	}

	WaitingListResponse toResponse(WaitingList entry) {
		String location = entry.getLocation();
		Long districtSignups = location == null || location.isBlank()
				? null
				: waitingListRepository.countByLocationIgnoreCase(location);
		return new WaitingListResponse(
				entry.getId(),
				entry.getStatus().name(),
				entry.getApplicantType().name(),
				entry.getName(),
				entry.getPhone(),
				entry.getLocation(),
				entry.getFarmingType(),
				entry.getCreatedAt(),
				districtSignups);
	}
}
