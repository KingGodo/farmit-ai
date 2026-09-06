"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Map,
  MapPinned,
  MessageCircle,
  ScanSearch,
  ScrollText,
  Settings,
  Sprout,
  Store,
  UserRound,
  Users,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import {
  isNavActive,
  navGroups,
  primaryNav,
  utilityNav,
  type NavItem,
} from "@/lib/nav";
import { cn } from "@/lib/utils";
import logo from "@/assets/farmit-logo.png";

const icons: Record<NavItem["icon"], LucideIcon> = {
  overview: LayoutDashboard,
  "waiting-list": ListChecks,
  users: Users,
  farmers: Sprout,
  agronomists: UserRound,
  businesses: Store,
  farms: Map,
  crops: Wheat,
  diagnoses: ScanSearch,
  "heat-maps": MapPinned,
  reports: LineChart,
  inputs: FlaskConical,
  learning: BookOpen,
  whatsapp: MessageCircle,
  notifications: Bell,
  audit: ScrollText,
  settings: Settings,
};

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = icons[item.icon];
  const active = isNavActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex h-8 items-center gap-2 rounded-md px-2 text-[12px] transition-[color,background-color] duration-150 ease-[var(--ease-craft)]",
        active
          ? "bg-soft font-medium text-ink"
          : "font-normal text-muted-foreground hover:bg-soft hover:text-ink"
      )}
    >
      <Icon
        className={cn("size-3.5 shrink-0", active ? "text-ink" : "text-faint")}
        strokeWidth={1.75}
      />
      {item.label}
    </Link>
  );
}

function NavSection({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
        {label}
      </p>
      <div className="flex flex-col gap-px">
        {items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export function Sidebar({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <Link href="/" onClick={onNavigate} className="flex h-12 shrink-0 items-center gap-2 px-3">
        <Image src={logo} alt="" className="size-6 object-contain" />
        <p className="text-[13px] font-semibold tracking-[-0.02em] text-ink">FarmIt</p>
        <span className="rounded px-1.5 py-px text-[10px] font-medium text-muted-foreground">
          Admin
        </span>
      </Link>

      <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-px">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </div>

        {navGroups.map((group) => (
          <NavSection
            key={group.label}
            label={group.label}
            items={group.items}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}

        <div className="mt-auto border-t border-border pt-3">
          <NavSection
            label="Platform"
            items={utilityNav}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        </div>
      </nav>
    </>
  );
}
