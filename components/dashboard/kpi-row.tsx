import { formatKpiDelta } from "@/lib/format-metric";
import type { KpiMetric } from "@/lib/fred/get-topic-dataset";
import { getFreshnessLabel } from "@/lib/freshness";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animations";
import { Skeleton } from "@/components/ui/skeleton";
import type { SeriesUnit } from "@/lib/fred/topics-config";

interface MetricCardProps {
  label: string;
  value?: number | null;
  unit?: SeriesUnit;
  delta1y?: number | null;
  updatedAt?: string | null;
  isAwaiting?: boolean;
  index: number;
}

function MetricCard({
  label,
  value,
  unit = "percent",
  delta1y,
  updatedAt,
  isAwaiting = false,
  index,
}: MetricCardProps) {
  const { text, positive } = formatKpiDelta(value ?? null, delta1y ?? null, unit);
  const deltaColor =
    positive === null
      ? "text-[#888]"
      : positive
        ? "text-[#22c55e]"
        : "text-[#ef4444]";
  const freshness = getFreshnessLabel(updatedAt ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      className="relative flex min-h-[120px] flex-col gap-2 overflow-hidden rounded-[12px] border border-[#111] bg-[#0a0a0a] px-6 py-5 transition hover:border-white/[0.12] will-change-transform"
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="text-[10px] font-semibold uppercase tracking-[2px] text-[#999]">
        {label}
      </div>

      <div
        className={`text-[28px] font-bold tracking-[-0.5px] leading-tight ${isAwaiting ? "text-[#666]" : "text-white"}`}
      >
        {isAwaiting ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-4/5" />
            <span className="text-xs font-normal text-[#666]">No data</span>
          </div>
        ) : (
          <AnimatedNumber
            value={value ?? 0}
            suffix={unit === "percent" ? "%" : unit === "usd" ? "$" : ""}
          />
        )}
      </div>

      {!isAwaiting && (
        <div className={`flex items-center gap-1 text-[12px] font-medium ${deltaColor}`}>
          <span className="text-sm">{positive === null ? "" : positive ? "↗" : "↘"}</span>
          <span>{text}</span>
        </div>
      )}

      <div className="mt-auto text-[10px] text-[#888] font-medium">
        Updated {freshness.text}
      </div>
    </motion.div>
  );
}

export function KpiRow({ kpis }: { kpis: KpiMetric[] }) {
  if (kpis.length === 0) return null;

  return (
    <div className="metrics-grid">
      {kpis.map((k, index) => (
        <MetricCard
          key={k.key}
          label={k.label}
          value={k.value}
          unit={k.unit}
          delta1y={k.delta1y}
          updatedAt={k.updatedAt}
          index={index}
          isAwaiting={k.value === null || k.value === undefined}
        />
      ))}
    </div>
  );
}
