"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Gauge } from "lucide-react";

import { TopicIcon } from "@/components/icons/topic-icon";
import type { TopicDefinition } from "@/lib/fred/topics-config";

export function DashboardSidebar({ topics }: { topics: TopicDefinition[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/[0.08] bg-[#0a0a0b] lg:h-screen lg:w-[260px] lg:border-b-0 lg:border-r">
      <div className="border-b border-white/[0.08] px-5 py-6 lg:px-6">
        <Link href="/" className="flex items-start gap-2">
          <Gauge className="mt-1 h-6 w-6 shrink-0 text-[#ffcc00]" aria-hidden />
          <div>
            <p className="font-serif text-2xl font-semibold tracking-wide text-[#ffcc00]">
              ZEMEN
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Regime detector
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-x-auto px-3 py-4 lg:overflow-y-auto">
        <div className="mb-2 space-y-1">
          <Link
            href="/regime-detector"
            className={[
              "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/regime-detector"
                ? "bg-[#ffcc00] text-black shadow-[0_0_24px_rgba(255,204,0,0.25)]"
                : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
            ].join(" ")}
          >
            <FlaskConical
              className={`h-4 w-4 shrink-0 ${pathname === "/regime-detector" ? "text-black" : "text-zinc-400"}`}
              aria-hidden
            />
            Regime detector
          </Link>
          <Link
            href="/regime-detector#historical-playbook"
            className="block px-3 py-1 text-[11px] leading-tight text-zinc-500 transition hover:text-[#ffcc00]"
          >
            → Historical playbook
          </Link>
        </div>
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Categories
        </p>
        {topics.map((t) => {
          const href = `/dashboard/${t.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={t.slug}
              href={href}
              className={[
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#ffcc00] text-black shadow-[0_0_24px_rgba(255,204,0,0.25)]"
                  : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <TopicIcon
                id={t.icon}
                className={`h-4 w-4 shrink-0 ${active ? "text-black" : "text-zinc-400"}`}
              />
              {t.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/[0.08] px-5 py-4 text-[10px] uppercase tracking-wider text-zinc-600 lg:block">
        Navigation
      </div>
    </aside>
  );
}
