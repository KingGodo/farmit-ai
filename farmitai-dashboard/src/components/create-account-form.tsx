"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toE164 } from "@/lib/phone";

export function CreateAccountForm({
  variant = "public",
}: {
  variant?: "public" | "admin";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const e164 = toE164(phone);
    if (!email.trim()) {
      setError("Enter an email address.");
      return;
    }
    if (!e164) {
      setError("Enter a Zimbabwe phone number, for example 077 123 4567.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const path = variant === "admin" ? "/api/admin/users" : "/api/auth/register";
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: e164, password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error?.message ?? "Could not create the account.");
        return;
      }
      if (variant === "admin") {
        router.push("/users");
        router.refresh();
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reach FarmIt. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@farmit.co.zw"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 bg-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="077 123 4567"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-11 bg-card"
        />
      </div>
      <PasswordField
        id="password"
        label="Password"
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
        {submitting ? "Creating…" : "Create account"}
      </Button>
      {variant === "public" ? (
        <p className="text-center text-[13px] text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-forest hover:text-forest-deep">
            Sign in
          </Link>
        </p>
      ) : (
        <Link
          href="/users"
          className="inline-flex h-5 w-full items-center justify-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to users
        </Link>
      )}
    </form>
  );
}
