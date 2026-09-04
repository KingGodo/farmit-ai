export const queryKeys = {
  me: ["me"] as const,
  waitingList: (filters: Record<string, string | number | undefined>) =>
    ["waiting-list", filters] as const,
  waitingListCounts: ["waiting-list-counts"] as const,
};
