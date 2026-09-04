package com.farmitai.farmitai_backend.domain.waitinglist;

import com.farmitai.farmitai_backend.domain.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "waiting_list")
public class WaitingList {

	@Id
	private UUID id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, length = 20)
	private String phone;

	private String email;

	private String location;

	@Column(name = "farming_type")
	private String farmingType;

	@Enumerated(EnumType.STRING)
	@Column(name = "applicant_type", nullable = false, length = 20)
	private ApplicantType applicantType;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private WaitingListStatus status;

	private String notes;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reviewed_by")
	private User reviewedBy;

	@Column(name = "reviewed_at")
	private Instant reviewedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected WaitingList() {
	}

	public static WaitingList join(
			User user,
			String name,
			String location,
			String farmingType,
			String email,
			ApplicantType applicantType) {
		WaitingList entry = new WaitingList();
		entry.id = UUID.randomUUID();
		entry.user = user;
		entry.name = name;
		entry.phone = user.getPhone();
		entry.email = (email != null && !email.isBlank()) ? email : user.getEmail();
		entry.location = location;
		entry.farmingType = farmingType;
		entry.applicantType = applicantType == null ? ApplicantType.FARMER : applicantType;
		entry.status = WaitingListStatus.PENDING;
		return entry;
	}

	@PrePersist
	void onCreate() {
		Instant now = Instant.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public void review(WaitingListStatus status, String notes, User reviewer) {
		this.status = status;
		this.notes = notes;
		this.reviewedBy = reviewer;
		this.reviewedAt = Instant.now();
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public String getName() {
		return name;
	}

	public String getPhone() {
		return phone;
	}

	public String getEmail() {
		return email;
	}

	public String getLocation() {
		return location;
	}

	public String getFarmingType() {
		return farmingType;
	}

	public ApplicantType getApplicantType() {
		return applicantType;
	}

	public WaitingListStatus getStatus() {
		return status;
	}

	public String getNotes() {
		return notes;
	}

	public User getReviewedBy() {
		return reviewedBy;
	}

	public Instant getReviewedAt() {
		return reviewedAt;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
