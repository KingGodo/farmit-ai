/** Public site config — set NEXT_PUBLIC_WHATSAPP_NUMBER to your business number (digits only, country code, e.g. 2637XXXXXXXX). */
const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";

const defaultMessage = encodeURIComponent(
  "Hello FarmIT AI — I would like farming advice."
);

export const site = {
  name: "FarmIT AI",
  tagline: "AI farming assistant for Zimbabwe",
  description:
    "FarmIT AI helps Zimbabwean farmers diagnose crop diseases and get practical treatment advice on WhatsApp.",
  waitlistPath: "/waitlist",
  privacyPath: "/privacy",
  termsPath: "/terms",
  email: "hello@farmit.co.zw",
  whatsappNumber,
  whatsappUrl: whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${defaultMessage}`
    : "/waitlist",
  hasWhatsApp: Boolean(whatsappNumber),
  socials: [
    { name: "Facebook", href: "https://www.facebook.com/farmitai" },
    { name: "Instagram", href: "https://www.instagram.com/farmitai" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/farmitai" },
    { name: "X", href: "https://x.com/farmitai" },
  ],
} as const;
