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
        "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
      {item.label}
    </Link>
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
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4">
        <Image src={logo} alt="FarmIT" className="size-8 rounded-md" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">FarmIT</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </div>

        {navGroups.map((group) => (
          <div key={group.label} className="mt-5">
            <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-auto border-t border-border pt-3">
          <p className="px-3 pb-1.5 text-xs font-medium text-muted-foreground">Platform</p>
          <div className="flex flex-col gap-0.5">
            {utilityNav.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
