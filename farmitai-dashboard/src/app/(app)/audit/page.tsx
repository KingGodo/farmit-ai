"use client";

import { SampleDirectory } from "@/components/sample-directory";
import { dummyAudit, type DummyAudit } from "@/lib/dummy";
import { formatDateTime } from "@/lib/format";

function search(row: DummyAudit) {
  return [row.actor, row.action, row.target];
}

export default function AuditPage() {
  return (
    <SampleDirectory
      data={dummyAudit}
      search={search}
      countNoun="events"
      columns={[
        {
          header: "When",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.at)}
            </span>
          ),
        },
        { header: "Actor", cell: (row) => <span className="text-[13px]">{row.actor}</span> },
        { header: "Action", cell: (row) => <span className="text-[13px]">{row.action}</span> },
        { header: "Target", cell: (row) => <span className="text-[13px] text-muted-foreground">{row.target}</span> },
      ]}
    />
  );
}
