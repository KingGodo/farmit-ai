"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("admin@farmit.co.zw");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error?.message ?? "Could not send reset instructions.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not reach FarmIT. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-foreground">
          <Check className="size-5" strokeWidth={2.25} />
        </div>
        <h3 className="mt-5 text-base font-semibold tracking-[-0.02em]">Check your email</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          If <span className="font-medium text-foreground">{email}</span> has an admin
          account, we sent a reset link. It expires in 30 minutes.
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
          Locally, the link is printed in the FarmIT API terminal.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-11 items-center gap-2 text-[13px] font-medium text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@farmit.co.zw"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 bg-card"
        />
      </div>
      {error && <p className="text-[13px] text-destructive">{error}</p>}
      <Button type="submit" className="h-11 w-full text-sm" disabled={submitting}>
        {submitting ? "Sending…" : "Send reset link"}
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
