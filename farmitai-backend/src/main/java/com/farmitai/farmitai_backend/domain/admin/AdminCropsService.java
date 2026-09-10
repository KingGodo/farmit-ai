package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.crop.Crop;
import com.farmitai.farmitai_backend.domain.crop.CropRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminCropsService {

	private final CropRepository cropRepository;

	public AdminCropsService(CropRepository cropRepository) {
		this.cropRepository = cropRepository;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.CropItem> list(String q, int page, int size) {
		Page<Crop> result = cropRepository.findAll(filters(q), Pages.named(page, size, "name"));
		return PaginatedData.from(result.map(AdminCropsService::toItem));
	}

	@Transactional(readOnly = true)
	public AdminDtos.CropItem get(UUID id) {
		return toItem(cropRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND)));
	}

	@Transactional
	public AdminDtos.CropItem create(AdminDtos.CreateCropRequest request) {
		if (cropRepository.existsByNameIgnoreCase(request.name())) {
			throw new ApiException(ErrorCode.CONFLICT, "A crop with that name already exists.");
		}
		return toItem(cropRepository.save(Crop.create(request.name(), request.scientificName(), request.description())));
	}

	@Transactional
	public AdminDtos.CropItem patch(UUID id, AdminDtos.PatchCropRequest request) {
		Crop crop = cropRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		if (request.name() != null
				&& cropRepository.findByNameIgnoreCase(request.name()).filter(existing -> !existing.getId().equals(id)).isPresent()) {
			throw new ApiException(ErrorCode.CONFLICT, "A crop with that name already exists.");
		}
		crop.update(request.name(), request.scientificName(), request.description());
		return toItem(crop);
	}

	private static Specification<Crop> filters(String q) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			if (q != null && !q.isBlank()) {
				String like = "%" + q.toLowerCase() + "%";
				predicates.add(cb.or(
						cb.like(cb.lower(root.get("name")), like),
						cb.like(cb.lower(cb.coalesce(root.get("scientificName"), "")), like)));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}

	private static AdminDtos.CropItem toItem(Crop crop) {
		return new AdminDtos.CropItem(
				crop.getId(), crop.getName(), crop.getScientificName(), crop.getDescription(), crop.getCreatedAt());
	}
}
