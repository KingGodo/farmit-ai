export function initialsFromEmail(email: string | null | undefined) {
  if (!email) return "A";
  const local = email.split("@")[0] ?? "A";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export function displayNameFromEmail(email: string | null | undefined) {
  if (!email) return "Admin";
  const local = email.split("@")[0] ?? "Admin";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
