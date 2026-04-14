import type { SeriesUnit } from "@/lib/fred/topics-config";

export function formatMetricValue(value: number | null, unit: SeriesUnit): string {
  if (value === null || Number.isNaN(value)) return "Awaiting data";
  switch (unit) {
    case "percent":
      return `${value.toFixed(2)}%`;
    case "index":
      return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    case "usd":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value);
    case "points":
      return value.toFixed(2);
    case "billionsUsd":
      return `${value < 0 ? "−$" : "$"}${Math.abs(value).toFixed(1)}bn`;
    default:
      return String(value);
  }
}

export function formatKpiDelta(
  value: number | null,
  delta1y: number | null,
  unit: SeriesUnit,
): { text: string; positive: boolean | null } {
  if (value === null || delta1y === null || Number.isNaN(delta1y)) {
    return { text: "vs 1 yr ago: Awaiting data", positive: null };
  }
  if (unit === "percent" || unit === "points") {
    const sign = delta1y >= 0 ? "+" : "";
    return {
      text: `${sign}${delta1y.toFixed(2)}pp vs 1 yr ago`,
      positive: delta1y >= 0,
    };
  }
  if (unit === "index" || unit === "usd") {
    const sign = delta1y >= 0 ? "+" : "";
    return {
      text: `${sign}${delta1y.toLocaleString("en-US", { maximumFractionDigits: 1 })} vs 1 yr ago`,
      positive: delta1y >= 0,
    };
  }
  if (unit === "billionsUsd") {
    const sign = delta1y >= 0 ? "+" : "";
    return {
      text: `${sign}$${Math.abs(delta1y).toFixed(1)}bn vs 1 yr ago`,
      positive: delta1y >= 0,
    };
  }
  return { text: "vs 1 yr ago: Awaiting data", positive: null };
}
