"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import { ExternalLink, usePlatformPopularity } from "@/components/actions/external-link";
import { CompanyLogo } from "@/components/CompanyLogo";
import {
  getActionPanelConfig,
  type ActionGuide,
  type ActionPlatform,
} from "@/lib/actions/action-config";
import type { ChartRow, KpiMetric } from "@/lib/fred/get-topic-dataset";

type ActionPanelProps = {
  topicSlug: string;
  chartRows: ChartRow[];
  kpis: KpiMetric[];
};

type RegimeStatus = { regime: string; confidence: number };

function useRegimeStatus() {
  const [status, setStatus] = useState<RegimeStatus | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/regime/status", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as RegimeStatus;
        if (mounted) setStatus(j);
      } catch {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return status;
}

function urgencyDot(urgency: ActionGuide["urgency"]) {
  if (urgency === "high") return "bg-red-500";
  if (urgency === "medium") return "bg-white";
  return "bg-zinc-500";
}

function regionBadge(region: ActionPlatform["region"]) {
  if (region === "India") return "bg-[#ff6b0020] text-[#ff6b00]";
  if (region === "US") return "bg-[#3b82f620] text-[#60a5fa]";
  return "bg-[#22c55e20] text-[#22c55e]";
}

function GuideBox({ guide }: { guide: ActionGuide }) {
  return (
    <div className="rounded-r-lg border border-[#1e1e1e] border-l-[3px] border-l-white/60 bg-[#111111] px-5 py-4">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${urgencyDot(guide.urgency)}`} />
        <span className="text-[11px] uppercase tracking-[2px] text-[#999] font-bold">{guide.title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#ddd]">{guide.body}</p>
    </div>
  );
}

function PlatformCard({ p, index = 0 }: { p: ActionPlatform, index?: number }) {
  const initialPopularity = usePlatformPopularity(p.name);
  const [popularity, setPopularity] = useState(initialPopularity);
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: '-50px' }} 
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08, 
        ease: 'easeOut' 
      }}
      className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-5 transition-all hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] will-change-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyLogo
            ticker={p.ticker ?? ""}
            name={p.name}
            size={44}
            fallbackColor={p.color}
          />
          <div>
            <p className="font-semibold text-[#eee]">{p.name}</p>
            <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] ${regionBadge(p.region)}`}>
              {p.region}
            </span>
          </div>
        </div>
        {popularity > 3 ? (
          <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
            Popular choice
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-[#bbb]">{p.description}</p>
      <p className="mt-2 text-xs text-[#888]">
        Best for: <span className="text-[#bbb]">{p.bestFor}</span>
      </p>
      <p className="mt-2 text-xs text-white">{p.feature}</p>

      <ExternalLink
        platformName={p.name}
        url={p.url}
        onTrackedClick={() => setPopularity((v) => v + 1)}
        className="mt-4 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-left text-xs font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
      >
        Open {p.name} →
      </ExternalLink>
    </motion.article>
  );
}

function BeginnerStocks() {
  const [open, setOpen] = useState(false);
  const steps = [
    {
      t: "Understand what you are buying",
      b: "A stock is a small piece of ownership in a real company. When you buy Apple stock, you own a tiny fraction of Apple.",
    },
    {
      t: "Only invest what you can afford to lose",
      b: "Never invest money you might need in the next 1-2 years. Stock prices can drop 30-50% even in healthy companies.",
    },
    {
      t: "Start with index funds not individual stocks",
      b: "An index fund like Nifty 50 or S&P 500 automatically buys a little of many companies, which is usually safer for beginners.",
    },
    {
      t: "Invest regularly not all at once",
      b: "Fixed monthly investing (SIP / dollar cost averaging) reduces the stress of trying to time the market.",
    },
    {
      t: "Think in years not days",
      b: "The best investors hold for 5-10+ years. Short-term trading is where most beginners get hurt.",
    },
  ];
  return (
    <div className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-[#ddd]">New to stocks? Start here</span>
        <span className="text-xs text-[#888]">{open ? "Hide" : "Show"}</span>
      </button>
      {open ? (
        <ol className="mt-3 space-y-2">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3">
              <p className="text-sm font-semibold text-[#eee]">
                Step {i + 1}: {s.t}
              </p>
              <p className="mt-1 text-xs text-[#aaa] leading-relaxed">{s.b}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function SkillCards() {
  const cards = [
    { title: "Learn to Code", body: "Tech skills stay in demand even in recessions.", links: [{ l: "freeCodeCamp", u: "https://freecodecamp.org" }, { l: "Coursera", u: "https://coursera.org" }, { l: "Coding Ninjas", u: "https://codingninjas.com" }] },
    { title: "Digital Marketing", body: "Every business needs online customer acquisition.", links: [{ l: "Google Digital Garage", u: "https://learndigital.withgoogle.com" }, { l: "HubSpot Academy", u: "https://academy.hubspot.com" }] },
    { title: "Data & Analytics", body: "Data skills can command strong compensation.", links: [{ l: "Google Data Analytics Certificate", u: "https://grow.google/certificates" }, { l: "Kaggle Learn", u: "https://kaggle.com/learn" }] },
    { title: "Finance & Accounting", body: "Finance skills are portable across cycles.", links: [{ l: "ICAI", u: "https://icai.org" }, { l: "CFA Institute", u: "https://cfainstitute.org" }, { l: "Zerodha Varsity", u: "https://zerodha.com/varsity" }] },
  ];
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-[#ddd]">Recession proof your career</h4>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.title} className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
            <p className="font-semibold text-[#eee]">{c.title}</p>
            <p className="mt-1 text-xs text-[#aaa]">{c.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.links.map((lnk) => (
                <ExternalLink
                  key={lnk.u}
                  platformName={lnk.l}
                  url={lnk.u}
                  className="rounded border border-white/10 px-2 py-1 text-[11px] text-[#bbb] hover:border-white/40"
                >
                  {lnk.l}
                </ExternalLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoldCalculator() {
  const [amount, setAmount] = useState(100000);
  const [alloc, setAlloc] = useState(10);
  const inrPerGram = 6200;
  const recommended = (amount * alloc) / 100;
  const grams = recommended / inrPerGram;
  return (
    <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#111] p-4">
      <h4 className="text-sm font-semibold text-zinc-200">How much gold should you own?</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-zinc-400">
          My total savings/investments are:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            className="mt-1 w-full rounded border border-white/10 bg-[#0d0d0d] px-2 py-1.5 text-zinc-200"
          />
        </label>
        <label className="text-xs text-zinc-400">
          Gold allocation % (experts suggest 5-10%)
          <input
            type="range"
            min={0}
            max={25}
            value={alloc}
            onChange={(e) => setAlloc(Number(e.target.value))}
            className="mt-2 w-full accent-[#FFFFFF]"
          />
          <div className="mt-1 text-zinc-300">{alloc}%</div>
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">
          Recommended gold value: <span className="font-semibold text-zinc-100">₹{recommended.toFixed(0)}</span>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">
          Equivalent in grams: <span className="font-semibold text-zinc-100">{grams.toFixed(2)}g</span>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">
          Equivalent SGB units: <span className="font-semibold text-zinc-100">{Math.max(1, Math.round(grams)).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

function HomeLoanCalculator({ rate }: { rate: number }) {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(20);
  const loan = propertyValue * (1 - downPct / 100);
  const n = years * 12;
  const r = rate / 1200;
  const emi = r > 0 ? (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1) : loan / n;
  const total = emi * n;
  const interest = total - loan;
  return (
    <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#111] p-4">
      <h4 className="text-sm font-semibold text-zinc-200">Home Loan Calculator</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-zinc-400">
          Property Value
          <input type="number" value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value || 0))} className="mt-1 w-full rounded border border-white/10 bg-[#0d0d0d] px-2 py-1.5 text-zinc-200" />
        </label>
        <label className="text-xs text-zinc-400">
          Down Payment %
          <input type="range" min={10} max={40} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="mt-2 w-full accent-[#FFFFFF]" />
          <div className="mt-1 text-zinc-300">{downPct}%</div>
        </label>
        <label className="text-xs text-zinc-400">
          Loan Tenure
          <select value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-1 w-full rounded border border-white/10 bg-[#0d0d0d] px-2 py-1.5 text-zinc-200">
            <option value={10}>10 years</option>
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={30}>30 years</option>
          </select>
        </label>
        <div className="text-xs text-zinc-400">
          Current Rate
          <div className="mt-1 rounded border border-white/10 bg-[#0d0d0d] px-2 py-1.5 text-zinc-200">{rate.toFixed(2)}%</div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">Loan amount: <span className="font-semibold text-zinc-100">₹{loan.toFixed(0)}</span></div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">Monthly EMI: <span className="font-semibold text-zinc-100">₹{emi.toFixed(0)}</span></div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">Total interest: <span className="font-semibold text-zinc-100">₹{interest.toFixed(0)}</span></div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3 text-xs text-zinc-300">Total paid: <span className="font-semibold text-zinc-100">₹{total.toFixed(0)}</span></div>
      </div>
    </div>
  );
}

function detectTrend(topicSlug: string, chartRows: ChartRow[]): "rising" | "falling" | "stable" {
  if (chartRows.length < 2) return "stable";
  const a = chartRows[chartRows.length - 1]!;
  const b = chartRows[chartRows.length - 2]!;
  const keyBySlug: Record<string, string> = {
    unemployment: "u3",
    "interest-rates": "fed",
    housing: "mort30",
    inflation: "cpiYoy",
    "stock-market": "sp500",
    gold: "gold",
  };
  const key = keyBySlug[topicSlug];
  if (!key) return "stable";
  const cur = typeof a[key] === "number" ? (a[key] as number) : null;
  const prev = typeof b[key] === "number" ? (b[key] as number) : null;
  if (cur == null || prev == null) return "stable";
  if (cur > prev) return "rising";
  if (cur < prev) return "falling";
  return "stable";
}

function currentPrimaryValue(topicSlug: string, kpis: KpiMetric[]): number | null {
  const keyBySlug: Record<string, string> = {
    unemployment: "u3",
    "interest-rates": "fed",
    housing: "mort30",
    inflation: "cpiYoy",
    "stock-market": "sp500",
    gold: "gold",
  };
  const key = keyBySlug[topicSlug];
  const k = kpis.find((x) => x.key === key) ?? kpis[0];
  return k?.value ?? null;
}

export function ActionPanel({ topicSlug, chartRows, kpis }: ActionPanelProps) {
  const regime = useRegimeStatus();

  const config = useMemo(() => {
    const currentRegime = regime?.regime ?? "Goldilocks";
    const trend = detectTrend(topicSlug, chartRows);
    const value = currentPrimaryValue(topicSlug, kpis);
    return getActionPanelConfig(topicSlug, { currentRegime, trend, value });
  }, [topicSlug, regime, chartRows, kpis]);

  const [showAll, setShowAll] = useState(false);
  if (!config) return null;

  const shownPlatforms = showAll ? config.platforms : config.platforms.slice(0, 4);
  const currentGuide = config.guides[0];

  return (
    <section className="mt-10 rounded-2xl border border-[#222222] border-t-2 border-t-[#FFFFFF] bg-[#0d0d0d] p-8">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-[#FFFFFF]">
        What can you do about this?
      </p>

      <h3 className="text-xl font-semibold text-zinc-100">{config.title}</h3>
      {currentGuide ? <div className="mt-4"><GuideBox guide={currentGuide} /></div> : null}

      <div className="mt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[2px] text-[#FFFFFF]">Action links</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shownPlatforms.map((p, index) => (
            <PlatformCard key={p.name} p={p} index={index} />
          ))}
        </div>
        {config.platforms.length > 4 ? (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 rounded-md border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.04]"
          >
            {showAll ? "Show fewer platforms" : "Show more platforms"}
          </button>
        ) : null}
      </div>

      {config.showBeginnerGuide ? <div className="mt-6"><BeginnerStocks /></div> : null}
      {config.showSkills ? <SkillCards /> : null}
      {config.showCalculator && topicSlug === "gold" ? <GoldCalculator /> : null}
      {config.showCalculator && topicSlug === "housing" ? (
        <HomeLoanCalculator rate={Math.max(0.1, currentPrimaryValue(topicSlug, kpis) ?? 8)} />
      ) : null}

      <p className="mt-6 text-xs text-zinc-500">
        Zemen does not endorse or have partnerships with any of the platforms listed. These are independent services. Always do your own research before investing or applying.
      </p>
    </section>
  );
}

