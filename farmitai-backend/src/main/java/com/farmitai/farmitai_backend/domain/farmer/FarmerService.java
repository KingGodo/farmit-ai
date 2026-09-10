package com.farmitai.farmitai_backend.domain.farmer;

import com.farmitai.farmitai_backend.common.exception.ApiException;
import com.farmitai.farmitai_backend.common.exception.ErrorCode;
import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.farmer.dto.FarmerDtos;
import com.farmitai.farmitai_backend.domain.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FarmerService {

	private final FarmerProfileRepository farmerProfileRepository;
	private final FarmRepository farmRepository;
	private final FarmFieldRepository farmFieldRepository;

	public FarmerService(
			FarmerProfileRepository farmerProfileRepository,
			FarmRepository farmRepository,
			FarmFieldRepository farmFieldRepository) {
		this.farmerProfileRepository = farmerProfileRepository;
		this.farmRepository = farmRepository;
		this.farmFieldRepository = farmFieldRepository;
	}

	@Transactional(readOnly = true)
	public FarmerDtos.MeResponse me(UUID userId) {
		return toMe(requireProfile(userId));
	}

	@Transactional
	public FarmerDtos.MeResponse patchMe(UUID userId, FarmerDtos.PatchMeRequest request) {
		FarmerProfile profile = requireProfile(userId);
		profile.update(
				request.firstName(),
				request.lastName(),
				request.district(),
				request.district(),
				request.province(),
				request.farmingType());
		return toMe(profile);
	}

	@Transactional(readOnly = true)
	public List<FarmerDtos.FarmResponse> myFarms(UUID userId) {
		FarmerProfile profile = requireProfile(userId);
		return farmRepository.findByFarmer_IdOrderByCreatedAtDesc(profile.getId()).stream()
				.map(this::toFarm)
				.toList();
	}

	@Transactional(readOnly = true)
	public FarmerDtos.FarmResponse farm(UUID userId, UUID farmId) {
		return toFarm(ownedFarm(userId, farmId));
	}

	@Transactional
	public FarmerDtos.FarmResponse createFarm(UUID userId, FarmerDtos.CreateFarmRequest request) {
		FarmerProfile profile = requireProfile(userId);
		Farm farm = farmRepository.save(Farm.create(
				profile,
				request.name(),
				request.description(),
				request.latitude(),
				request.longitude(),
				request.hectares(),
				request.district(),
				request.district(),
				request.province()));
		return toFarm(farm);
	}

	@Transactional
	public FarmerDtos.FarmResponse patchFarm(UUID userId, UUID farmId, FarmerDtos.PatchFarmRequest request) {
		Farm farm = ownedFarm(userId, farmId);
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
		return toFarm(farm);
	}

	@Transactional
	public FarmerDtos.FieldResponse addField(UUID userId, UUID farmId, FarmerDtos.CreateFieldRequest request) {
		Farm farm = ownedFarm(userId, farmId);
		FarmField field = farmFieldRepository.save(FarmField.create(
				farm, request.name(), request.hectares(), request.latitude(), request.longitude(), request.soilType()));
		return toField(field);
	}

	private FarmerProfile requireProfile(UUID userId) {
		return farmerProfileRepository
				.findByUser_Id(userId)
				.orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND, "Farmer profile was not found."));
	}

	private Farm ownedFarm(UUID userId, UUID farmId) {
		Farm farm = farmRepository.findById(farmId).orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));
		if (!farm.getFarmer().getUser().getId().equals(userId)) {
			throw new ApiException(ErrorCode.FORBIDDEN);
		}
		return farm;
	}

	private FarmerDtos.MeResponse toMe(FarmerProfile profile) {
		User user = profile.getUser();
		return new FarmerDtos.MeResponse(
				profile.getId(),
				user.getId(),
				PersonNames.display(profile.getFirstName(), profile.getLastName()),
				profile.getFirstName(),
				profile.getLastName(),
				user.getPhone(),
				user.getEmail(),
				profile.getDistrict(),
				profile.getProvince(),
				profile.getFarmingType(),
				user.getStatus().name());
	}

	private FarmerDtos.FarmResponse toFarm(Farm farm) {
		List<FarmerDtos.FieldResponse> fields = farmFieldRepository
				.findByFarm_IdOrderByCreatedAtAsc(farm.getId())
				.stream()
				.map(FarmerService::toField)
				.toList();
		return new FarmerDtos.FarmResponse(
				farm.getId(),
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

	private static FarmerDtos.FieldResponse toField(FarmField field) {
		return new FarmerDtos.FieldResponse(
				field.getId(),
				field.getName(),
				field.getAreaHectares(),
				field.getSoilType(),
				field.getLatitude(),
				field.getLongitude());
	}
}
