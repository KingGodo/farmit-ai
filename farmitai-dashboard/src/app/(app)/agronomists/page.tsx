"use client";

import { Badge } from "@/components/ui/badge";
import { LiveDirectory } from "@/components/live-directory";
import { statusVariant } from "@/lib/format";
import type { AdminAgronomist } from "@/lib/types";

export default function AgronomistsPage() {
  return (
    <LiveDirectory<AdminAgronomist>
      path="agronomists"
      countNoun="agronomists"
      searchPlaceholder="Name or phone"
      filters={[
        { id: "", label: "All" },
        { id: "ACTIVE", label: "Active" },
        { id: "PENDING", label: "Pending" },
        { id: "SUSPENDED", label: "Suspended" },
      ]}
      columns={[
        {
          header: "Agronomist",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.specialty || "—"}
              </span>
            </>
          ),
        },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district ?? "—"}</span> },
        {
          header: "Phone",
          cell: (row) => <span className="font-mono text-[12px] tabular-nums">{row.phone}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
