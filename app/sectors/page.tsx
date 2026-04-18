import Link from "next/link";
import {
  Cpu,
  HeartPulse,
  Landmark,
  Zap,
  ShoppingCart,
  ShoppingBag,
  Factory,
  Building2,
  Lightbulb,
  Layers,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Signal,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { SECTOR_BY_ID, SECTORS, type SectorId } from "@/lib/sectors/sector-config";
import { TOP_3_SECTORS_FOR_REGIME, getSectorFit } from "@/lib/sectors/regime-sector";
import { getAllSectorOverviewData } from "@/lib/sectors/yahoo-etf";
import { SectorSparkline } from "@/components/sectors/sector-sparkline";

export const dynamic = "force-dynamic";

const SECTOR_ICONS: Record<string, React.ElementType> = {
  technology: Cpu,
  healthcare: HeartPulse,
  financials: Landmark,
  energy: Zap,
  "consumer-staples": ShoppingCart,
  "consumer-discretionary": ShoppingBag,
  industrials: Factory,
  "real-estate": Building2,
  utilities: Lightbulb,
  materials: Layers,
  "emerging-tech": Activity,
};

function riskDotColor(risk: "Low" | "Medium" | "High") {
  if (risk === "Low") return "#22c55e";
  if (risk === "Medium") return "#f59e0b";
  return "#ef4444";
}

function riskBgClass(risk: "Low" | "Medium" | "High") {
  if (risk === "Low") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (risk === "Medium") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

function formatSignedPct(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "—";
  const sign = p >= 0 ? "+" : "";
  return `${sign}${p.toFixed(2)}%`;
}

function minutesAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(ms)) return null;
  return Math.max(0, Math.floor((Date.now() - ms) / (1000 * 60)));
}

export default async function SectorsOverviewPage() {
  const analysis = await getRegimeAnalysis();
  const regime = analysis.current.regime;
  const regimeMeta = REGIME_BY_ID[regime];

  const top3 = TOP_3_SECTORS_FOR_REGIME[regime] ?? [];
  const top3Names = top3.map((id) => SECTOR_BY_ID[id]?.name ?? id);

  const data = await getAllSectorOverviewData();
  const failedCount = Object.values(data).filter((d) => !d.success).length;

  const latestUpdatedIso =
    Object.values(data)
      .map((d) => d.updatedAtIso)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;
  const minAgo = minutesAgo(latestUpdatedIso);

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 pb-28">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              <Signal className="h-2.5 w-2.5" />
              Live Market Data
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Sectors &amp; Opportunities
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400 text-base leading-relaxed">
            Discover where smart money is moving — and which areas lead the current macro regime.
          </p>
        </div>

        {/* Regime context card */}
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-[#0e0e10] overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <div className="flex-1 p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-1">Current Regime</p>
              <p className="text-xl font-bold mb-1" style={{ color: regimeMeta.color }}>
                {regimeMeta.label}
              </p>
              <p className="text-sm text-zinc-500">
                Confidence: <span className="text-zinc-300 font-medium">{analysis.current.confidencePct.toFixed(1)}%</span>
              </p>
              {top3Names.length > 0 && (
                <p className="mt-3 text-sm text-zinc-400">
                  Historically strong: <span className="text-zinc-200 font-medium">{top3Names.join(", ")}</span>
                </p>
              )}
            </div>

            {top3.length > 0 && (
              <div className="sm:border-l border-t sm:border-t-0 border-white/[0.06] px-6 py-5 sm:pl-7 flex flex-wrap sm:flex-col gap-2 items-start justify-start sm:justify-center">
                <p className="w-full text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600 mb-0.5">Top picks</p>
                {top3.map((id: SectorId) => {
                  const s = SECTOR_BY_ID[id]!;
                  const Icon = SECTOR_ICONS[id] ?? Activity;
                  return (
                    <Link
                      href={`/sectors/${id}`}
                      key={id}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.07] px-3 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.09] hover:text-white transition"
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-400" />
                      {s.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {failedCount > 0 ? (
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-sm text-amber-300/80">
            Live market data is partially unavailable ({failedCount}/{SECTORS.length} sectors). Cards with missing data show safe fallbacks.
          </div>
        ) : null}

        {/* Sector grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => {
            const d = data[sector.id];
            const fit = getSectorFit(regime, sector.id);
            const risk = sector.riskLevelByRegime[regime] ?? "Medium";
            const ytd = d?.ytdReturnPct ?? null;
            const Icon = SECTOR_ICONS[sector.id] ?? Activity;

            const fitBadge =
              fit === "HOT"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : fit === "NEUTRAL"
                  ? "bg-white/[0.05] border-white/[0.08] text-zinc-300"
                  : "bg-zinc-900/60 border-zinc-700/40 text-zinc-500";

            return (
              <div
                key={sector.id}
                className="group flex flex-col rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-5 transition-all hover:border-white/[0.12] hover:bg-[#111114]"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${sector.color}18`, border: `1px solid ${sector.color}25` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: sector.color }} />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-white leading-tight">{sector.name}</h2>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{sector.ticker}</p>
                    </div>
                  </div>
                  <span
                    className={[
                      "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide",
                      fitBadge,
                    ].join(" ")}
                  >
                    {fit}
                  </span>
                </div>

                {/* Plain English */}
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{sector.plainEnglish}</p>

                {/* Sparkline */}
                <div className="mb-4 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.04] p-2">
                  <SectorSparkline
                    values={d?.sparkline ?? []}
                    dates={d?.sparklineDates ?? []}
                    color={sector.color}
                  />
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600 mb-0.5">YTD</p>
                    <p
                      className="text-sm font-bold font-mono tabular-nums"
                      style={{
                        color: ytd != null
                          ? ytd >= 0 ? "#22c55e" : "#ef4444"
                          : "#71717a",
                      }}
                    >
                      {formatSignedPct(ytd)}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 ${riskBgClass(risk)}`}>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: riskDotColor(risk) }} />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600 mb-0.5">Risk</p>
                      <p className="text-sm font-bold">{risk}</p>
                    </div>
                  </div>
                </div>

                {/* Why now */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-5 line-clamp-3">
                  <span className="font-semibold text-zinc-300">Now: </span>
                  {sector.whyNowByRegime[regime] ?? "Sector conditions are evolving with the macro cycle."}
                </p>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    href={`/sectors/${sector.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[13px] font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white group-hover:border-white/[0.12]"
                  >
                    Explore Sector
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.05] bg-[#080809]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            For educational and informational purposes only. Not financial advice. Past performance does not guarantee future results.
          </p>
          {minAgo != null && (
            <span className="shrink-0 text-[10px] text-zinc-700">
              Updated {minAgo}m ago
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
