"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyLessons, type DummyLesson } from "@/lib/dummy";
import { formatNumber, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "PUBLISHED", label: "Published", match: (row: DummyLesson) => row.status === "PUBLISHED" },
  { id: "DRAFT", label: "Draft", match: (row: DummyLesson) => row.status === "DRAFT" },
];

function search(row: DummyLesson) {
  return [row.title, row.crop];
}

export default function LearningPage() {
  return (
    <SampleDirectory
      data={dummyLessons}
      search={search}
      filters={filters}
      countNoun="lessons"
      columns={[
        { header: "Lesson", cell: (row) => <span className="text-[13px]">{row.title}</span> },
        { header: "Crop", cell: (row) => <span className="text-[13px] text-muted-foreground">{row.crop}</span> },
        {
          header: "Minutes",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.minutes}</span>,
        },
        {
          header: "Completions",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{formatNumber(row.completions)}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
