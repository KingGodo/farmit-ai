export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function statusVariant(status: string) {
  const value = status.toUpperCase();
  if (
    value === "APPROVED" ||
    value === "ACTIVE" ||
    value === "PUBLISHED" ||
    value === "DELIVERED" ||
    value === "IN_STOCK" ||
    value === "LIVE"
  ) {
    return "approved" as const;
  }
  if (
    value === "REJECTED" ||
    value === "SUSPENDED" ||
    value === "FAILED" ||
    value === "OUT_OF_STOCK" ||
    value === "DELETED"
  ) {
    return "rejected" as const;
  }
  if (value === "PENDING" || value === "QUEUED" || value === "DRAFT" || value === "LOW") {
    return "pending" as const;
  }
  return "outline" as const;
}

export function matchesQuery(fields: (string | null | undefined)[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => field?.toLowerCase().includes(needle));
}
