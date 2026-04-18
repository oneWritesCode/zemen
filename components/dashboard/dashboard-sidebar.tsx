"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Gauge,
  Search,
  ChevronRight,
  LayoutDashboard,
  Zap,
  History,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

import { TopicIcon } from "@/components/icons/topic-icon";
import type { TopicDefinition } from "@/lib/fred/topics-config";

export function DashboardSidebar({ topics }: { topics: TopicDefinition[] }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const linkClass = (active: boolean) =>
    [
      "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
      active
        ? "active-link sidebar-active text-white"
        : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
    ].join(" ");

  const iconWrapClass = (active: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded-lg ${
      active ? "bg-white/10" : "bg-white/[0.04] group-hover:bg-white/[0.06]"
    }`;

  const iconClass = (active: boolean) =>
    `h-3.5 w-3.5 ${active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`;

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-white/[0.05] bg-[#08080a] lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r">
      {/* Brand */}
      <div className="px-5 py-5 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.08]">
            <Gauge className="h-4 w-4 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-widest text-white">
              ZEMEN
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-600">
              Macro Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 lg:px-5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.05] bg-white/[0.03] py-2 pl-9 pr-3 text-[12px] text-zinc-300 placeholder-zinc-600 outline-none transition focus:border-white/[0.12] focus:bg-white/[0.05]"
          />
        </div>
      </div>

      <div className="separator-gold mx-5" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-x-auto px-3 py-3 lg:overflow-y-auto">
        {/* Quick links */}
        <div className="mb-1 space-y-0.5">
          <Link href="/sectors" className={linkClass(pathname === "/sectors")}>
            <div className={iconWrapClass(pathname === "/sectors")}>
              <BarChart3
                className={iconClass(pathname === "/sectors")}
                aria-hidden
              />
            </div>
            <span className="flex-1 truncate">Sectors</span>
            <ChevronRight
              className={`h-3 w-3 transition-all ${
                pathname === "/sectors"
                  ? "text-white/40"
                  : "text-transparent group-hover:text-zinc-600"
              }`}
              aria-hidden
            />
          </Link>

          <Link
            href="/briefing"
            className={linkClass(pathname === "/briefing")}
          >
            <div className={iconWrapClass(pathname === "/briefing")}>
              <Zap
                className={iconClass(pathname === "/briefing")}
                aria-hidden
              />
            </div>
            <span className="flex-1 truncate">Weekly Briefing</span>
            {pathname === "/briefing" && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
            )}
          </Link>

          <Link
            href="/regime-detector"
            className={linkClass(pathname === "/regime-detector")}
          >
            <div className={iconWrapClass(pathname === "/regime-detector")}>
              <FlaskConical
                className={iconClass(pathname === "/regime-detector")}
                aria-hidden
              />
            </div>
            <span className="flex-1 truncate">Regime Detector</span>
          </Link>

          <Link
            href="/regime-detector#historical-playbook"
            className="group flex items-center gap-2.5 rounded-xl px-3 py-1.5 pl-[52px] text-[11px] text-zinc-600 transition hover:text-zinc-300"
          >
            <History className="h-3 w-3" aria-hidden />
            Historical Playbook
          </Link>
        </div>

        <div className="separator-gold mx-2 my-2" />

        {/* Categories header */}
        <div className="mb-1 flex items-center justify-between px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
            Indicators
          </p>
          <span className="flex h-4 min-w-[18px] items-center justify-center rounded-md bg-white/[0.05] px-1.5 text-[9px] font-bold text-zinc-500">
            {filteredTopics.length}
          </span>
        </div>

        {/* Topic links */}
        {filteredTopics.map((t) => {
          const href = `/dashboard/${t.slug}`;
          const active = pathname === href;
          return (
            <Link key={t.slug} href={href} className={linkClass(active)}>
              <div className={iconWrapClass(active)}>
                <TopicIcon id={t.icon} className={iconClass(active)} />
              </div>
              <span className="flex-1 truncate">{t.label}</span>
              <ChevronRight
                className={`h-3 w-3 transition-all ${
                  active
                    ? "text-white/40"
                    : "text-transparent group-hover:text-zinc-600"
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden border-t border-white/[0.05] px-5 py-3 lg:flex lg:items-center lg:gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.06]">
          <LayoutDashboard className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
        </div>
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Dashboard</p>
          <p className="text-[9px] text-zinc-600">FRED-powered analytics</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-dot" />
          <span className="text-[9px] text-zinc-600">Live</span>
        </div>
      </div>
    </aside>
  );
}
