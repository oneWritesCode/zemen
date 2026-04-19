import Link from "next/link";
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
  Activity,
  Signal,
} from "lucide-react";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { SECTOR_BY_ID, SECTORS, type SectorId } from "@/lib/sectors/sector-config";
import { TOP_3_SECTORS_FOR_REGIME } from "@/lib/sectors/regime-sector";
import { getAllSectorOverviewData } from "@/lib/sectors/yahoo-etf";
import { SectorCard } from "@/components/sectors/sector-card";
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
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Sectors', href: null }
          ]} 
        />

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
          <div className="mb-6 rounded-xl border border-white/20 bg-amber-950/20 p-3 text-sm text-amber-300/80">
            Live market data is partially unavailable ({failedCount}/{SECTORS.length} sectors). Cards with missing data show safe fallbacks.
          </div>
        ) : null}

        {/* Sector grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector, index) => (
            <SectorCard key={sector.id} sector={sector} regime={regime} index={index} />
          ))}
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
