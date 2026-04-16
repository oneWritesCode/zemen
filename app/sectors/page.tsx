import Link from "next/link";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { SECTOR_BY_ID, SECTORS, type SectorId } from "@/lib/sectors/sector-config";
import { TOP_3_SECTORS_FOR_REGIME, getSectorFit } from "@/lib/sectors/regime-sector";
import { getAllSectorOverviewData } from "@/lib/sectors/yahoo-etf";
import { SectorSparkline } from "@/components/sectors/sector-sparkline";

export const dynamic = "force-dynamic";

function riskDotColor(risk: "Low" | "Medium" | "High") {
  if (risk === "Low") return "#22c55e";
  if (risk === "Medium") return "#fbbf24";
  return "#ef4444";
}

function formatSignedPct(p: number | null) {
  if (p == null || !Number.isFinite(p)) return "Awaiting data";
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

  const latestUpdatedIso =
    Object.values(data)
      .map((d) => d.updatedAtIso)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;
  const minAgo = minutesAgo(latestUpdatedIso);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-28">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-7 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#FFD000]">📊 Sectors & Opportunities</div>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Sectors & Opportunities</h1>
              <p className="mt-3 max-w-2xl text-zinc-300 text-lg leading-relaxed">
                Discover where smart money is moving — and which companies are leading the way
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-sm text-zinc-400">
                Current regime:{" "}
                <span style={{ color: regimeMeta.color }} className="font-semibold">
                  {regimeMeta.label}
                </span>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                Confidence: {analysis.current.confidencePct.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            Based on the current <span style={{ color: regimeMeta.color }} className="font-semibold">{regimeMeta.shortLabel}</span>{" "}
            regime, historically these sectors tend to perform best:{" "}
            <span className="text-zinc-200 font-medium">{top3Names.join(", ")}</span>
          </div>

          {top3.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {top3.map((id: SectorId) => {
                const s = SECTOR_BY_ID[id]!;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center rounded-full bg-[#FFD000]/15 px-3 py-1 text-sm font-semibold text-[#FFD000] border border-[#FFD000]/25"
                  >
                    {s.emoji} {s.name}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector) => {
            const d = data[sector.id];
            const fit = getSectorFit(regime, sector.id);
            const risk = sector.riskLevelByRegime[regime] ?? "Medium";

            const fitBadgeClass =
              fit === "HOT"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : fit === "NEUTRAL"
                  ? "bg-[#FFD000]/15 border-[#FFD000]/30 text-[#FFD000]"
                  : "bg-zinc-700/30 border-zinc-600/50 text-white";

            return (
              <div
                key={sector.id}
                className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-5 transition hover:border-[#FFD000]/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-3xl">{sector.emoji}</div>
                    <h2 className="mt-1 text-xl font-bold">{sector.name}</h2>
                  </div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      fitBadgeClass,
                    ].join(" ")}
                  >
                    {fit}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-zinc-300 font-semibold">What is this sector?</div>
                  <div className="mt-1 text-xs text-zinc-500 max-w-[22ch]">{sector.plainEnglish}</div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-semibold text-zinc-200">
                    YTD:{" "}
                    <span
                      style={{
                        color: d?.ytdReturnPct != null ? (d.ytdReturnPct >= 0 ? "#22c55e" : "#ef4444") : "#9ca3af",
                      }}
                    >
                      {formatSignedPct(d?.ytdReturnPct ?? null)}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <SectorSparkline
                    values={d?.sparkline ?? []}
                    dates={d?.sparklineDates ?? []}
                    color={sector.color}
                  />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="text-sm text-zinc-200">
                    <span className="font-semibold text-zinc-100">Why now? </span>
                    {sector.whyNowByRegime[regime] ?? "Sector conditions are evolving with the macro cycle."}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-500">Risk level</div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: riskDotColor(risk) }}
                        aria-label={`Risk ${risk}`}
                      />
                      <span className="text-xs font-semibold text-zinc-200">{risk}</span>
                    </div>
                  </div>

                  <Link
                    href={`/sectors/${sector.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFD000] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffdf52]"
                  >
                    Explore Sector <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#0a0a0a]">
        <div className="mx-auto max-w-6xl px-4 py-3 text-[11px] text-zinc-500">
          Zemen Sectors &amp; Opportunities is for educational and informational purposes only. Nothing on this page constitutes financial
          advice, investment recommendations, or an offer to buy or sell securities. Always do your own research and consult a qualified
          financial advisor before investing. Past performance does not guarantee future results.
          {minAgo != null ? <span className="ml-3 text-zinc-600">Last updated: {minAgo} minutes ago</span> : null}
        </div>
      </div>
    </div>
  );
}

