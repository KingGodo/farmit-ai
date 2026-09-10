import Link from "next/link";

import { CreateAccountForm } from "@/components/create-account-form";
import { PageFrame } from "@/components/page-frame";

export default function CreateUserPage() {
  return (
    <PageFrame className="max-w-lg">
      <Link href="/users" className="text-[13px] text-muted-foreground hover:text-foreground">
        ← Users
      </Link>
      <section className="rounded-lg border border-border bg-card p-5">
        <p className="text-[12px] text-faint">People</p>
        <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">Create account</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          This person can sign in to the admin dashboard.
        </p>
        <div className="mt-6">
          <CreateAccountForm variant="admin" />
        </div>
      </section>
    </PageFrame>
  );
}
