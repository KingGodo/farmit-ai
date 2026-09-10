/** Normalise Zimbabwe (and E.164) phone numbers for the FarmIt API. */
export function toE164(raw: string): string | null {
  const trimmed = raw.trim().replace(/[\s()-]/g, "");
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("263") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+263${digits.slice(1)}`;
  }
  if (digits.length === 9) {
    return `+263${digits}`;
  }
  return null;
}
