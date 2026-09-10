"use client";

import { LiveDirectory } from "@/components/live-directory";
import type { AdminCrop } from "@/lib/types";

export default function CropsPage() {
  return (
    <LiveDirectory<AdminCrop>
      path="crops"
      countNoun="crops"
      searchPlaceholder="Crop name"
      columns={[
        {
          header: "Crop",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.scientificName || "—"}
              </span>
            </>
          ),
        },
        {
          header: "Description",
          cell: (row) => <span className="text-[13px] text-muted-foreground">{row.description ?? "—"}</span>,
        },
      ]}
    />
  );
}
