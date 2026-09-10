package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusiness;
import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessLocation;
import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessLocationRepository;
import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessRepository;
import com.farmitai.farmitai_backend.domain.agrobusiness.AgroBusinessStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAgroBusinessesService {

	private final AgroBusinessRepository agroBusinessRepository;
	private final AgroBusinessLocationRepository locationRepository;

	public AdminAgroBusinessesService(
			AgroBusinessRepository agroBusinessRepository, AgroBusinessLocationRepository locationRepository) {
		this.agroBusinessRepository = agroBusinessRepository;
		this.locationRepository = locationRepository;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.AgroBusinessItem> list(AgroBusinessStatus status, String q, int page, int size) {
		Page<AgroBusiness> result =
				agroBusinessRepository.findAll(filters(status, q), Pages.newest(page, size, "createdAt"));
		return PaginatedData.from(result.map(this::toItem));
	}

	@Transactional(readOnly = true)
	public AdminDtos.AgroBusinessDetail get(UUID id) {
		AgroBusiness business =
				agroBusinessRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		List<AdminDtos.LocationItem> locations = locationRepository
				.findByAgroBusiness_IdOrderByCreatedAtAsc(id)
				.stream()
				.map(AdminAgroBusinessesService::toLocation)
				.toList();
		return toDetail(business, locations);
	}

	@Transactional
	public AdminDtos.AgroBusinessItem create(AdminDtos.CreateAgroBusinessRequest request) {
		AgroBusiness business = agroBusinessRepository.save(
				AgroBusiness.create(null, request.name(), request.description(), request.phone(), request.email()));
		return toItem(business);
	}

	@Transactional
	public AdminDtos.AgroBusinessItem patch(UUID id, AdminDtos.PatchAgroBusinessRequest request) {
		AgroBusiness business =
				agroBusinessRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		business.update(request.name(), request.description(), request.phone(), request.email(), request.status());
		return toItem(business);
	}

	@Transactional
	public AdminDtos.LocationItem addLocation(UUID businessId, AdminDtos.CreateLocationRequest request) {
		AgroBusiness business =
				agroBusinessRepository.findById(businessId).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		AgroBusinessLocation location = locationRepository.save(AgroBusinessLocation.create(
				business,
				request.name(),
				request.address(),
				request.latitude(),
				request.longitude(),
				request.district(),
				request.province()));
		return toLocation(location);
	}

	private static Specification<AgroBusiness> filters(AgroBusinessStatus status, String q) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (status != null) {
				predicates.add(cb.equal(root.get("status"), status));
			}
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("name")), like),
						cb.like(cb.lower(cb.coalesce(root.get("phone"), "")), like),
						cb.like(cb.lower(cb.coalesce(root.get("email"), "")), like)));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private AdminDtos.AgroBusinessItem toItem(AgroBusiness business) {
		return new AdminDtos.AgroBusinessItem(
				business.getId(),
				business.getName(),
				business.getPhone(),
				business.getEmail(),
				business.getStatus().name(),
				locationRepository.countByAgroBusiness_Id(business.getId()),
				business.getCreatedAt());
	}

	private static AdminDtos.AgroBusinessDetail toDetail(
			AgroBusiness business, List<AdminDtos.LocationItem> locations) {
		return new AdminDtos.AgroBusinessDetail(
				business.getId(),
				business.getName(),
				business.getDescription(),
				business.getPhone(),
				business.getEmail(),
				business.getStatus().name(),
				business.getCreatedAt(),
				locations);
	}

	private static AdminDtos.LocationItem toLocation(AgroBusinessLocation location) {
		return new AdminDtos.LocationItem(
				location.getId(),
				location.getName(),
				location.getAddress(),
				location.getDistrict(),
				location.getProvince(),
				location.getLatitude(),
				location.getLongitude());
	}
}
