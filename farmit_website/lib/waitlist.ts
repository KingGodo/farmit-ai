export const DISTRICTS = [
  "Beitbridge",
  "Bindura",
  "Bulawayo",
  "Chegutu",
  "Chinhoyi",
  "Chipinge",
  "Chiredzi",
  "Chitungwiza",
  "Goromonzi",
  "Gokwe",
  "Gweru",
  "Harare",
  "Hwange",
  "Kadoma",
  "Kariba",
  "Kwekwe",
  "Marondera",
  "Masvingo",
  "Mazowe",
  "Mutare",
  "Mutoko",
  "Norton",
  "Nyanga",
  "Rusape",
  "Shamva",
  "Victoria Falls",
  "Other",
] as const;

export const APPLICANT_TYPES = [
  { id: "FARMER", label: "Farmer" },
  { id: "AGRONOMIST", label: "Agronomist" },
] as const;

export type ApplicantType = (typeof APPLICANT_TYPES)[number]["id"];

export const CROPS = [
  "Maize",
  "Groundnuts",
  "Beans",
  "Tomatoes",
  "Tobacco",
  "Vegetables",
  "Mixed crops",
] as const;

export const FARMING_TYPES = [
  "Smallholder",
  "Commercial",
  "Mixed",
] as const;

export type WaitlistEntry = {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  crop: string;
  farmingType: string;
  createdAt: string;
};

export type WaitlistSuccessInput = {
  fullName: string;
  district: string;
  applicantType: ApplicantType;
  crop: string | null;
  farmingType: string | null;
  alreadyJoined: boolean;
  districtSignups: number | null;
};

export function firstNameFrom(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export function waitlistPassLine(input: WaitlistSuccessInput) {
  if (input.applicantType === "AGRONOMIST") {
    return "Agronomist";
  }
  return [input.farmingType, input.crop].filter(Boolean).join(" · ") || "Farmer";
}

export function waitlistSuccessCopy(input: WaitlistSuccessInput) {
  const first = firstNameFrom(input.fullName) || (input.applicantType === "AGRONOMIST" ? "Agronomist" : "Farmer");
  const place = input.district || "your district";

  if (input.alreadyJoined) {
    return {
      kicker: "Still holding",
      title: `${first}, you’re already in ${place}`,
      body: `This phone is already on the FarmIt waiting list on this website. When ${place} opens, we still reach you on that number or email.`,
    };
  }

  if (input.applicantType === "AGRONOMIST") {
    return {
      kicker: `Standing with ${place}`,
      title: `${first}, ${place} agronomists are in`,
      body: `You’re on the agronomist list for ${place}. FarmIt opens district by district from this website. When your district is ready, we contact you — then you can stand with farmers on the ground.`,
    };
  }

  const practice = [input.farmingType, input.crop].filter(Boolean).join(" · ");
  return {
    kicker: `Seeded in ${place}`,
    title: `${first}, ${place} has a place for you`,
    body: practice
      ? `You’re down for ${practice} in ${place}. You joined on this website, not WhatsApp. When your district opens, we contact the phone and email you gave us.`
      : `You’re on the ${place} list. You joined on this website, not WhatsApp. When your district opens, we contact the phone and email you gave us.`,
  };
}

export function waitlistDistrictCount(input: WaitlistSuccessInput) {
  const place = input.district || "your district";
  if (!input.districtSignups) {
    return `Holding for ${place}`;
  }
  if (input.districtSignups <= 1) {
    return `First from ${place}`;
  }
  return `${input.districtSignups} from ${place}`;
}

