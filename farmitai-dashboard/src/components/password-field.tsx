"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  autoComplete?: string;
  placeholder?: string;
  action?: ReactNode;
  onChange: (value: string) => void;
};

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  placeholder,
  action,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex h-5 items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 bg-card pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" strokeWidth={1.75} /> : <Eye className="size-4" strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}
