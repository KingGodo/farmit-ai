export type NavItem = {
  href: string;
  label: string;
  icon:
    | "overview"
    | "waiting-list"
    | "users"
    | "farmers"
    | "agronomists"
    | "businesses"
    | "farms"
    | "crops"
    | "diagnoses"
    | "heat-maps"
    | "reports"
    | "inputs"
    | "learning"
    | "whatsapp"
    | "notifications"
    | "audit"
    | "settings";
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const primaryNav: NavItem[] = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/waiting-list", label: "Waiting list", icon: "waiting-list" },
];

export const navGroups: NavGroup[] = [
  {
    label: "People",
    items: [
      { href: "/users", label: "Users", icon: "users" },
      { href: "/farmers", label: "Farmers", icon: "farmers" },
      { href: "/agronomists", label: "Agronomists", icon: "agronomists" },
      { href: "/agro-businesses", label: "Agro businesses", icon: "businesses" },
    ],
  },
  {
    label: "Land",
    items: [
      { href: "/farms", label: "Farms", icon: "farms" },
      { href: "/crops", label: "Crops", icon: "crops" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/diagnoses", label: "Diagnoses", icon: "diagnoses" },
      { href: "/heat-maps", label: "Heat maps", icon: "heat-maps" },
      { href: "/intelligence", label: "Reports", icon: "reports" },
      { href: "/inputs", label: "Inputs", icon: "inputs" },
      { href: "/learning", label: "Learning", icon: "learning" },
    ],
  },
];

export const utilityNav: NavItem[] = [
  { href: "/whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { href: "/notifications", label: "Notifications", icon: "notifications" },
  { href: "/audit", label: "Audit", icon: "audit" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export const pageMeta: { prefix: string; title: string; kicker: string }[] = [
  { prefix: "/", title: "Overview", kicker: "Operations" },
  { prefix: "/waiting-list", title: "Waiting list", kicker: "Operations" },
  { prefix: "/users", title: "Users", kicker: "People" },
  { prefix: "/farmers", title: "Farmers", kicker: "People" },
  { prefix: "/agronomists", title: "Agronomists", kicker: "People" },
  { prefix: "/agro-businesses", title: "Agro businesses", kicker: "People" },
  { prefix: "/farms", title: "Farms", kicker: "Land" },
  { prefix: "/crops", title: "Crops", kicker: "Land" },
  { prefix: "/diagnoses", title: "Diagnoses", kicker: "Intelligence" },
  { prefix: "/heat-maps", title: "Heat maps", kicker: "Intelligence" },
  { prefix: "/intelligence", title: "Reports", kicker: "Intelligence" },
  { prefix: "/inputs", title: "Inputs", kicker: "Intelligence" },
  { prefix: "/learning", title: "Learning", kicker: "Intelligence" },
  { prefix: "/whatsapp", title: "WhatsApp", kicker: "Platform" },
  { prefix: "/notifications", title: "Notifications", kicker: "Platform" },
  { prefix: "/audit", title: "Audit", kicker: "Platform" },
  { prefix: "/settings", title: "Settings", kicker: "Platform" },
];

export function resolvePage(pathname: string) {
  const ranked = [...pageMeta].sort((a, b) => b.prefix.length - a.prefix.length);
  return (
    ranked.find((page) =>
      page.prefix === "/"
        ? pathname === "/"
        : pathname === page.prefix || pathname.startsWith(`${page.prefix}/`)
    ) ?? { title: "FarmIT", kicker: "Operations" }
  );
}

export function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
