import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  AlertTriangle,
  Clock,
  BarChart3,
  Store,
  GraduationCap,
  Brain,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldAlert,
  CloudRain,
  Sun,
  TrendingDown,
  LineChart,
  PieChart,
  DollarSign,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { FloatingMacroBackground } from "@/components/site/floating-macro-background";
import { FloatingElementsBackground } from "@/components/site/floating-elements-background";
import { PresentationShell } from "@/components/site/presentation-shell";

const WATCH_BY_REGIME: Record<string, { label: string; reason: string; href: string }[]> = {
  goldilocks: [
    {
      label: "Inflation trend",
      reason: "If inflation re-accelerates, policy may stay tighter.",
      href: "/dashboard/inflation",
    },
    {
      label: "Unemployment",
      reason: "A sharp rise would suggest growth is cooling too fast.",
      href: "/dashboard/unemployment",
    },
    {
      label: "Credit spreads",
      reason: "Wider spreads often warn that risk appetite is fading.",
      href: "/dashboard/credit-spreads",
    },
  ],
  recovery: [
    {
      label: "GDP momentum",
      reason: "A stronger expansion confirms recovery is broadening.",
      href: "/dashboard/gdp-growth",
    },
    {
      label: "Consumer sentiment",
      reason: "Confidence helps sustain demand and hiring.",
      href: "/dashboard/consumer-sentiment",
    },
    {
      label: "Interest rates",
      reason: "Faster tightening can slow the rebound.",
      href: "/dashboard/interest-rates",
    },
  ],
  overheating: [
    {
      label: "CPI and inflation expectations",
      reason: "Persistent heat can force tighter policy.",
      href: "/dashboard/inflation",
    },
    {
      label: "Labor market tightness",
      reason: "Too-tight labor can sustain wage pressure.",
      href: "/dashboard/unemployment",
    },
    {
      label: "Policy rate path",
      reason: "More hikes can shift the regime toward slowdown.",
      href: "/dashboard/interest-rates",
    },
  ],
  stagflation: [
    {
      label: "Real GDP trend",
      reason: "Further growth weakness deepens stagflation risk.",
      href: "/dashboard/gdp-growth",
    },
    {
      label: "Inflation persistence",
      reason: "Sticky inflation limits policy flexibility.",
      href: "/dashboard/inflation",
    },
    {
      label: "Household confidence",
      reason: "Falling confidence can weaken demand quickly.",
      href: "/dashboard/consumer-sentiment",
    },
  ],
  recession: [
    {
      label: "Unemployment acceleration",
      reason: "Rising layoffs confirm recession intensity.",
      href: "/dashboard/unemployment",
    },
    {
      label: "Credit spreads",
      reason: "Rapid widening signals financial stress.",
      href: "/dashboard/credit-spreads",
    },
    {
      label: "Policy easing pace",
      reason: "Faster cuts can support eventual stabilization.",
      href: "/dashboard/interest-rates",
    },
  ],
};

