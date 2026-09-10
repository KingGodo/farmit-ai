"use client";

import { Badge } from "@/components/ui/badge";
import { LiveDirectory } from "@/components/live-directory";
import { formatDate, statusVariant } from "@/lib/format";
import type { AdminFarmer } from "@/lib/types";

export default function FarmersPage() {
  return (
    <LiveDirectory<AdminFarmer>
      path="farmers"
      countNoun="farmers"
      href={(row) => `/farmers/${row.id}`}
      searchPlaceholder="Name or phone"
      filters={[
        { id: "", label: "All" },
        { id: "ACTIVE", label: "Active" },
        { id: "PENDING", label: "Pending" },
        { id: "SUSPENDED", label: "Suspended" },
      ]}
      columns={[
        {
          header: "Farmer",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.farmingType || "—"}
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
          header: "Farms",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.farms}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Joined",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDate(row.joinedAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
