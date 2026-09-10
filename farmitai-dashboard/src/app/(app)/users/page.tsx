"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LiveDirectory } from "@/components/live-directory";
import { formatDateTime, statusVariant } from "@/lib/format";
import type { AdminUser } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function UsersPage() {
  return (
    <LiveDirectory<AdminUser>
      path="users"
      countNoun="users"
      filterKey="role"
      searchPlaceholder="Phone or email"
      action={
        <Link href="/users/new" className={cn(buttonVariants(), "h-8 px-3 text-[13px]")}>
          Create account
        </Link>
      }
      filters={[
        { id: "", label: "All" },
        { id: "ADMIN", label: "Admin" },
        { id: "FARMER", label: "Farmers" },
        { id: "AGRONOMIST", label: "Agronomists" },
        { id: "AGRO_BUSINESS", label: "Agro business" },
      ]}
      columns={[
        {
          header: "Name",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.email || "No email"}
              </span>
            </>
          ),
        },
        {
          header: "Role",
          cell: (row) => (
            <span className="text-[13px]">{row.roles.join(", ").replaceAll("_", " ") || "—"}</span>
          ),
        },
        {
          header: "Phone",
          cell: (row) => <span className="font-mono text-[12px] tabular-nums">{row.phone}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Last login",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.lastLoginAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
