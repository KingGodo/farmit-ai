import type { ApiEnvelope, AuthUser, PaginatedWaitingList, WaitingListFilters, WaitingListItem } from "@/lib/types";

async function read<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !body?.success) {
    throw new Error(body?.error?.message ?? "Request failed.");
  }
  return body.data;
}

export async function fetchMe() {
  return read<AuthUser>(await fetch("/api/auth/me"));
}

export async function fetchWaitingList(filters: WaitingListFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.applicantType) params.set("applicantType", filters.applicantType);
  if (filters.q) params.set("q", filters.q);
  params.set("page", String(filters.page ?? 0));
  params.set("size", String(filters.size ?? 20));
  return read<PaginatedWaitingList>(await fetch(`/api/waiting-list?${params}`));
}

export async function reviewWaitingList(id: string, status: "APPROVED" | "REJECTED", notes?: string) {
  return read<WaitingListItem>(
    await fetch(`/api/waiting-list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    })
  );
}
