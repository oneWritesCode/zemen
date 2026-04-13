import type { ParsedObservation } from "./types";

export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function lastDayOfMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0));
  const dd = String(last.getUTCDate()).padStart(2, "0");
  return `${ym}-${dd}`;
}

/** Map YYYY-MM -> last known value in that month (by calendar date). */
export function monthlyLastByPeriod(
  observations: ParsedObservation[],
): Map<string, number> {
  const byPeriod = new Map<string, { date: string; value: number }>();
  for (const obs of observations) {
    const period = toYearMonth(obs.date);
    const prev = byPeriod.get(period);
    if (!prev || obs.date > prev.date) {
      byPeriod.set(period, { date: obs.date, value: obs.value });
    }
  }
  const out = new Map<string, number>();
  for (const [period, { value }] of byPeriod) out.set(period, value);
  return out;
}

export function sortedUnionPeriods(maps: Map<string, unknown>[]): string[] {
  const s = new Set<string>();
  for (const m of maps) for (const k of m.keys()) s.add(k);
  return [...s].sort();
}
