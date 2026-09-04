"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyNotices, type DummyNotice } from "@/lib/dummy";
import { formatDateTime, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "DELIVERED", label: "Delivered", match: (row: DummyNotice) => row.status === "DELIVERED" },
  { id: "QUEUED", label: "Queued", match: (row: DummyNotice) => row.status === "QUEUED" },
  { id: "DRAFT", label: "Draft", match: (row: DummyNotice) => row.status === "DRAFT" },
];

function search(row: DummyNotice) {
  return [row.title, row.audience, row.channel];
}

export default function NotificationsPage() {
  return (
    <SampleDirectory
      data={dummyNotices}
      search={search}
      filters={filters}
      countNoun="notices"
      columns={[
        { header: "Notice", cell: (row) => <span className="text-[13px]">{row.title}</span> },
        { header: "Audience", cell: (row) => <span className="text-[13px] text-muted-foreground">{row.audience}</span> },
        { header: "Channel", cell: (row) => <span className="text-[13px]">{row.channel}</span> },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Sent",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.sentAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
