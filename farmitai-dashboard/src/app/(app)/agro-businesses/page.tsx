"use client";

import { Badge } from "@/components/ui/badge";
import { LiveDirectory } from "@/components/live-directory";
import { statusVariant } from "@/lib/format";
import type { AdminAgroBusiness } from "@/lib/types";

export default function AgroBusinessesPage() {
  return (
    <LiveDirectory<AdminAgroBusiness>
      path="agro-businesses"
      countNoun="businesses"
      href={(row) => `/agro-businesses/${row.id}`}
      searchPlaceholder="Name or phone"
      filters={[
        { id: "", label: "All" },
        { id: "ACTIVE", label: "Active" },
        { id: "PENDING", label: "Pending" },
        { id: "SUSPENDED", label: "Suspended" },
      ]}
      columns={[
        {
          header: "Business",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.email || row.phone || "—"}
              </span>
            </>
          ),
        },
        {
          header: "Locations",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.locations}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
