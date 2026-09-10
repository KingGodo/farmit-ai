package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfile;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfileRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfile;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfileRepository;
import com.farmitai.farmitai_backend.domain.user.AccountFactory;
import com.farmitai.farmitai_backend.domain.user.Role;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserRepository;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingList;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingListRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUsersService {

	private final UserRepository userRepository;
	private final WaitingListRepository waitingListRepository;
	private final FarmerProfileRepository farmerProfileRepository;
	private final AgronomistProfileRepository agronomistProfileRepository;
	private final AccountFactory accountFactory;
	private final PasswordEncoder passwordEncoder;

	public AdminUsersService(
			UserRepository userRepository,
			WaitingListRepository waitingListRepository,
			FarmerProfileRepository farmerProfileRepository,
			AgronomistProfileRepository agronomistProfileRepository,
			AccountFactory accountFactory,
			PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.waitingListRepository = waitingListRepository;
		this.farmerProfileRepository = farmerProfileRepository;
		this.agronomistProfileRepository = agronomistProfileRepository;
		this.accountFactory = accountFactory;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.UserItem> list(UserStatus status, RoleName role, String q, int page, int size) {
		Page<User> result = userRepository.findAll(filters(status, role, q), Pages.newest(page, size, "createdAt"));
		List<UUID> ids = result.getContent().stream().map(User::getId).toList();
		Map<UUID, WaitingList> waitByUser = waitingListRepository.findAllByUser_IdIn(ids).stream()
				.collect(Collectors.toMap(entry -> entry.getUser().getId(), Function.identity()));
		Map<UUID, FarmerProfile> farmers = farmerProfileRepository.findAllByUser_IdIn(ids).stream()
				.collect(Collectors.toMap(profile -> profile.getUser().getId(), Function.identity()));
		Map<UUID, AgronomistProfile> agronomists = agronomistProfileRepository.findAllByUser_IdIn(ids).stream()
				.collect(Collectors.toMap(profile -> profile.getUser().getId(), Function.identity()));
		return PaginatedData.from(result.map(user -> toItem(user, waitByUser, farmers, agronomists)));
	}

	@Transactional
	public AdminDtos.UserItem create(AdminDtos.CreateUserRequest request) {
		User user = accountFactory.createAdmin(
				request.phone(),
				request.email(),
				passwordEncoder.encode(request.password()));
		return toItem(user, Map.of(), Map.of(), Map.of());
	}

	@Transactional
	public AdminDtos.UserItem patch(UUID id, AdminDtos.PatchUserRequest request) {
		User user = userRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		user.setStatus(request.status());
		return toItem(
				user,
				waitingListRepository.findByUserId(id).map(entry -> Map.of(id, entry)).orElse(Map.of()),
				farmerProfileRepository.findByUser_Id(id).map(profile -> Map.of(id, profile)).orElse(Map.of()),
				agronomistProfileRepository.findByUser_Id(id).map(profile -> Map.of(id, profile)).orElse(Map.of()));
	}

	private static Specification<User> filters(UserStatus status, RoleName role, String q) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			if (role != null) {
				query.distinct(true);
				Join<User, Role> roles = root.join("roles");
				predicates.add(cb.equal(roles.get("name"), role));
			}
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("phone")), "%" + q + "%"),
						cb.like(cb.lower(cb.coalesce(root.get("email"), "")), like)));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static AdminDtos.UserItem toItem(
			User user,
			Map<UUID, WaitingList> waitByUser,
			Map<UUID, FarmerProfile> farmers,
			Map<UUID, AgronomistProfile> agronomists) {
		String name = displayName(user, waitByUser, farmers, agronomists);
		return new AdminDtos.UserItem(
				user.getId(),
				name,
				user.getEmail(),
				user.getPhone(),
				user.getRoles().stream().map(role -> role.getName().name()).sorted().toList(),
				user.getStatus().name(),
				user.getLastLoginAt(),
				user.getCreatedAt());
	}

	private static String displayName(
			User user,
			Map<UUID, WaitingList> waitByUser,
			Map<UUID, FarmerProfile> farmers,
			Map<UUID, AgronomistProfile> agronomists) {
		FarmerProfile farmer = farmers.get(user.getId());
		if (farmer != null) {
			return PersonNames.display(farmer.getFirstName(), farmer.getLastName());
		}
		AgronomistProfile agronomist = agronomists.get(user.getId());
		if (agronomist != null) {
			return PersonNames.display(agronomist.getFirstName(), agronomist.getLastName());
		}
		WaitingList wait = waitByUser.get(user.getId());
		if (wait != null) {
			return wait.getName();
		}
		return user.getEmail() != null ? user.getEmail() : user.getPhone();
	}
}
