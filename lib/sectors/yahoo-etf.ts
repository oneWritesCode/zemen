import type { ParsedObservation } from "@/lib/fred/types";
import { fetchYahooDailyCloseSeries } from "@/lib/market/yahoo";
import { monthlyLastByPeriod, lastDayOfMonth } from "@/lib/fred/monthly";
import { SECTOR_BY_ID, type SectorId } from "./sector-config";
import { SECTOR_IDS } from "./sector-config";

type TtlEntry<T> = { expiresAt: number; value: T };
const cache = new Map<string, TtlEntry<unknown>>();

function nowMs() {
  return Date.now();
}

async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const existing = cache.get(key);
  if (existing && existing.expiresAt > nowMs()) return existing.value as T;
  const value = await fn();
  cache.set(key, { expiresAt: nowMs() + ttlMs, value });
  return value;
}

function firstIndexAtOrAfter(rows: ParsedObservation[], iso: string): number {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]!.date >= iso) return i;
  }
  return -1;
}

function computeReturnPct(start: number, end: number): number | null {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0) return null;
  return ((end / start - 1) * 100);
}

export type SectorOverviewData = {
  sectorId: SectorId;
  ticker: string;
  ytdReturnPct: number | null;
  sparkline: number[];
  sparklineDates: string[]; // YYYY-MM-DD (month-end)
  updatedAtIso: string | null; // last close date
};

export async function getSectorOverviewData(
  sectorId: SectorId,
): Promise<SectorOverviewData> {
  const sector = SECTOR_BY_ID[sectorId];
  const key = `overview:${sectorId}`;
  return cached(key, 3600_000, async () => {
    // Pull ~18 months so we can always compute YTD + last 12 months sparkline.
    const now = new Date();
    const earliest = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    earliest.setUTCDate(earliest.getUTCDate() - 550);
    const startIso = earliest.toISOString().slice(0, 10);

    const daily =
      (await fetchYahooDailyCloseSeries({ ticker: sector.ticker, start: startIso }).catch(() => [])) ?? [];
    const updatedAtIso = daily.at(-1)?.date ?? null;

    // YTD: first observation on/after Jan 1.
    const ytdStartIso = `${now.getUTCFullYear()}-01-01`;
    const i = firstIndexAtOrAfter(daily, ytdStartIso);
    const startVal = i >= 0 ? daily[i]!.value : daily[0]?.value;
    const endVal = daily.at(-1)?.value ?? null;
    const ytdReturnPct =
      startVal != null && endVal != null ? computeReturnPct(startVal, endVal) : null;

    const monthlyMap = monthlyLastByPeriod(daily);
    const periods = [...monthlyMap.keys()].sort();
    const last12Periods = periods.slice(-12);
    const sparklineDates = last12Periods.map((p) => lastDayOfMonth(p));
    const sparkline = last12Periods.map((p) => monthlyMap.get(p) ?? 0);

    return {
      sectorId,
      ticker: sector.ticker,
      ytdReturnPct,
      sparkline,
      sparklineDates,
      updatedAtIso,
    };
  });
}

export async function getAllSectorOverviewData(): Promise<Record<SectorId, SectorOverviewData>> {
  const entries = await Promise.all(SECTOR_IDS.map((id) => getSectorOverviewData(id)));
  return Object.fromEntries(entries.map((d) => [d.sectorId, d])) as Record<SectorId, SectorOverviewData>;
}

export type MonthlyPoint = { dateIso: string; value: number };

export type SectorDetailData = {
  sectorId: SectorId;
  sectorTicker: string;
  sectorMonthly: MonthlyPoint[]; // last 5y monthly end closes
  spMonthly: MonthlyPoint[]; // last 5y monthly end closes
  metrics: {
    ytdReturnPct: number | null;
    ytdReturnVsSpPct: number | null;
    ytdSpReturnPct: number | null;
    return1yPct: number | null;
    return3yPct: number | null;
    volatilityAnnualizedPct: number | null;
  };
  updatedAtIso: string | null;
};

function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, x) => s + x, 0) / values.length;
  const varr = values.reduce((s, x) => s + (x - mean) ** 2, 0) / values.length;
  return Math.sqrt(varr);
}

