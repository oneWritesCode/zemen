import { formatKpiDelta, formatMetricValue } from "@/lib/format-metric";
import type { KpiMetric } from "@/lib/fred/get-topic-dataset";

export function KpiRow({ kpis }: { kpis: KpiMetric[] }) {
  if (kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => {
        const { text, positive } = formatKpiDelta(k.value, k.delta1y, k.unit);
        const deltaClass =
          positive === null
            ? "text-zinc-500"
            : positive
              ? "text-emerald-400/90"
              : "text-red-400/90";
        return (
          <div
            key={k.key}
            className="rounded-2xl border border-white/[0.08] border-l-[3px] bg-[#12121a] px-5 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            style={{ borderLeftColor: k.color }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              {k.label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white">
              {formatMetricValue(k.value, k.unit)}
            </p>
            <p className={`mt-1 text-sm ${deltaClass}`}>{text}</p>
          </div>
        );
      })}
    </div>
  );
}
