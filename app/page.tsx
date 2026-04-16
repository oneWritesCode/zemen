import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Activity,
  TrendingUp,
  ShieldAlert,
  CloudRain,
  Sun,
  BarChart3,
  Store,
  GraduationCap,
  Brain,
  Layers,
  AlertTriangle,
  Clock,
  Zap,
  Globe,
  LineChart,
  PieChart,
  Landmark,
  Gauge,
  Eye,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { RegimeAlertBanner } from "@/components/global/regime-alert-banner";
import { PresentationShell } from "@/components/site/presentation-shell";

/* ── Regime cards ── */
const regimeCards = [
  {
    name: "Goldilocks",
    icon: Sun,
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.06]",
    text: "Solid growth, tame inflation, healthy labour market.",
  },
  {
    name: "Recovery",
    icon: TrendingUp,
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/[0.06]",
    text: "Rebound in growth and employment after a downturn.",
  },
  {
    name: "Overheating",
    icon: Activity,
    color: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/[0.06]",
    text: "Tight labour, strong demand, building price pressure.",
  },
  {
    name: "Stagflation",
    icon: ShieldAlert,
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/[0.06]",
    text: "Elevated inflation with weak growth or labour slack.",
  },
  {
    name: "Recession",
    icon: CloudRain,
    color: "text-red-300",
    border: "border-red-400/20",
    bg: "bg-red-400/[0.06]",
    text: "Rising joblessness, wide spreads, contracting activity.",
  },
];

const painPoints = [
  {
    icon: Layers,
    title: "It's everywhere",
    body: "Inflation here, unemployment there, GDP somewhere else. No single place tells the full story.",
  },
  {
    icon: AlertTriangle,
    title: "It's confusing",
    body: "Raw numbers with no context. What does 4.2% unemployment actually mean for you?",
  },
  {
    icon: Clock,
    title: "It's always too late",
    body: "Most people only learn what the economy was doing after it already affected them.",
  },
];

const features = [
  {
    icon: Gauge,
    title: "Regime Detection",
    body: "K-means clustering on live FRED data identifies the current economic phase automatically.",
  },
  {
    icon: LineChart,
    title: "10 Indicator Dashboards",
    body: "Rates, inflation, unemployment, GDP, housing, credit, gold, equities, trade, and sentiment.",
  },
  {
    icon: Eye,
    title: "Weekly Briefing",
    body: "What happened, what it means, and what to watch — in plain English.",
  },
  {
    icon: Zap,
    title: "AI Chat",
    body: "Ask anything about the economy. Get clear, contextual answers powered by live data.",
  },
  {
    icon: Globe,
    title: "Live FRED Data",
    body: "Pulling from 800,000+ series at the Federal Reserve Economic Data API.",
  },
  {
    icon: PieChart,
    title: "Macro Health Score",
    body: "A single 0–100 composite score from rates, inflation, jobs, GDP, and credit.",
  },
];

const personas = [
  {
    icon: BarChart3,
    title: "Retail Investor",
    text: "Wants to know if now is a good time to buy or hold.",
  },
  {
    icon: Store,
    title: "Small Business Owner",
    text: "Deciding whether to hire, expand, or wait.",
  },
  {
    icon: GraduationCap,
    title: "Student",
    text: "Learning macroeconomics with real live data.",
  },
  {
    icon: Brain,
    title: "Financial Analyst",
    text: "Needs a fast macro snapshot without 10 browser tabs.",
  },
];

const WATCH_BY_REGIME: Record<string, { label: string; reason: string; href: string }[]> = {
  goldilocks: [
    { label: "Inflation trend", reason: "If inflation re-accelerates, policy may stay tighter.", href: "/dashboard/inflation" },
    { label: "Unemployment", reason: "A sharp rise would suggest growth is cooling too fast.", href: "/dashboard/unemployment" },
    { label: "Credit spreads", reason: "Wider spreads often warn that risk appetite is fading.", href: "/dashboard/credit-spreads" },
  ],
  recovery: [
    { label: "GDP momentum", reason: "A stronger expansion confirms recovery is broadening.", href: "/dashboard/gdp-growth" },
    { label: "Consumer sentiment", reason: "Confidence helps sustain demand and hiring.", href: "/dashboard/consumer-sentiment" },
    { label: "Interest rates", reason: "Faster tightening can slow the rebound.", href: "/dashboard/interest-rates" },
  ],
  overheating: [
    { label: "CPI and inflation expectations", reason: "Persistent heat can force tighter policy.", href: "/dashboard/inflation" },
    { label: "Labor market tightness", reason: "Too-tight labor can sustain wage pressure.", href: "/dashboard/unemployment" },
    { label: "Policy rate path", reason: "More hikes can shift the regime toward slowdown.", href: "/dashboard/interest-rates" },
  ],
  stagflation: [
    { label: "Real GDP trend", reason: "Further growth weakness deepens stagflation risk.", href: "/dashboard/gdp-growth" },
    { label: "Inflation persistence", reason: "Sticky inflation limits policy flexibility.", href: "/dashboard/inflation" },
    { label: "Household confidence", reason: "Falling confidence can weaken demand quickly.", href: "/dashboard/consumer-sentiment" },
  ],
  recession: [
    { label: "Unemployment acceleration", reason: "Rising layoffs confirm recession intensity.", href: "/dashboard/unemployment" },
    { label: "Credit spreads", reason: "Rapid widening signals financial stress.", href: "/dashboard/credit-spreads" },
    { label: "Policy easing pace", reason: "Faster cuts can support eventual stabilization.", href: "/dashboard/interest-rates" },
  ],
};

