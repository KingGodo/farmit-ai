"use client";

import { Badge } from "@/components/ui/badge";
import { LiveDirectory } from "@/components/live-directory";
import { statusVariant } from "@/lib/format";
import type { AdminFarmSummary } from "@/lib/types";

export default function FarmsPage() {
  return (
    <LiveDirectory<AdminFarmSummary>
      path="farms"
      countNoun="farms"
      href={(row) => `/farms/${row.id}`}
      searchPlaceholder="Farm or farmer"
      filters={[
        { id: "", label: "All" },
        { id: "ACTIVE", label: "Active" },
        { id: "INACTIVE", label: "Inactive" },
      ]}
      columns={[
        {
          header: "Farm",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.farmerName}</span>
            </>
          ),
        },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district ?? "—"}</span> },
        {
          header: "Hectares",
          cell: (row) => (
            <span className="font-mono text-[13px] tabular-nums">
              {row.hectares == null ? "—" : Number(row.hectares).toFixed(1)}
            </span>
          ),
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
