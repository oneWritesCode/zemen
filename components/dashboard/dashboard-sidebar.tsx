"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  Gauge,
  Search,
  Target,
  LayoutDashboard,
  Zap,
  BarChart3,
  Brain,
  Flame,
  TrendingUp,
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
      "group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
      active
        ? "bg-white/[0.06] text-white"
        : "text-[#bbb] hover:bg-white/[0.04] hover:text-white",
    ].join(" ");

  const iconWrapClass = (active: boolean) =>
    `flex h-7 w-7 items-center justify-center rounded-lg ${
      active ? "bg-white/10" : "bg-white/[0.04] group-hover:bg-white/[0.06]"
    }`;

  const iconClass = (active: boolean) =>
    `h-3.5 w-3.5 ${active ? "text-white" : "text-[#888] group-hover:text-zinc-300"}`;

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-[#0f0f0f] bg-[#050505] lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r">
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
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#888]">
              Macro Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 lg:px-5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#888]"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.05] bg-white/[0.03] py-2 pl-9 pr-3 text-[12px] text-[#bbb] placeholder-[#888] outline-none transition focus:border-white/[0.12] focus:bg-white/[0.05]"
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
            <Link href="/stock-scout" className={linkClass(pathname.startsWith("/stock-scout"))}>
              <div className={iconWrapClass(pathname.startsWith("/stock-scout"))}>
                <Target
                  className={iconClass(pathname.startsWith("/stock-scout"))}
                  aria-hidden
                />
              </div>
              <span className="flex-1 truncate">Stock Scout</span>
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




        {/* TOPICS */}
        <div className="mb-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#999] mb-2">
            Economic Indicators
          </p>
          <div className="space-y-0.5">
            {filteredTopics.map((topic) => (
              <motion.div key={topic.slug} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                <Link
                  href={`/indicators/${topic.slug}`}
                  className={linkClass(pathname === `/indicators/${topic.slug}`)}
                >
                  <div className={iconWrapClass(pathname === `/indicators/${topic.slug}`)}>
                    <TopicIcon
                      id={topic.icon}
                      className={iconClass(pathname === `/indicators/${topic.slug}`)}
                    />
                  </div>
                  <span className="flex-1 truncate">{topic.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Progress */}
      <div className="mt-auto p-4 lg:p-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#ffcc00]/10 border border-[#ffcc00]/20">
                <Brain className="h-3 w-3 text-[#ffcc00]" />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Macro IQ</span>
            </div>
            <span className="text-[14px] font-black text-[#ffcc00]">{userScore}</span>
          </div>
          
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${userScore}%` }}
              className="h-full bg-[#ffcc00] shadow-[0_0_10px_rgba(255,204,0,0.3)]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="text-[11px] font-bold text-[#888]">{userStreak} DAY STREAK</span>
            </div>
            <div className="rounded-md bg-white/[0.06] px-1.5 py-0.5">
              <span className="text-[9px] font-bold text-white uppercase">{getLevel(userScore)}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
