"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyDiagnoses, type DummyDiagnosis } from "@/lib/dummy";
import { formatDateTime, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "PEST", label: "Pests", match: (row: DummyDiagnosis) => row.kind === "PEST" },
  { id: "DISEASE", label: "Disease", match: (row: DummyDiagnosis) => row.kind === "DISEASE" },
  { id: "DEFICIENCY", label: "Deficiency", match: (row: DummyDiagnosis) => row.kind === "DEFICIENCY" },
];

function search(row: DummyDiagnosis) {
  return [row.farmerName, row.farmName, row.crop, row.problem, row.district];
}

export default function DiagnosesPage() {
  return (
    <SampleDirectory
      data={dummyDiagnoses}
      search={search}
      filters={filters}
      countNoun="diagnoses"
      columns={[
        {
          header: "Problem",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.problem}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.crop} · {row.farmName}
              </span>
            </>
          ),
        },
        { header: "Kind", cell: (row) => <span className="text-[13px]">{row.kind.toLowerCase()}</span> },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district}</span> },
        {
          header: "Confidence",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums">{Math.round(row.confidence * 100)}%</span>
          ),
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Logged",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.createdAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
