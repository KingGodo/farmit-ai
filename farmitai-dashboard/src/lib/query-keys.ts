import type { WaitingListFilters } from "@/lib/types";

export const queryKeys = {
  me: ["me"] as const,
  waitingList: (filters: WaitingListFilters) => ["waiting-list", filters] as const,
  waitingListCounts: ["waiting-list-counts"] as const,
};
