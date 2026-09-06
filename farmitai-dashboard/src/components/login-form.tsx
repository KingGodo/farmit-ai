"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@farmit.co.zw");
  const [password, setPassword] = useState("changeme");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error?.message ?? "Could not sign in.");
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

      <PasswordField
        id="password"
        label="Password"
        value={password}
        autoComplete="current-password"
        onChange={setPassword}
        action={
          <Link
            href="/forgot-password"
            className="text-[12px] font-medium text-forest transition-colors duration-150 ease-[var(--ease-craft)] hover:text-forest-deep"
          >
            Forgot password?
          </Link>
        }
      />

      {error && <p className="text-[13px] text-destructive">{error}</p>}

      <Button type="submit" className="h-11 w-full text-sm" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
