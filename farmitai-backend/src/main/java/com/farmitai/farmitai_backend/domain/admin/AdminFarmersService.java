package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.farmer.Farm;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfile;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfileRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmRepository;
import com.farmitai.farmitai_backend.domain.user.AccountFactory;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminFarmersService {

	private final FarmerProfileRepository farmerProfileRepository;
	private final FarmRepository farmRepository;
	private final AccountFactory accountFactory;

	public AdminFarmersService(
			FarmerProfileRepository farmerProfileRepository,
			FarmRepository farmRepository,
			AccountFactory accountFactory) {
		this.farmerProfileRepository = farmerProfileRepository;
		this.farmRepository = farmRepository;
		this.accountFactory = accountFactory;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.FarmerItem> list(UserStatus status, String q, int page, int size) {
		Page<FarmerProfile> result = farmerProfileRepository.findAll(filters(status, q), Pages.newest(page, size, "createdAt"));
		List<UUID> ids = result.getContent().stream().map(FarmerProfile::getId).toList();
		Map<UUID, Long> farmCounts = farmRepository.findAllByFarmer_IdIn(ids).stream()
				.collect(Collectors.groupingBy(farm -> farm.getFarmer().getId(), Collectors.counting()));
		return PaginatedData.from(result.map(profile -> toItem(profile, farmCounts.getOrDefault(profile.getId(), 0L))));
	}

	@Transactional(readOnly = true)
	public AdminDtos.FarmerDetail get(UUID id) {
		FarmerProfile profile = farmerProfileRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		List<AdminDtos.FarmItem> farms = farmRepository.findByFarmer_IdOrderByCreatedAtDesc(id).stream()
				.map(farm -> toFarmItem(farm, display(profile)))
				.toList();
		return toDetail(profile, farms);
	}

	@Transactional
	public AdminDtos.FarmerItem create(AdminDtos.CreateFarmerRequest request) {
		UserStatus status = request.status() == null ? UserStatus.ACTIVE : request.status();
		User user = accountFactory.create(request.phone(), request.email(), RoleName.FARMER, status);
		String[] names = PersonNames.split(request.name());
		FarmerProfile profile = farmerProfileRepository.save(
				FarmerProfile.create(user, names[0], names[1], request.district(), request.farmingType()));
		profile.update(null, null, request.district(), request.district(), request.province(), request.farmingType());
		return toItem(profile, 0);
	}

	@Transactional
	public AdminDtos.FarmerItem patch(UUID id, AdminDtos.PatchFarmerRequest request) {
		FarmerProfile profile = farmerProfileRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		profile.update(
				request.firstName(),
				request.lastName(),
				request.district(),
				request.district(),
				request.province(),
				request.farmingType());
		if (request.email() != null) {
			profile.getUser().setEmail(request.email());
		}
		if (request.status() != null) {
			profile.getUser().setStatus(request.status());
		}
		return toItem(profile, farmRepository.countByFarmer_Id(id));
	}

	private static Specification<FarmerProfile> filters(UserStatus status, String q) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			var user = root.join("user");
			if (status != null) {
				predicates.add(cb.equal(user.get("status"), status));
			}
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("firstName")), like),
						cb.like(cb.lower(root.get("lastName")), like),
						cb.like(cb.lower(cb.coalesce(root.get("district"), "")), like),
						cb.like(user.get("phone"), "%" + q + "%")));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static AdminDtos.FarmerItem toItem(FarmerProfile profile, long farms) {
		User user = profile.getUser();
		return new AdminDtos.FarmerItem(
				profile.getId(),
				user.getId(),
				display(profile),
				user.getPhone(),
				user.getEmail(),
				profile.getDistrict(),
				profile.getProvince(),
				profile.getFarmingType(),
				user.getStatus().name(),
				farms,
				profile.getCreatedAt());
	}

	private static AdminDtos.FarmerDetail toDetail(FarmerProfile profile, List<AdminDtos.FarmItem> farms) {
		User user = profile.getUser();
		return new AdminDtos.FarmerDetail(
				profile.getId(),
				user.getId(),
				display(profile),
				profile.getFirstName(),
				profile.getLastName(),
				user.getPhone(),
				user.getEmail(),
				profile.getLocation(),
				profile.getDistrict(),
				profile.getProvince(),
				profile.getFarmingType(),
				user.getStatus().name(),
				profile.getCreatedAt(),
				farms);
	}

	static AdminDtos.FarmItem toFarmItem(Farm farm, String farmerName) {
		return new AdminDtos.FarmItem(
				farm.getId(),
				farm.getFarmer().getId(),
				farmerName,
				farm.getName(),
				farm.getDistrict(),
				farm.getAreaHectares(),
				farm.getStatus().name(),
				farm.getCreatedAt());
	}

	static String display(FarmerProfile profile) {
		return PersonNames.display(profile.getFirstName(), profile.getLastName());
	}
}
