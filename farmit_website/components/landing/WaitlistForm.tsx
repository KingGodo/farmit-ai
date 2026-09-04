"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { APPLICANT_TYPES, CROPS, DISTRICTS, FARMING_TYPES, type ApplicantType } from "@/lib/waitlist";
import { toE164 } from "@/lib/phone";
import FieldSelect from "@/components/landing/FieldSelect";
import WaitlistSuccess from "@/components/landing/WaitlistSuccess";
import { cn } from "@/components/lib/utils";
import { site } from "@/lib/site";

const inputClass =
  "h-11 w-full rounded-lg border border-border bg-white px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-[var(--ease-craft)] placeholder:text-faint focus:border-forest/25 focus:ring-2 focus:ring-forest/10";

const groupLabel =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-faint";

type FormState = {
  applicantType: ApplicantType;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  districtOther: string;
  crop: string;
  farmingType: string;
};

const empty: FormState = {
  applicantType: "FARMER",
  fullName: "",
  phone: "",
  email: "",
  district: "",
  districtOther: "",
  crop: "",
  farmingType: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: { alreadyJoined?: boolean; districtSignups?: number };
    error?: { message?: string };
  } | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? "Could not reach FarmIT.");
  }
  return payload.data;
}

export default function WaitlistForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [districtSignups, setDistrictSignups] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const location =
    form.district === "Other" ? form.districtOther.trim() : form.district;
  const farmingType =
    form.applicantType === "FARMER" && form.farmingType
      ? `${form.farmingType} · ${form.crop}`
      : null;
  const phone = toE164(form.phone);

  const validateDetails = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name.";
    if (!toE164(form.phone)) next.phone = "Enter a valid Zimbabwe phone number.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email.";
    if (!form.district) next.district = "Choose your district.";
    if (form.district === "Other" && !form.districtOther.trim()) {
      next.districtOther = "Type your district.";
    }
    if (form.applicantType === "FARMER") {
      if (!form.crop) next.crop = "Choose your main crop.";
      if (!form.farmingType) next.farmingType = "Choose your farming type.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateDetails() || !phone) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await postJson("/api/waitlist/join", {
        phone,
        name: form.fullName.trim(),
        email: form.email.trim(),
        location,
        farmingType,
        applicantType: form.applicantType,
      });
      setAlreadyJoined(Boolean(data?.alreadyJoined));
      setDistrictSignups(
        typeof data?.districtSignups === "number" ? data.districtSignups : null
      );
      setDone(true);
    } catch (error) {
      setSubmitError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <WaitlistSuccess
        alreadyJoined={alreadyJoined}
        fullName={form.fullName.trim()}
        district={location}
        applicantType={form.applicantType}
        crop={form.applicantType === "FARMER" ? form.crop : null}
        farmingType={form.applicantType === "FARMER" ? form.farmingType : null}
        districtSignups={districtSignups}
        onAddAnother={() => {
          setAlreadyJoined(false);
          setDistrictSignups(null);
          setForm(empty);
          setDone(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="space-y-4">
        <p className={groupLabel}>You</p>
        <div className="space-y-2">
          <p className="block text-[13px] font-medium text-ink">I am a</p>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-soft p-1">
            {APPLICANT_TYPES.map((option) => {
              const selected = form.applicantType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setField("applicantType", option.id)}
                  className={cn(
                    "h-9 rounded-md text-[13px] font-medium transition-[background-color,color] duration-150 ease-[var(--ease-craft)]",
                    selected
                      ? "bg-white text-ink shadow-[0_1px_2px_rgba(16,24,16,0.08)]"
                      : "text-muted-foreground hover:text-ink"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-[13px] font-medium text-ink">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Name as it should appear on your place"
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            className={cn(inputClass, errors.fullName && "border-destructive")}
          />
          {errors.fullName && (
            <p className="text-[12px] text-destructive">{errors.fullName}</p>
          )}
        </div>

        <div className="grid gap-4 min-[520px]:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-[13px] font-medium text-ink">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+263 77 000 0000"
              value={form.phone}
              onChange={(event) => setField("phone", event.target.value)}
              className={cn(inputClass, errors.phone && "border-destructive")}
            />
            {errors.phone && (
              <p className="text-[12px] text-destructive">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[13px] font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              className={cn(inputClass, errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-[12px] text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className={groupLabel}>
          {form.applicantType === "AGRONOMIST" ? "Where you work" : "Your farm"}
        </p>
        <FieldSelect
          label="District"
          value={form.district}
          placeholder="Select district"
          options={DISTRICTS}
          searchable
          error={errors.district}
          onChange={(value) => setField("district", value)}
        />

        {form.district === "Other" && (
          <div className="space-y-2">
            <label
              htmlFor="districtOther"
              className="block text-[13px] font-medium text-ink"
            >
              District name
            </label>
            <input
              id="districtOther"
              placeholder="Type your district"
              value={form.districtOther}
              onChange={(event) => setField("districtOther", event.target.value)}
              className={cn(
                inputClass,
                errors.districtOther && "border-destructive"
              )}
            />
            {errors.districtOther && (
              <p className="text-[12px] text-destructive">{errors.districtOther}</p>
            )}
          </div>
        )}

        {form.applicantType === "FARMER" && (
          <div className="grid gap-4 min-[520px]:grid-cols-2">
            <FieldSelect
              label="Main crop"
              value={form.crop}
              placeholder="Select crop"
              options={CROPS}
              error={errors.crop}
              onChange={(value) => setField("crop", value)}
            />
            <FieldSelect
              label="Farming type"
              value={form.farmingType}
              placeholder="Select type"
              options={FARMING_TYPES}
              error={errors.farmingType}
              onChange={(value) => setField("farmingType", value)}
            />
          </div>
        )}
      </div>

      {submitError && <p className="text-[13px] text-destructive">{submitError}</p>}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime text-sm font-semibold text-ink transition-[background-color,transform] duration-150 ease-[var(--ease-craft)] hover:bg-lime-dark active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? "Joining…" : "Join the waiting list"}
        </button>
        <p className="mt-3 text-[12px] leading-relaxed text-faint">
          We’ll add you on this website for your district and reach you by
          phone or email. By joining, you agree to our{" "}
          <Link
            href={site.termsPath}
            className="text-ink/60 underline decoration-border underline-offset-2 hover:text-ink"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href={site.privacyPath}
            className="text-ink/60 underline decoration-border underline-offset-2 hover:text-ink"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
