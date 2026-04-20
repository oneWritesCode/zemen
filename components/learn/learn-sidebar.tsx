"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  Gamepad2,
  GraduationCap,
  Gauge,
  ArrowLeft,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LEARN_NAV = [
  { href: "/learn", label: "Overview", icon: BookOpen, exact: true },
  { href: "/learn/quiz", label: "Macro IQ Quiz", icon: Brain, exact: true },
  { href: "/learn/challenge", label: "Portfolio Challenge", icon: Gamepad2, exact: true },
  { href: "/learn/guide", label: "Beginner's Guide", icon: GraduationCap, exact: true },
];

export function LearnSidebar() {
  const pathname = usePathname();
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

  const isActive = (item: typeof LEARN_NAV[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col bg-black lg:h-screen lg:w-[260px]">
      {/* Brand */}
      <div className="px-5 py-5 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
            <Gauge className="h-4 w-4 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-[14px] font-bold tracking-widest text-white">ZEMEN</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#666]">Learn Hub</p>
          </div>
        </Link>
      </div>

      {/* Back to Dashboard */}
      <div className="px-4 pb-4 lg:px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-[12px] text-[#888] transition hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="h-px mx-5 bg-white/[0.05]" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-x-auto px-3 py-4 lg:overflow-y-auto">
        {LEARN_NAV.map((item) => {
          const active = isActive(item);
          return (
            <motion.div key={item.href} whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link
                href={item.href}
                className={[
                  "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-[#888] hover:bg-white/[0.04] hover:text-white",
                ].join(" ")}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active ? "bg-white/10" : "bg-white/[0.04] group-hover:bg-white/[0.06]"
                  }`}
                >
                  <item.icon
                    className={`h-3.5 w-3.5 ${
                      active ? "text-white" : "text-[#666] group-hover:text-zinc-300"
                    }`}
                  />
                </div>
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Progress card */}
      <div className="mt-auto p-4 lg:p-5">
        <div className="rounded-2xl bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#4C72F6]/10">
                <Brain className="h-3 w-3 text-[#4C72F6]" />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Macro IQ</span>
            </div>
            <span className="text-[14px] font-black text-[#4C72F6]">{userScore}</span>
          </div>

          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${userScore}%` }}
              className="h-full bg-[#4C72F6] shadow-[0_0_10px_rgba(76,114,246,0.3)]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="text-[11px] font-bold text-[#666]">{userStreak} DAY STREAK</span>
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
