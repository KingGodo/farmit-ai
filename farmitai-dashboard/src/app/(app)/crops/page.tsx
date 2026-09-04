"use client";

import { SampleDirectory } from "@/components/sample-directory";
import { dummyCrops, type DummyCrop } from "@/lib/dummy";
import { formatNumber } from "@/lib/format";

function search(row: DummyCrop) {
  return [row.name, row.season, row.topIssue];
}

export default function CropsPage() {
  return (
    <SampleDirectory
      data={dummyCrops}
      search={search}
      countNoun="crops"
      columns={[
        { header: "Crop", cell: (row) => <span className="text-[13px] font-medium">{row.name}</span> },
        { header: "Season", cell: (row) => <span className="text-[13px] text-muted-foreground">{row.season}</span> },
        {
          header: "Farmers",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{formatNumber(row.farmers)}</span>,
        },
        {
          header: "Hectares",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{formatNumber(row.hectares)}</span>,
        },
        { header: "Top issue", cell: (row) => <span className="text-[13px]">{row.topIssue}</span> },
      ]}
    />
  );
}
