package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.dto.PaginatedData;
import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.Pages;
import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.admin.dto.AdminDtos;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfile;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfileRepository;
import com.farmitai.farmitai_backend.domain.user.AccountFactory;
import com.farmitai.farmitai_backend.domain.user.RoleName;
import com.farmitai.farmitai_backend.domain.user.User;
import com.farmitai.farmitai_backend.domain.user.UserStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAgronomistsService {

	private final AgronomistProfileRepository agronomistProfileRepository;
	private final AccountFactory accountFactory;

	public AdminAgronomistsService(
			AgronomistProfileRepository agronomistProfileRepository, AccountFactory accountFactory) {
		this.agronomistProfileRepository = agronomistProfileRepository;
		this.accountFactory = accountFactory;
	}

	@Transactional(readOnly = true)
	public PaginatedData<AdminDtos.AgronomistItem> list(UserStatus status, String q, int page, int size) {
		Page<AgronomistProfile> result =
				agronomistProfileRepository.findAll(filters(status, q), Pages.newest(page, size, "createdAt"));
		return PaginatedData.from(result.map(AdminAgronomistsService::toItem));
	}

	@Transactional(readOnly = true)
	public AdminDtos.AgronomistItem get(UUID id) {
		return toItem(agronomistProfileRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND)));
	}

	@Transactional
	public AdminDtos.AgronomistItem create(AdminDtos.CreateAgronomistRequest request) {
		UserStatus status = request.status() == null ? UserStatus.ACTIVE : request.status();
		User user = accountFactory.create(request.phone(), request.email(), RoleName.AGRONOMIST, status);
		String[] names = PersonNames.split(request.name());
		AgronomistProfile profile =
				AgronomistProfile.create(user, names[0], names[1], request.district());
		profile.update(null, null, request.district(), request.specialty());
		return toItem(agronomistProfileRepository.save(profile));
	}

	@Transactional
	public AdminDtos.AgronomistItem patch(UUID id, AdminDtos.PatchAgronomistRequest request) {
		AgronomistProfile profile =
				agronomistProfileRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		profile.update(request.firstName(), request.lastName(), request.district(), request.specialty());
		if (request.email() != null) {
			profile.getUser().setEmail(request.email());
		}
		if (request.status() != null) {
			profile.getUser().setStatus(request.status());
		}
		return toItem(profile);
	}

	private static Specification<AgronomistProfile> filters(UserStatus status, String q) {
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

	private static AdminDtos.AgronomistItem toItem(AgronomistProfile profile) {
		User user = profile.getUser();
		return new AdminDtos.AgronomistItem(
				profile.getId(),
				user.getId(),
				PersonNames.display(profile.getFirstName(), profile.getLastName()),
				user.getPhone(),
				user.getEmail(),
				profile.getDistrict(),
				profile.getSpecialty(),
				user.getStatus().name(),
				profile.getCreatedAt());
	}
}
