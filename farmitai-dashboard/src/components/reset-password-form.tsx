"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing a token. Request a new one.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error?.message ?? "Could not reset password.");
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Could not reach FarmIT. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <PasswordField
        id="password"
        label="New password"
        value={password}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        onChange={setPassword}
      />
      <PasswordField
        id="confirm"
        label="Confirm password"
        value={confirm}
        autoComplete="new-password"
        onChange={setConfirm}
      />
      {error && <p className="text-[13px] text-destructive">{error}</p>}
      <Button type="submit" className="h-11 w-full text-sm" disabled={submitting}>
        {submitting ? "Saving…" : "Update password"}
      </Button>
      <Link
        href="/login"
        className="inline-flex h-5 w-full items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </form>
  );
}

export function ResetPasswordView() {
  return (
    <Suspense fallback={<Skeleton className="h-40 w-full" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
