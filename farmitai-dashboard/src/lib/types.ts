export const ACCESS_COOKIE = "farmit_access";
export const REFRESH_COOKIE = "farmit_refresh";

export function getApiUrl() {
  const fromEnv = process.env["FARMIT_API_URL"]?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  return process.env.NODE_ENV === "production" ? "http://backend:8080" : "http://localhost:8080";
}

export type ApiErrorBody = {
  code: string;
  message: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: ApiErrorBody;
};

export class FarmitApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "FarmitApiError";
  }
}

export type AuthUser = {
  id: string;
  phone: string | null;
  email: string | null;
  status: string;
  roles: string[];
};

export type TokenPayload = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: AuthUser;
};

export type WaitingListStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApplicantType = "FARMER" | "AGRONOMIST";

export type WaitingListItem = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  farmingType: string | null;
  applicantType: ApplicantType;
  status: WaitingListStatus;
  notes: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export type PaginatedWaitingList = {
  items: WaitingListItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type WaitingListFilters = {
  status?: WaitingListStatus | "";
  applicantType?: ApplicantType | "";
  q?: string;
  page?: number;
  size?: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type DirectoryFilters = {
  status?: string;
  role?: string;
  channel?: string;
  q?: string;
  page?: number;
  size?: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  roles: string[];
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export type AdminFarmer = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  district: string | null;
  province: string | null;
  farmingType: string | null;
  status: string;
  farms: number;
  joinedAt: string;
};

export type AdminFarmSummary = {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  district: string | null;
  hectares: number | null;
  status: string;
  createdAt: string;
};

export type AdminFarmerDetail = {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  location: string | null;
  district: string | null;
  province: string | null;
  farmingType: string | null;
  status: string;
  joinedAt: string;
  farms: AdminFarmSummary[];
};

export type AdminAgronomist = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  district: string | null;
  specialty: string | null;
  status: string;
  createdAt: string;
};

export type AdminFarmDetail = {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  description: string | null;
  district: string | null;
  province: string | null;
  hectares: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  createdAt: string;
  fields: {
    id: string;
    name: string;
    hectares: number | null;
    soilType: string | null;
    latitude: number | null;
    longitude: number | null;
  }[];
};

export type AdminCrop = {
  id: string;
  name: string;
  scientificName: string | null;
  description: string | null;
  createdAt: string;
};

export type AdminAgroBusiness = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  locations: number;
  createdAt: string;
};

export type AdminAgroBusinessDetail = {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  createdAt: string;
  locations: {
    id: string;
    name: string;
    address: string | null;
    district: string | null;
    province: string | null;
    latitude: number | null;
    longitude: number | null;
  }[];
};

export type AdminConversation = {
  id: string;
  userId: string;
  farmerName: string;
  phone: string;
  channel: string;
  lastMessage: string;
  lastMessageAt: string;
};
