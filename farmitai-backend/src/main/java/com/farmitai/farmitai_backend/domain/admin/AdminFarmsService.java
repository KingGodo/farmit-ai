package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.farmer.Farm;
import com.farmitai.farmitai_backend.domain.farmer.FarmField;
import com.farmitai.farmitai_backend.domain.farmer.FarmFieldRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfile;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfileRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminFarmsService {

	private final FarmRepository farmRepository;
	private final FarmerProfileRepository farmerProfileRepository;
	private final FarmFieldRepository farmFieldRepository;

	public AdminFarmsService(
			FarmRepository farmRepository,
			FarmerProfileRepository farmerProfileRepository,
			FarmFieldRepository farmFieldRepository) {
		this.farmRepository = farmRepository;
		this.farmerProfileRepository = farmerProfileRepository;
		this.farmFieldRepository = farmFieldRepository;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.FarmItem> list(FarmStatus status, String q, int page, int size) {
		Page<Farm> result = farmRepository.findAll(filters(status, q), Pages.newest(page, size, "createdAt"));
		return PaginatedData.from(result.map(farm -> AdminFarmersService.toFarmItem(
				farm, AdminFarmersService.display(farm.getFarmer()))));
	}

	@Transactional(readOnly = true)
	public AdminDtos.FarmDetail get(UUID id) {
		Farm farm = farmRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		List<AdminDtos.FieldItem> fields = farmFieldRepository.findByFarm_IdOrderByCreatedAtAsc(id).stream()
				.map(AdminFarmsService::toField)
				.toList();
		return toDetail(farm, fields);
	}

	@Transactional
	public AdminDtos.FarmItem create(AdminDtos.CreateFarmRequest request) {
		FarmerProfile farmer = farmerProfileRepository
				.findById(request.farmerId())
				.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND, "Farmer was not found."));
		Farm farm = farmRepository.save(Farm.create(
				farmer,
				request.name(),
				request.description(),
				request.latitude(),
				request.longitude(),
				request.hectares(),
				request.district(),
				request.district(),
				request.province()));
		return AdminFarmersService.toFarmItem(farm, AdminFarmersService.display(farmer));
	}

	@Transactional
	public AdminDtos.FarmItem patch(UUID id, AdminDtos.PatchFarmRequest request) {
		Farm farm = farmRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		farm.update(
				request.name(),
				request.description(),
				request.latitude(),
				request.longitude(),
				request.hectares(),
				request.district(),
				request.district(),
				request.province(),
				request.status());
		return AdminFarmersService.toFarmItem(farm, AdminFarmersService.display(farm.getFarmer()));
	}

	@Transactional
	public AdminDtos.FieldItem addField(UUID farmId, AdminDtos.CreateFieldRequest request) {
		Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		FarmField field = farmFieldRepository.save(FarmField.create(
				farm,
				request.name(),
				request.hectares(),
				request.latitude(),
				request.longitude(),
				request.soilType()));
		return toField(field);
	}

	private static Specification<Farm> filters(FarmStatus status, String q) {
		return (root, query, cb) -> {
			if (query.getResultType() != Long.class && query.getResultType() != long.class) {
				root.fetch("farmer");
			}
			query.distinct(true);
			List<Predicate> predicates = new ArrayList<>();
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				var farmer = root.join("farmer");
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("name")), like),
						cb.like(cb.lower(cb.coalesce(root.get("district"), "")), like),
						cb.like(cb.lower(farmer.get("firstName")), like),
						cb.like(cb.lower(farmer.get("lastName")), like)));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static AdminDtos.FarmDetail toDetail(Farm farm, List<AdminDtos.FieldItem> fields) {
		FarmerProfile farmer = farm.getFarmer();
		return new AdminDtos.FarmDetail(
				farm.getId(),
				farmer.getId(),
				AdminFarmersService.display(farmer),
				farm.getName(),
				farm.getDescription(),
				farm.getDistrict(),
				farm.getProvince(),
				farm.getAreaHectares(),
				farm.getLatitude(),
				farm.getLongitude(),
				farm.getStatus().name(),
				farm.getCreatedAt(),
				fields);
	}

	private static AdminDtos.FieldItem toField(FarmField field) {
		return new AdminDtos.FieldItem(
				field.getId(),
				field.getName(),
				field.getAreaHectares(),
				field.getSoilType(),
				field.getLatitude(),
				field.getLongitude());
	}
}
