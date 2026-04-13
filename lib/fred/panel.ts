import { fetchFredObservations } from "./client";
import {
  lastDayOfMonth,
  monthlyLastByPeriod,
  sortedUnionPeriods,
} from "./monthly";
import { FRED_SERIES_IDS, FRED_YIELD_CURVE } from "./series";
import type { MacroMonthlyRow, MacroSeriesKey } from "./types";

export type IngestMacroPanelOptions = {
  /** Inclusive lower bound passed to FRED (`YYYY-MM-DD`). */
  observationStart?: string;
};

function buildSpreadMap(
  ten: Map<string, number>,
  two: Map<string, number>,
): Map<string, number> {
  const out = new Map<string, number>();
  const periods = new Set([...ten.keys(), ...two.keys()]);
  for (const p of periods) {
    const a = ten.get(p);
    const b = two.get(p);
    if (a === undefined || b === undefined) continue;
    out.set(p, a - b);
  }
  return out;
}

/**
 * Pulls core macro series from FRED and aligns them to a monthly panel.
 * Daily series (HY OAS) are collapsed to the last observation in each month.
 */
export async function ingestMacroMonthlyPanel(
  options: IngestMacroPanelOptions = {},
): Promise<MacroMonthlyRow[]> {
  const start = options.observationStart ?? "1970-01-01";

  const [
    fedFunds,
    cpi,
    unrate,
    gs10,
    gs2,
    hy,
  ] = await Promise.all([
    fetchFredObservations({
      seriesId: FRED_SERIES_IDS.fedFundsRate,
      observationStart: start,
    }),
    fetchFredObservations({ seriesId: FRED_SERIES_IDS.cpi, observationStart: start }),
    fetchFredObservations({
      seriesId: FRED_SERIES_IDS.unemployment,
      observationStart: start,
    }),
    fetchFredObservations({
      seriesId: FRED_YIELD_CURVE.treasury10y,
      observationStart: start,
    }),
    fetchFredObservations({
      seriesId: FRED_YIELD_CURVE.treasury2y,
      observationStart: start,
    }),
    fetchFredObservations({
      seriesId: FRED_SERIES_IDS.hyOas,
      observationStart: start,
    }),
  ]);

  const mFed = monthlyLastByPeriod(fedFunds);
  const mCpi = monthlyLastByPeriod(cpi);
  const mUn = monthlyLastByPeriod(unrate);
  const m10 = monthlyLastByPeriod(gs10);
  const m2 = monthlyLastByPeriod(gs2);
  const mSpread = buildSpreadMap(m10, m2);
  const mHy = monthlyLastByPeriod(hy);

  const periods = sortedUnionPeriods([mFed, mCpi, mUn, mSpread, mHy]);

  return periods.map((period) => ({
    period,
    fedFundsRate: mFed.get(period) ?? null,
    cpi: mCpi.get(period) ?? null,
    unemployment: mUn.get(period) ?? null,
    yieldSpread10y2y: mSpread.get(period) ?? null,
    hyOas: mHy.get(period) ?? null,
  }));
}

export function macroSeriesKeys(): MacroSeriesKey[] {
  return [
    "fedFundsRate",
    "cpi",
    "unemployment",
    "yieldSpread10y2y",
    "hyOas",
  ];
}

/** For charts/API consumers that want calendar dates instead of `YYYY-MM`. */
export function periodToMonthEndDate(period: string): string {
  return lastDayOfMonth(period);
}
