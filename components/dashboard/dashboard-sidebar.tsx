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
  BarChart3,
  Brain,
  Trophy,
  Flame,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import { TopicIcon } from "@/components/icons/topic-icon";
import type { TopicDefinition } from "@/lib/fred/topics-config";

export function DashboardSidebar({ topics }: { topics: TopicDefinition[] }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const score = localStorage.getItem("zemen_iq_score");
      const streak = localStorage.getItem("zemen_streak");
      queueMicrotask(() => {
        if (score) setUserScore(parseInt(score));
        if (streak) setUserStreak(parseInt(streak));
      });
    }
  }, []);

  const getLevel = (s: number) => {
    if (s <= 30) return "Beginner";
    if (s <= 60) return "Student";
    if (s <= 80) return "Analyst";
    return "Expert";
  };

  const filteredTopics = topics.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const linkClass = (active: boolean) =>
    [
      "nav-link-hover group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
      active
        ? "sidebar-active"
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
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
            <Link href="/dashboard" className={linkClass(pathname === "/dashboard" || pathname === "/")}>
              <div className={iconWrapClass(pathname === "/dashboard" || pathname === "/")}>
                <LayoutDashboard
                  className={iconClass(pathname === "/dashboard" || pathname === "/")}
                  aria-hidden
                />
              </div>
              <span className="flex-1 truncate">Dashboard</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
            <Link href="/indicators" className={linkClass(pathname.startsWith("/indicators"))}>
              <div className={iconWrapClass(pathname.startsWith("/indicators"))}>
                <BarChart3
                  className={iconClass(pathname.startsWith("/indicators"))}
                  aria-hidden
                />
              </div>
              <span className="flex-1 truncate">Indicators</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
            <Link href="/sectors" className={linkClass(pathname.startsWith("/sectors"))}>
              <div className={iconWrapClass(pathname.startsWith("/sectors"))}>
                <TrendingUp
                  className={iconClass(pathname.startsWith("/sectors"))}
                  aria-hidden
                />
              </div>
              <span className="flex-1 truncate">Sectors</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
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
            </Link>
          </motion.div>

          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
            <Link
              href="/regime"
              className={linkClass(pathname.startsWith("/regime"))}
            >
              <div className={iconWrapClass(pathname.startsWith("/regime"))}>
                <FlaskConical
                  className={iconClass(pathname.startsWith("/regime"))}
                  aria-hidden
                />
              </div>
              <span className="flex-1 truncate">Regime Detector</span>
            </Link>
          </motion.div>
        </div>

        <div className="separator-gold mx-2 my-2" />

        {/* LEARN HUB */}
        <div className="mb-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600 mb-2">
            Learn Hub
          </p>
          <div className="space-y-0.5">
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link href="/learn" className={linkClass(pathname === "/learn")}>
                <div className={iconWrapClass(pathname === "/learn")}>
                  <BookOpen className={iconClass(pathname === "/learn")} />
                </div>
                <span className="flex-1 truncate">Learn Hub</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link href="/learn/quiz" className={linkClass(pathname === "/learn/quiz")}>
                <div className={iconWrapClass(pathname === "/learn/quiz")}>
                  <Brain className={iconClass(pathname === "/learn/quiz")} />
                </div>
                <span className="flex-1 truncate">Macro IQ Quiz</span>
              </Link>
            </motion.div>
          </div>
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
            <motion.div key={t.slug} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link href={href} className={linkClass(active)}>
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
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / User Stats */}
      <div className="border-t border-white/[0.05] p-4 lg:p-5">
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Your Macro IQ</p>
                <p className="text-[9px] text-zinc-500 font-medium">{getLevel(userScore)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-mono font-bold text-white">{userScore}<span className="text-[10px] text-zinc-600">/100</span></p>
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-white" style={{ width: `${userScore}%` }} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
            <div className="flex items-center gap-1.5">
              <Flame className={`w-3 h-3 ${userStreak > 0 ? 'text-white' : 'text-zinc-600'}`} />
              <span className="text-[10px] font-bold text-zinc-400">{userStreak} day streak</span>
            </div>
            {userScore >= 80 && (
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500">Expert</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
