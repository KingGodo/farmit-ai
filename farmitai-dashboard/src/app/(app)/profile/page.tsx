"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PasswordField } from "@/components/password-field";
import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { changePassword, fetchMe, patchMe } from "@/lib/client-api";
import { statusVariant } from "@/lib/format";
import { toE164 } from "@/lib/phone";
import { queryKeys } from "@/lib/query-keys";
import { displayNameFromEmail } from "@/lib/user";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: queryKeys.me, queryFn: fetchMe });

  const [email, setEmail] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const emailValue = email ?? me.data?.email ?? "";
  const phoneValue = phone ?? me.data?.phone ?? "";

  const saveProfile = useMutation({
    mutationFn: () => {
      const e164 = toE164(phoneValue);
      if (!emailValue.trim()) {
        throw new Error("Enter an email address.");
      }
      if (!e164) {
        throw new Error("Enter a Zimbabwe phone number, for example 077 123 4567.");
      }
      return patchMe({ email: emailValue.trim(), phone: e164 });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user);
      setProfileError(null);
      setProfileSaved(true);
    },
    onError: (error: Error) => {
      setProfileSaved(false);
      setProfileError(error.message);
    },
  });

  const savePassword = useMutation({
    mutationFn: () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setPasswordError(null);
      setPasswordSaved(true);
    },
    onError: (error: Error) => {
      setPasswordSaved(false);
      setPasswordError(error.message);
    },
  });

  const onSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaved(false);
    setProfileError(null);
    saveProfile.mutate();
  };

  const onSavePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordSaved(false);
    setPasswordError(null);
    if (newPassword.length < 8) {
      setPasswordError("Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    savePassword.mutate();
  };

  const name = displayNameFromEmail(me.data?.email);
  const roles = (me.data?.roles ?? []).map((role) => role.replaceAll("_", " ")).join(", ") || "—";

  return (
    <PageFrame className="max-w-lg">
      {me.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : me.error ? (
        <p className="text-sm text-destructive">{(me.error as Error).message}</p>
      ) : (
        <>
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-faint">Account</p>
                <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{name}</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">{roles}</p>
              </div>
              {me.data?.status ? (
                <Badge variant={statusVariant(me.data.status)}>{me.data.status.toLowerCase()}</Badge>
              ) : null}
            </div>
            <form onSubmit={onSaveProfile} className="mt-6 space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={emailValue}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setProfileSaved(false);
                  }}
                  className="h-11 bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phoneValue}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setProfileSaved(false);
                  }}
                  className="h-11 bg-card"
                />
              </div>
              {profileError && <p className="text-[13px] text-destructive">{profileError}</p>}
              {profileSaved && !profileError && (
                <p className="text-[13px] text-forest">Profile saved.</p>
              )}
              <Button type="submit" className="h-11 px-4 text-sm" disabled={saveProfile.isPending}>
                {saveProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <p className="text-[12px] text-faint">Security</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">Change password</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Use at least 8 characters. You will stay signed in after it updates.
            </p>
            <form onSubmit={onSavePassword} className="mt-6 space-y-5" noValidate>
              <PasswordField
                id="current-password"
                label="Current password"
                value={currentPassword}
                autoComplete="current-password"
                onChange={(value) => {
                  setCurrentPassword(value);
                  setPasswordSaved(false);
                }}
              />
              <PasswordField
                id="new-password"
                label="New password"
                value={newPassword}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                onChange={(value) => {
                  setNewPassword(value);
                  setPasswordSaved(false);
                }}
              />
              <PasswordField
                id="confirm-password"
                label="Confirm new password"
                value={confirm}
                autoComplete="new-password"
                onChange={(value) => {
                  setConfirm(value);
                  setPasswordSaved(false);
                }}
              />
              {passwordError && <p className="text-[13px] text-destructive">{passwordError}</p>}
              {passwordSaved && !passwordError && (
                <p className="text-[13px] text-forest">Password updated.</p>
              )}
              <Button type="submit" className="h-11 px-4 text-sm" disabled={savePassword.isPending}>
                {savePassword.isPending ? "Updating…" : "Update password"}
              </Button>
            </form>
          </section>
        </>
      )}
    </PageFrame>
  );
}
