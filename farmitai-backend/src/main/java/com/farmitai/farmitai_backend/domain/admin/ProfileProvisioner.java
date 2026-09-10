package com.farmitai.farmitai_backend.domain.admin;

import com.farmitai.farmitai_backend.common.util.PersonNames;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfile;
import com.farmitai.farmitai_backend.domain.agronomist.AgronomistProfileRepository;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfile;
import com.farmitai.farmitai_backend.domain.farmer.FarmerProfileRepository;
import com.farmitai.farmitai_backend.domain.waitinglist.ApplicantType;
import com.farmitai.farmitai_backend.domain.waitinglist.WaitingList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileProvisioner {

	private final FarmerProfileRepository farmerProfileRepository;
	private final AgronomistProfileRepository agronomistProfileRepository;

	public ProfileProvisioner(
			FarmerProfileRepository farmerProfileRepository,
			AgronomistProfileRepository agronomistProfileRepository) {
		this.farmerProfileRepository = farmerProfileRepository;
		this.agronomistProfileRepository = agronomistProfileRepository;
	}

	@Transactional
	public void provisionFromWaitlist(WaitingList entry) {
		String[] names = PersonNames.split(entry.getName());
		if (entry.getApplicantType() == ApplicantType.AGRONOMIST) {
			agronomistProfileRepository.findByUser_Id(entry.getUser().getId()).ifPresentOrElse(
					profile -> profile.updateFromWaitlist(names[0], names[1], entry.getLocation()),
					() -> agronomistProfileRepository.save(
							AgronomistProfile.create(entry.getUser(), names[0], names[1], entry.getLocation())));
			return;
		}
		farmerProfileRepository.findByUser_Id(entry.getUser().getId()).ifPresentOrElse(
				profile -> profile.updateFromWaitlist(names[0], names[1], entry.getLocation(), entry.getFarmingType()),
				() -> farmerProfileRepository.save(FarmerProfile.create(
						entry.getUser(), names[0], names[1], entry.getLocation(), entry.getFarmingType())));
	}
}
