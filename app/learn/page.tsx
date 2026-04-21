"use client";

import Link from "next/link";
import { Brain, Gamepad2, BookOpen, GraduationCap, ArrowRight, Sparkles, Trophy, Target, LineChart, TrendingUp, Factory, Briefcase, TrendingDown, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const LEARN_CARDS = [
  {
    href: "/learn/quiz",
    title: "Macro IQ Quiz",
    description: "Test your economic knowledge with 20+ questions across interest rates, inflation, GDP, and more. Earn points and level up.",
    icon: Brain,
    color: "#4C72F6",
    cta: "Start Quiz",
    stats: "20+ questions",
  },
  {
    href: "/learn/challenge",
    title: "Portfolio Challenge",
    description: "Simulate investing ₹10L across different historical regimes. See how your allocation strategy performs under pressure.",
    icon: Gamepad2,
    color: "#22c55e",
    cta: "Try Challenge",
    stats: "5 regimes",
  },
  {
    href: "/learn/guide",
    title: "Beginner's Guide",
    description: "New to economics? Start here with our plain-English guide to interest rates, inflation, GDP, and how they connect.",
    icon: GraduationCap,
    color: "#f59e0b",
    cta: "Read Guide",
    stats: "10 min read",
  },
];

const CONCEPTS = [
  { title: "Interest Rates", desc: "The price of borrowing money, set by the Federal Reserve.", icon: <LineChart className="w-6 h-6 text-[#4C72F6]" /> },
  { title: "Inflation", desc: "How fast prices rise — measured by CPI and PCE.", icon: <TrendingUp className="w-6 h-6 text-red-500" /> },
  { title: "GDP Growth", desc: "The total output of the economy, measured quarterly.", icon: <Factory className="w-6 h-6 text-zinc-400" /> },
  { title: "Unemployment", desc: "The percentage of people looking for work who can't find it.", icon: <Briefcase className="w-6 h-6 text-[#f59e0b]" /> },
  { title: "Yield Curve", desc: "The shape of bond yields — a powerful recession predictor.", icon: <TrendingDown className="w-6 h-6 text-[#22c55e]" /> },
  { title: "Credit Spreads", desc: "The risk premium investors demand for holding corporate bonds.", icon: <CreditCard className="w-6 h-6 text-yellow-500" /> },
];

export default function LearnHubPage() {
  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        {/* Hero */}
        <section className="relative mb-14">
          <div className="absolute inset-0 opacity-20 rounded-3xl" style={{
            background: "radial-gradient(ellipse 60% 50% at 30% 30%, #4C72F620, transparent 60%)"
          }} />
          <div className="relative z-10 py-12 sm:py-16">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#4C72F6]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4C72F6]">Learn Hub</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Master the<br />
              <span className="text-[#666]">macro economy.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] text-[#888] leading-relaxed">
              Interactive quizzes, portfolio simulations, and plain-English guides to help you
              understand how the economy actually works.
            </p>
          </div>
        </section>

        {/* Main Cards */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {LEARN_CARDS.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href} className="h-full block group">
                <div className="relative h-full rounded-2xl bg-[#0a0a0a] p-6 sm:p-7 transition-all duration-300 hover:translate-y-[-4px]">
                  {/* Top accent */}
                  <div className="absolute top-0 left-5 right-5 h-[2px] rounded-full opacity-50"
                    style={{ background: card.color }}
                  />

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                    style={{ background: `${card.color}12` }}
                  >
                    <card.icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-[13px] text-[#666] leading-relaxed mb-6 flex-1">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#444] uppercase tracking-wider">
                      {card.stats}
                    </span>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-white group-hover:gap-2.5 transition-all">
                      {card.cta}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Key Concepts */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Key Concepts</h2>
            <p className="mt-1 text-[13px] text-[#838383]">
              The building blocks of macroeconomics — simplified.
            </p>
          </div>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl bg-[#0a0a0a] p-5 transition-all duration-200 hover:translate-y-[-2px]"
              >
                <div className="text-2xl mb-3">{c.icon}</div>
                <h3 className="text-[14px] font-bold text-white mb-1">{c.title}</h3>
                <p className="text-[12px] text-[#666] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="rounded-2xl bg-[#0a0a0a] p-7 sm:p-10">
          <h2 className="text-2xl font-bold text-white mb-2">Your Learning Journey</h2>
          <p className="text-[13px] text-[#838383] mb-8">Complete activities to unlock new levels and earn achievements.</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Target, title: "Complete Quiz", desc: "Score 70%+ on the Macro IQ Quiz", color: "#4C72F6" },
              { icon: Trophy, title: "Portfolio Pro", desc: "Beat S&P 500 in the Challenge", color: "#22c55e" },
              { icon: BookOpen, title: "Read the Guide", desc: "Finish all sections of the guide", color: "#f59e0b" },
            ].map((m) => (
              <div key={m.title} className="flex items-start gap-4 rounded-xl p-4 bg-white/[0.02]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${m.color}12` }}
                >
                  <m.icon className="w-5 h-5" style={{ color: m.color }} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white">{m.title}</h3>
                  <p className="text-[11px] text-[#838383] mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