export default async function HomePage() {
  const analysis = await getRegimeAnalysis();
  const current = analysis.current;
  const meta = REGIME_BY_ID[current.regime];
  const watch = WATCH_BY_REGIME[current.regime] ?? [];

  return (
    <PresentationShell>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/40 via-[#09090b]/70 to-[#09090b]" />
        </div>

        {/* Subtle top glow */}
        <div className="hero-glow absolute inset-0 pointer-events-none z-[1]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-28 pb-12 sm:pt-36 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs text-zinc-400 mb-8 backdrop-blur-sm">
            <Landmark className="h-3.5 w-3.5" />
            Macro Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
            The economy explained.
            <br />
            <span className="text-zinc-400">In one answer.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Zemen watches 10+ economic indicators and tells you exactly what the economy
            is doing right now — and what history says happens next.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] backdrop-blur-sm"
            >
              How it works
            </Link>
          </div>

          <RegimeAlertBanner variant="inline" />
        </div>

        {/* Dashboard preview screenshot below hero */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111113]/60 p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src="/dashboard-preview.png"
                alt="Zemen Dashboard Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Glow under the screenshot */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-24 w-3/4 bg-[radial-gradient(ellipse_at_center,rgba(255,208,0,0.06),transparent_70%)] blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* ═══════════ LIVE REGIME STATUS ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="rounded-2xl border border-white/[0.06] bg-[#111113] p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-soft" />
            LIVE
          </div>

          <h2
            className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight"
            style={{ color: meta.color }}
          >
            {meta.label}
          </h2>

          <p className="mt-3 text-lg text-zinc-400">
            Confidence: {current.confidencePct.toFixed(1)}%
          </p>

          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-300 leading-relaxed">
            {meta.description}
          </p>

          {/* What to watch */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3 text-left max-w-3xl mx-auto">
            {watch.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.12] hover:bg-white/[0.04] group"
              >
                <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">{item.label}</p>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.reason}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              Open Dashboard
            </Link>
            <Link
              href="/briefing"
              className="rounded-lg border border-white/[0.1] px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.04]"
            >
              Weekly Briefing
            </Link>
            <Link
              href="/regime-detector"
              className="rounded-lg border border-white/[0.1] px-5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.04]"
            >
              Regime Detector
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ THE PROBLEM ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Economic data is broken
          </h2>
          <p className="mt-3 text-base text-zinc-500 max-w-xl mx-auto">
            Scattered across dozens of sources, buried in jargon, and always a step behind.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/[0.06] bg-[#111113] p-6 card-hover"
            >
              <item.icon className="h-5 w-5 text-zinc-400 mb-4" />
              <h3 className="text-base font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ THE SOLUTION — with regime-viz image ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="rounded-2xl border border-white/[0.06] bg-[#111113] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Text */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">The Solution</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
                Zemen changes that
              </h2>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
          Think of Zemen like a weather app — but for the economy. A weather app does not show you
                temperature, humidity, and pressure separately. It says:{" "}
                <span className="text-zinc-200 font-medium">rainy tomorrow, bring an umbrella</span>.
              </p>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Zemen reads 10+ live indicators, runs machine learning, and tells you:{" "}
                <span className="text-zinc-200 font-medium">we are in {meta.label}</span> — here is what
                that means for you.
              </p>
              <div className="mt-6">
                <Link
                  href="/regime-detector"
                  className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 transition"
                >
                  See the regime detector <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative min-h-[300px] lg:min-h-0">
              <Image
                src="/regime-viz.png"
                alt="Zemen Regime Detector Visualization"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111113] via-transparent to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ THE 5 REGIMES ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Economic Phases</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Five economic regimes
          </h2>
          <p className="mt-3 text-base text-zinc-500 max-w-xl mx-auto">
            Every month in modern history fits into one of these five phases.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {regimeCards.map((regime) => (
            <div
              key={regime.name}
              className={`rounded-2xl border ${regime.border} ${regime.bg} p-5 card-hover`}
            >
              <regime.icon className={`h-5 w-5 ${regime.color} mb-3`} />
              <h3 className={`text-base font-semibold ${regime.color}`}>{regime.name}</h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{regime.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Everything you need
          </h2>
          <p className="mt-3 text-base text-zinc-500 max-w-xl mx-auto">
            From live data to AI-powered insights — one tool to understand the economy.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.06] bg-[#111113] p-6 card-hover"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] mb-4">
                <f.icon className="h-4 w-4 text-zinc-400" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ WHO IT'S FOR ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Built For</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Anyone with money at stake
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/[0.06] bg-[#111113] p-6 card-hover"
            >
              <p.icon className="h-5 w-5 text-zinc-400 mb-4" />
              <h3 className="text-base font-semibold text-zinc-100">{p.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA with hero-bg ═══════════ */}
      <section className="section-reveal mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="relative rounded-2xl border border-white/[0.06] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.png"
              alt=""
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-[#09090b]/70" />
          </div>

          <div className="relative z-10 p-10 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              Start watching the economy
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-lg mx-auto">
              Open the dashboard, explore live data, and understand what the economy is doing — in seconds.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PresentationShell>
  );
}