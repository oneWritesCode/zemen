import { formatKpiDelta, formatMetricValue } from "@/lib/format-metric";
import type { KpiMetric } from "@/lib/fred/get-topic-dataset";
import { getFreshnessLabel } from "@/lib/freshness";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function KpiRow({ kpis }: { kpis: KpiMetric[] }) {
  if (kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => {
        const { text, positive } = formatKpiDelta(k.value, k.delta1y, k.unit);
        const deltaColor =
          positive === null
            ? "text-zinc-500"
            : positive
              ? "text-emerald-400"
              : "text-red-400";
        const DeltaIcon =
          positive === null ? Minus : positive ? TrendingUp : TrendingDown;
        const freshness = getFreshnessLabel(k.updatedAt);
        const freshnessClass =
          freshness.tone === "green"
            ? "text-emerald-400/70"
            : freshness.tone === "yellow"
              ? "text-amber-400/70"
              : freshness.tone === "red"
                ? "text-red-400/70"
                : "text-zinc-600";
        return (
          <div
            key={k.key}
            className="relative rounded-2xl border border-white/[0.07] bg-[#0e0e10] px-5 py-4 overflow-hidden transition hover:border-white/[0.12]"
            style={{ borderLeftColor: k.color, borderLeftWidth: 2 }}
          >
            {/* Subtle top highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 mb-2">
              {k.label}
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums text-white mb-1">
              {formatMetricValue(k.value, k.unit)}
            </p>
            <div className={`flex items-center gap-1 text-sm ${deltaColor}`}>
              <DeltaIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{text}</span>
            </div>
            <p className={`mt-1.5 text-[11px] ${freshnessClass}`}>{freshness.text}</p>
          </div>
        );
      })}
    </div>
  );
}
