import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Monitor, 
  HeartPulse, 
  Landmark, 
  Zap, 
  ShoppingCart, 
  ShoppingBag, 
  Factory, 
  Home, 
  Lightbulb, 
  Mountain, 
  Rocket,
  Activity
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { SECTOR_BY_ID, type SectorId } from "@/lib/sectors/sector-config";
import { getSectorFit } from "@/lib/sectors/regime-sector";
import { getSectorDetailData } from "@/lib/sectors/yahoo-etf";
import { SectorPerformanceChart } from "@/components/sectors/sector-performance-chart";
import { CompanyLogo } from "@/components/CompanyLogo";

import { BackButton } from "@/components/ui/back-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

const SECTOR_ICONS: Record<string, React.ElementType> = {
  technology: Monitor,
  healthcare: HeartPulse,
  financials: Landmark,
  energy: Zap,
  "consumer-staples": ShoppingCart,
  "consumer-discretionary": ShoppingBag,
  industrials: Factory,
  "real-estate": Home,
  utilities: Lightbulb,
  materials: Mountain,
  "emerging-tech": Rocket,
};

function formatSignedPct(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "Awaiting data";
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(2)}%`;
}

function volatilityText(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "Awaiting data";
  return `${p.toFixed(2)}%`;
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ sectorId: string }>;
}) {
  const { sectorId } = await params;
  if (!SECTOR_BY_ID[sectorId as SectorId]) notFound();

  const sector = SECTOR_BY_ID[sectorId as SectorId]!;

  const analysis = await getRegimeAnalysis();
  const regime = analysis.current.regime;
  const regimeMeta = REGIME_BY_ID[regime];

  const fit = getSectorFit(regime, sector.id);
  const detail = await getSectorDetailData(sector.id);

  const Icon = SECTOR_ICONS[sector.id] ?? Activity;
  const whyNow = sector.whyNowByRegime[regime] ?? "Sector conditions are evolving with the macro cycle.";

  const topBadgeClass =
    fit === "HOT"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
      : fit === "NEUTRAL"
        ? "bg-[#FFFFFF]/15 border-[#FFFFFF]/30 text-[#FFFFFF]"
        : "bg-zinc-700/30 border-zinc-600/50 text-white";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-28">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sectors', href: '/sectors' },
            { label: sector.name, href: null }
          ]} 
        />
        <BackButton href="/sectors" label="All Sectors" />

        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-7 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-3xl">
                <Icon className="w-10 h-10" style={{ color: sector.color }} />
              </div>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{sector.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={["inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", topBadgeClass].join(" ")}>
                  {fit} Regime fit
                </span>
                <span className="text-xs text-zinc-500">
                  Current regime:{" "}
                  <span style={{ color: regimeMeta.color }} className="font-semibold">
                    {regimeMeta.label}
                  </span>
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-zinc-300 leading-relaxed">
                In a <span style={{ color: regimeMeta.color }} className="font-semibold">{regimeMeta.label}</span> environment,{" "}
                <span className="font-semibold text-zinc-100">{sector.name}</span> typically {fit === "HOT" ? "outperforms" : fit === "COLD" ? "struggles" : "performs in a mixed way"}{" "}
                because {whyNow}
              </p>
            </div>

            <div className="md:text-right">
              <div className="text-sm text-zinc-400">Explore more</div>
              <Link href="/sectors" className="mt-2 inline-flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-[#FFFFFF]/30 transition">
                ← Back to sectors
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">YTD Return (vs S&P 500)</div>
            <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {formatSignedPct(detail.metrics.ytdReturnPct)}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              S&P: {formatSignedPct(detail.metrics.ytdSpReturnPct)} · Diff: {formatSignedPct(detail.metrics.ytdReturnVsSpPct)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">1 Year Return</div>
            <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {formatSignedPct(detail.metrics.return1yPct)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">3 Year Return</div>
            <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">
              {formatSignedPct(detail.metrics.return3yPct)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Volatility (annualized)</div>
            <div className="mt-2 font-mono text-2xl font-semibold tabular-nums">{volatilityText(detail.metrics.volatilityAnnualizedPct)}</div>
          </div>
        </div>

        {!detail.success ? (
          <div className="mt-4 rounded-xl border border-white/30 bg-amber-950/30 p-3 text-sm text-amber-100">
            Live price feed is temporarily unavailable for {sector.ticker}. Showing educational structure with safe fallbacks.
          </div>
        ) : null}

        <div className="mt-8">
          <SectorPerformanceChart
            sectorMonthly={detail.sectorMonthly}
            spMonthly={detail.spMonthly}
            sectorName={sector.name}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111111] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">What makes this sector go up or down?</h2>
          <p className="mt-2 text-zinc-400">
            Key drivers move the sector at different speeds depending on the economic regime.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sector.factors.map((f) => (
              <div key={f.name} className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-zinc-100">{f.name}</div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      f.direction === "up" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300",
                    ].join(" ")}
                  >
                    {f.direction === "up" ? "↑" : "↓"} {f.impactLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{f.explanation}</p>
                <div className="mt-3 text-xs text-zinc-500">Impact speed: {f.speed}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder sections to be expanded next iteration */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111111] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">Notable companies in this sector</h2>
          <p className="mt-2 text-zinc-400">
            A sample of major companies operating in this space.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {sector.companies.map((c) => (
              <div key={c.ticker} className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] pl-1 pr-4 py-1 transition-colors hover:bg-white/[0.04]">
                <CompanyLogo ticker={c.ticker} name={c.ticker} size={28} />
                <span className="text-sm font-medium text-zinc-200">
                  {c.ticker}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed disclaimer banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-4 py-3 text-[11px] text-zinc-500">
          Zemen Sectors &amp; Opportunities is for educational and informational purposes only. Nothing on this page constitutes financial advice, investment recommendations, or an offer to buy or sell securities. Always do your own research and consult a qualified financial advisor before investing. Past performance does not guarantee future results.
        </div>
      </div>
    </div>
  );
}