const painPoints = [
  {
    icon: <Layers className="h-8 w-8 text-[#FFD000]" />,
    title: "It's everywhere",
    body: "Inflation here, unemployment there, GDP somewhere else. No single place tells the full story.",
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-[#FFD000]" />,
    title: "It's confusing",
    body: "Government websites show raw numbers with no context. What does 4.2% unemployment actually mean?",
  },
  {
    icon: <Clock className="h-8 w-8 text-[#FFD000]" />,
    title: "By the time you understand it, it's too late",
    body: "Most people only learn what the economy was doing after it already affected them.",
  },
];

const regimes = [
  {
    name: "Goldilocks",
    icon: <Sun className="mb-3 h-6 w-6" />,
    color: "border-[#22c55e]/60 bg-[#22c55e]/10 text-[#86efac]",
    text: "Everything is just right. Growth is healthy, inflation is low.",
  },
  {
    name: "Recovery",
    icon: <TrendingUp className="mb-3 h-6 w-6" />,
    color: "border-[#3b82f6]/60 bg-[#3b82f6]/10 text-[#93c5fd]",
    text: "Coming out of a downturn. Things are getting better slowly.",
  },
  {
    name: "Overheating",
    icon: <Activity className="mb-3 h-6 w-6" />,
    color: "border-[#f97316]/60 bg-[#f97316]/10 text-[#fdba74]",
    text: "Economy growing too fast. Inflation risk is rising.",
  },
  {
    name: "Stagflation",
    icon: <ShieldAlert className="mb-3 h-6 w-6" />,
    color: "border-[#ef4444]/60 bg-[#ef4444]/10 text-[#fca5a5]",
    text: "The worst combo. High inflation + low growth.",
  },
  {
    name: "Recession",
    icon: <CloudRain className="mb-3 h-6 w-6" />,
    color: "border-[#7f1d1d]/60 bg-[#7f1d1d]/10 text-[#fecaca]",
    text: "Economy shrinking. Jobs being lost.",
  },
];

const personas = [
  {
    icon: <BarChart3 className="h-8 w-8 text-[#FFD000]" />,
    title: "Retail Investor",
    text: "Wants to know if now is a good time to buy or hold",
  },
  {
    icon: <Store className="h-8 w-8 text-[#FFD000]" />,
    title: "Small Business Owner",
    text: "Deciding whether to hire, expand, or wait",
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-[#FFD000]" />,
    title: "Student",
    text: "Learning macroeconomics with real live data",
  },
  {
    icon: <Brain className="h-8 w-8 text-[#FFD000]" />,
    title: "Financial Analyst",
    text: "Needs a fast macro snapshot without 10 browser tabs",
  },
];

const painPointsTokens = [
  { content: <TrendingDown className="h-8 w-8 text-red-500/10" />, className: "top-[15%] left-[5%] float-slow" },
  { content: <ShieldAlert className="h-12 w-12 text-orange-500/10" />, className: "top-[60%] right-[8%] float-medium" },
  { content: "DATA OVERLOAD", className: "text-zinc-500/5 font-black text-4xl top-[30%] right-[15%] float-slow" },
  { content: "NOISE", className: "text-zinc-500/5 font-bold text-6xl top-[70%] left-[10%] float-fast" },
];

const regimesTokens = [
  { content: <LineChart className="h-16 w-16 text-[#FFD000]/10" />, className: "top-[20%] left-[8%] float-medium" },
  { content: <PieChart className="h-20 w-20 text-[#3b82f6]/10" />, className: "bottom-[15%] right-[5%] float-slow" },
  { content: "CYCLE", className: "text-[#22c55e]/5 font-black text-7xl top-[10%] right-[20%] float-slow" },
  { content: "PHASE", className: "text-[#f97316]/5 font-bold text-5xl bottom-[25%] left-[12%] float-fast" },
];

const personasTokens = [
  { content: <DollarSign className="h-10 w-10 text-[#FFD000]/10" />, className: "top-[25%] left-[10%] float-slow" },
  { content: "ROI", className: "text-zinc-500/10 font-black text-6xl top-[15%] right-[10%] float-medium" },
  { content: "GROWTH", className: "text-[#FFD000]/5 font-bold text-5xl bottom-[15%] left-[20%] float-fast" },
  { content: <BarChart3 className="h-14 w-14 text-white/5" />, className: "bottom-[20%] right-[15%] float-slow" },
];

export default async function HomePage() {
  const analysis = await getRegimeAnalysis();
  const current = analysis.current;
  const meta = REGIME_BY_ID[current.regime];
  const watch = WATCH_BY_REGIME[current.regime] ?? [];

  const transitions = analysis.monthly.filter(
    (m, idx, arr) =>
      idx > 0 && arr[idx - 1]?.regime !== m.regime && m.regime === current.regime,
  );
  const lastThree = transitions.slice(-3).reverse();

  return (
    <PresentationShell>
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Macro Economic Background"
            fill
            className="object-cover opacity-40 mix-blend-lighten"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/20 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        </div>
        <FloatingMacroBackground />
        <div className="section-reveal relative z-10 mx-auto min-w-6xl max-w-12xl px-4 sm:px-2 sm:py-32">
          <p className="text-sm uppercase font-bold tracking-[0.4em] text-[#FFD000]">Macro Intelligence</p>
          <h1 className="mt-4 text-6xl font-black tracking-[-0.02em] text-zinc-100 sm:text-8xl">ZEMEN</h1>
          <p className="mt-8 max-w-3xl text-3xl font-semibold leading-tight text-zinc-100 sm:text-4xl">
            The economy explained. <span className="text-[#FFD000]">In one answer.</span>
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Zemen watches 10+ economic indicators 24/7 and tells you exactly what the economy is doing
            right now — and what history says happens next.
          </p>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#FFD000] px-8 py-4 text-lg font-bold text-black transition hover:bg-[#ffdc4d] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,208,0,0.3)] capitalize"
          >
            go to dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── Live Regime ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-zinc-500">
          ZEMEN Mission Control
        </p>
        <div className="mt-5 rounded-3xl border border-white/10 bg-[#111111] p-8 text-center sm:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#FFD000]" />
            LIVE
          </div>
          <h2
            className="mt-6 text-5xl font-black sm:text-7xl"
            style={{ color: meta.color }}
          >
            {meta.label}
          </h2>
          <p className="mt-3 text-xl text-zinc-300">
            Confidence: {current.confidencePct.toFixed(1)}%
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-2xl font-semibold leading-tight text-white">
            Right now the economy is in {meta.label}. {meta.description}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
            <h3 className="text-lg font-semibold text-[#FFD000]">
              The last 3 times we were here...
            </h3>
            <div className="mt-4 space-y-3">
              {lastThree.length === 0 ? (
                <p className="text-sm text-zinc-400">
                  No prior transitions into this regime were detected.
                </p>
              ) : (
                lastThree.map((entry) => (
                  <div
                    key={entry.period}
                    className="rounded-xl border border-white/10 bg-black/25 p-3"
                  >
                    <p className="font-semibold text-zinc-100">{entry.period}</p>
                    <p className="text-sm text-zinc-400">
                      Regime switched into {meta.label}. Check regime playbook for what happened next.
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
            <h3 className="text-lg font-semibold text-[#FFD000]">What to watch</h3>
            <div className="mt-4 space-y-3">
              {watch.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-xl border border-white/10 bg-black/25 p-3 transition hover:border-[#FFD000]/50"
                >
                  <p className="font-semibold text-zinc-100">{item.label}</p>
                  <p className="text-sm text-zinc-400">{item.reason}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/interest-rates"
            className="rounded-full bg-[#FFD000] px-5 py-2.5 font-semibold text-black"
          >
            Open Dashboard
          </Link>
          <Link
            href="/briefing"
            className="rounded-full border border-white/15 px-5 py-2.5 text-zinc-200 hover:border-[#FFD000]/50"
          >
            Weekly Briefing
          </Link>
          <Link
            href="/regime-detector"
            className="rounded-full border border-white/15 px-5 py-2.5 text-zinc-200 hover:border-[#FFD000]/50"
          >
            Regime Detector
          </Link>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="relative overflow-hidden section-reveal mx-auto px-4 py-24 sm:px-6">
        <FloatingElementsBackground elements={painPointsTokens} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-zinc-100 sm:text-5xl">The problem with economic data</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/[0.08] hover:border-[#FFD000]/30 backdrop-blur-sm"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-[#FFD000] transition">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regime Explainer ── */}
      <section className="relative overflow-hidden section-reveal mx-auto px-4 py-24 sm:px-6">
        <FloatingElementsBackground elements={regimesTokens} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-zinc-100 sm:text-5xl">Zemen changes that</h2>
              <div className="mt-10 rounded-3xl border border-[#FFD000]/30 bg-[#FFD000]/10 p-8 text-xl leading-relaxed text-zinc-100 backdrop-blur-md">
                Think of Zemen like a weather app — but for the economy. A weather app does not show you
                temperature, humidity, and pressure separately and leave you guessing. It says:{" "}
                <span className="text-[#FFD000] font-bold">rainy tomorrow, bring an umbrella</span>. Zemen
                does the same for the economy. It says: we are in Stagflation — here is what that means for you.
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/regime-viz.png"
                alt="Zemen Regime Detector Concept"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5 relative z-10">
            {regimes.map((regime) => (
              <article
                key={regime.name}
                className={`rounded-3xl border p-6 flex flex-col transition hover:scale-105 backdrop-blur-sm ${regime.color}`}
              >
                {regime.icon}
                <h3 className="text-xl font-bold">{regime.name}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-90">{regime.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personas ── */}
      <section className="relative overflow-hidden section-reveal mx-auto px-4 py-24 sm:px-6">
        <FloatingElementsBackground elements={personasTokens} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-zinc-100 sm:text-5xl">Built for anyone with money at stake</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {personas.map((persona) => (
              <article
                key={persona.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:border-[#FFD000]/50 transition backdrop-blur-sm"
              >
                <div className="mb-5">{persona.icon}</div>
                <h3 className="text-2xl font-bold text-zinc-100">{persona.title}</h3>
                <p className="mt-3 text-zinc-300 leading-relaxed text-sm">{persona.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section-reveal mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-[#FFD000]/5" />
          <div className="absolute top-0 right-0 p-8 opacity-20 float-slow">
            <TrendingUp className="h-32 w-32 text-[#FFD000]" />
          </div>
          <h2 className="relative z-10 text-3xl font-bold text-zinc-100">About the Project</h2>
          <div className="relative z-10 mt-6 flex flex-col gap-4">
            <p className="text-lg text-zinc-300">
              Developed at the <span className="text-[#FFD000] font-semibold">Zerve AI Hackathon 2025</span>
            </p>
            <p className="text-lg text-zinc-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
              Powered by FRED (Federal Reserve Economic Data) — 800,000+ data series
            </p>
            <p className="text-lg text-zinc-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFD000]" />
              Built for depth, designed for simplicity.
            </p>
          </div>
        </div>
      </section>
    </PresentationShell>
  );
}