function pctChangeSeries(rows: ParsedObservation[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < rows.length; i++) {
    const prev = rows[i - 1]!.value;
    const cur = rows[i]!.value;
    if (!Number.isFinite(prev) || !Number.isFinite(cur) || prev === 0) continue;
    out.push(cur / prev - 1);
  }
  return out;
}

function computeYtd(daily: ParsedObservation[]): number | null {
  if (daily.length < 2) return null;
  const now = new Date();
  const ytdStartIso = `${now.getUTCFullYear()}-01-01`;
  const i = firstIndexAtOrAfter(daily, ytdStartIso);
  const startVal = i >= 0 ? daily[i]!.value : daily[0]!.value;
  const endVal = daily.at(-1)!.value;
  return computeReturnPct(startVal, endVal);
}

function computeReturnOverYears(daily: ParsedObservation[], years: number): number | null {
  if (daily.length < 2) return null;
  const endVal = daily.at(-1)!.value;
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCFullYear(d.getUTCFullYear() - years);
  const startIso = d.toISOString().slice(0, 10);
  const i = firstIndexAtOrAfter(daily, startIso);
  const startVal = i >= 0 ? daily[i]!.value : daily[0]!.value;
  return computeReturnPct(startVal, endVal);
}

function computeVolatilityAnnualized(daily: ParsedObservation[]): number | null {
  // Use last ~1 year window.
  if (daily.length < 30) return null;
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - 365);
  const startIso = d.toISOString().slice(0, 10);
  const filtered = daily.filter((r) => r.date >= startIso);
  if (filtered.length < 30) return null;
  const rets = pctChangeSeries(filtered);
  const dailyStd = stddev(rets);
  // Annualize assuming ~252 trading days.
  const ann = dailyStd * Math.sqrt(252);
  return ann * 100;
}

export async function getSectorDetailData(
  sectorId: SectorId,
): Promise<SectorDetailData> {
  const sector = SECTOR_BY_ID[sectorId];
  const cacheKey = `detail:${sectorId}`;
  return cached(cacheKey, 3600_000, async () => {
    const now = new Date();
    const start5y = new Date(Date.UTC(now.getUTCFullYear() - 5, now.getUTCMonth(), now.getUTCDate()));
    const startIso = start5y.toISOString().slice(0, 10);

    const [sectorDaily, spDaily] = await Promise.all([
      fetchYahooDailyCloseSeries({ ticker: sector.ticker, start: startIso }).catch(() => []),
      fetchYahooDailyCloseSeries({ ticker: "^GSPC", start: startIso }).catch(() => []),
    ]);

    const updatedAtIso = sectorDaily.at(-1)?.date ?? spDaily.at(-1)?.date ?? null;

    const sectorMonthlyMap = monthlyLastByPeriod(sectorDaily);
    const sectorPeriods = [...sectorMonthlyMap.keys()].sort().slice(-60); // ~5y
    const sectorMonthly: MonthlyPoint[] = sectorPeriods.map((p) => ({
      dateIso: lastDayOfMonth(p),
      value: sectorMonthlyMap.get(p) ?? 0,
    }));

    const spMonthlyMap = monthlyLastByPeriod(spDaily);
    const spPeriods = [...spMonthlyMap.keys()].sort().slice(-60);
    const spMonthly: MonthlyPoint[] = spPeriods.map((p) => ({
      dateIso: lastDayOfMonth(p),
      value: spMonthlyMap.get(p) ?? 0,
    }));

    const ytdReturnPct = computeYtd(sectorDaily);
    const ytdSpReturnPct = computeYtd(spDaily);
    const ytdReturnVsSpPct =
      ytdReturnPct != null && ytdSpReturnPct != null ? ytdReturnPct - ytdSpReturnPct : null;

    const return1yPct = computeReturnOverYears(sectorDaily, 1);
    const return3yPct = computeReturnOverYears(sectorDaily, 3);
    const volatilityAnnualizedPct = computeVolatilityAnnualized(sectorDaily);

    return {
      sectorId,
      sectorTicker: sector.ticker,
      sectorMonthly,
      spMonthly,
      metrics: {
        ytdReturnPct,
        ytdReturnVsSpPct,
        ytdSpReturnPct,
        return1yPct,
        return3yPct,
        volatilityAnnualizedPct,
      },
      updatedAtIso,
    };
  });
}

