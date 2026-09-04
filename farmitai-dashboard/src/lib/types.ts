export const ACCESS_COOKIE = "farmit_access";
export const REFRESH_COOKIE = "farmit_refresh";

export function getApiUrl() {
  return process.env.FARMIT_API_URL ?? "http://localhost:8080";
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
