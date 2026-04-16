"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Gauge, Search, ChevronRight, LayoutDashboard, Zap, History } from "lucide-react";
import { useState } from "react";

import { TopicIcon } from "@/components/icons/topic-icon";
import type { TopicDefinition } from "@/lib/fred/topics-config";

export function DashboardSidebar({ topics }: { topics: TopicDefinition[] }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-white/[0.06] bg-[#0a0a0c] lg:h-screen lg:w-[272px] lg:border-b-0 lg:border-r">
      {/* Brand */}
      <div className="px-5 py-5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd000] to-[#e6a800]">
            <Gauge className="h-5 w-5 text-black" aria-hidden />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-wide text-white">
              ZEMEN
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Macro Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 lg:px-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" aria-hidden />
          <input
            type="text"
            placeholder="Search indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-[13px] text-zinc-300 placeholder-zinc-600 outline-none transition focus:border-[#ffd000]/30 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#ffd000]/20"
          />
        </div>
      </div>

      <div className="separator-gold mx-5" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-x-auto px-3 py-3 lg:overflow-y-auto">
        {/* Quick links */}
        <div className="mb-1 space-y-0.5">
          <Link
            href="/sectors"
            className={[
              "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
              pathname === "/sectors"
                ? "sidebar-active text-[#ffd000]"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
            ].join(" ")}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                pathname === "/sectors"
                  ? "bg-[#ffd000]/20"
                  : "bg-white/[0.04] group-hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-[14px] leading-none" aria-hidden>
                📊
              </span>
            </div>
            <span className="flex-1 truncate">Sectors & Opportunities</span>
            <ChevronRight
              className={`h-3 w-3 transition-all ${
                pathname === "/sectors" ? "text-[#ffd000]/70" : "text-transparent group-hover:text-zinc-600"
              }`}
              aria-hidden
            />
          </Link>
          <Link
            href="/briefing"
            className={[
              "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
              pathname === "/briefing"
                ? "sidebar-active text-[#ffd000]"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
            ].join(" ")}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${pathname === "/briefing" ? "bg-[#ffd000]/20" : "bg-white/[0.04] group-hover:bg-white/[0.06]"}`}>
              <Zap
                className={`h-3.5 w-3.5 ${pathname === "/briefing" ? "text-[#ffd000]" : "text-zinc-500 group-hover:text-zinc-300"}`}
                aria-hidden
              />
            </div>
            Weekly Briefing
            {pathname === "/briefing" && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ffd000] live-dot" />
            )}
          </Link>
          <Link
            href="/regime-detector"
            className={[
              "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
              pathname === "/regime-detector"
                ? "sidebar-active text-[#ffd000]"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
            ].join(" ")}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${pathname === "/regime-detector" ? "bg-[#ffd000]/20" : "bg-white/[0.04] group-hover:bg-white/[0.06]"}`}>
              <FlaskConical
                className={`h-3.5 w-3.5 ${pathname === "/regime-detector" ? "text-[#ffd000]" : "text-zinc-500 group-hover:text-zinc-300"}`}
                aria-hidden
              />
            </div>
            Regime Detector
          </Link>
          <Link
            href="/regime-detector#historical-playbook"
            className="group flex items-center gap-2.5 rounded-xl px-3 py-1.5 pl-[52px] text-[11px] text-zinc-600 transition hover:text-[#ffd000]"
          >
            <History className="h-3 w-3" aria-hidden />
            Historical Playbook
          </Link>
        </div>

        <div className="separator-gold mx-2 my-2" />

        {/* Categories header */}
        <div className="mb-1 flex items-center justify-between px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Indicators
          </p>
          <span className="flex h-4 min-w-[18px] items-center justify-center rounded-md bg-white/[0.06] px-1.5 text-[9px] font-bold text-zinc-500">
            {filteredTopics.length}
          </span>
        </div>

        {/* Topic links */}
        {filteredTopics.map((t) => {
          const href = `/dashboard/${t.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={t.slug}
              href={href}
              className={[
                "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
                active
                  ? "sidebar-active text-[#ffd000]"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200",
              ].join(" ")}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${active ? "bg-[#ffd000]/20" : "bg-white/[0.04] group-hover:bg-white/[0.06]"}`}>
                <TopicIcon
                  id={t.icon}
                  className={`h-3.5 w-3.5 ${active ? "text-[#ffd000]" : "text-zinc-500 group-hover:text-zinc-300"}`}
                />
              </div>
              <span className="flex-1 truncate">{t.label}</span>
              <ChevronRight
                className={`h-3 w-3 transition-all ${
                  active ? "text-[#ffd000]/70" : "text-transparent group-hover:text-zinc-600"
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden border-t border-white/[0.06] px-5 py-3 lg:flex lg:items-center lg:gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffd000]/20 to-[#ffd000]/5">
          <LayoutDashboard className="h-3.5 w-3.5 text-[#ffd000]/70" aria-hidden />
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
