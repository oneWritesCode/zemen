import { fetchFredObservations } from "@/lib/fred/client";
import {
  lastDayOfMonth,
  monthlyLastByPeriod,
  sortedUnionPeriods,
} from "@/lib/fred/monthly";

import { addMonthsYm } from "./dates";

export const REGIME_FEATURE_LABELS = [
  "Fed funds rate (%)",
  "CPI YoY (%)",
  "Unemployment (%)",
  "Real GDP YoY (%)",
  "HY OAS (%)",
] as const;

export type RegimeFeatureRow = {
  period: string;
  fedFunds: number;
  cpiYoY: number;
  unrate: number;
  rgdpYoY: number;
  hySpread: number;
};

/** Last known real GDP level at or before each calendar month-end. */
function gdpLevelByMonth(
  periods: string[],
  gdpObs: { date: string; value: number }[],
): Map<string, number> {
  const sorted = [...gdpObs].sort((a, b) => a.date.localeCompare(b.date));
  const out = new Map<string, number>();
  let i = 0;
  let last: number | null = null;
  for (const p of periods) {
    const end = lastDayOfMonth(p);
    while (i < sorted.length && sorted[i]!.date <= end) {
      last = sorted[i]!.value;
      i++;
    }
    if (last !== null) out.set(p, last);
  }
  return out;
}

export async function buildRegimeFeatureRows(
  observationStart = "1995-01-01",
): Promise<RegimeFeatureRow[]> {
  const [fed, cpi, un, gdp, hy] = await Promise.all([
    fetchFredObservations({
      seriesId: "FEDFUNDS",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "CPIAUCSL",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "UNRATE",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "GDPC1",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "BAMLH0A0HYM2",
      observationStart,
    }),
  ]);

  const mFed = monthlyLastByPeriod(fed);
  const mCpi = monthlyLastByPeriod(cpi);
  const mUn = monthlyLastByPeriod(un);
  const mHy = monthlyLastByPeriod(hy);

  const periods = sortedUnionPeriods([mFed, mCpi, mUn, mHy]);
  const gdpLevels = gdpLevelByMonth(periods, gdp);

  const rows: RegimeFeatureRow[] = [];

  for (const p of periods) {
    const fedFunds = mFed.get(p);
    const cpiNow = mCpi.get(p);
    const cpiLag = mCpi.get(addMonthsYm(p, -12));
    const unrate = mUn.get(p);
    const hySpread = mHy.get(p);
    const gNow = gdpLevels.get(p);
    const gLag = gdpLevels.get(addMonthsYm(p, -12));

    if (
      fedFunds === undefined ||
      cpiNow === undefined ||
      cpiLag === undefined ||
      cpiLag === 0 ||
      unrate === undefined ||
      hySpread === undefined ||
      gNow === undefined ||
      gLag === undefined ||
      gLag === 0
    ) {
      continue;
    }

    const cpiYoY = ((cpiNow / cpiLag - 1) * 100);
    const rgdpYoY = ((gNow / gLag - 1) * 100);

    rows.push({
      period: p,
      fedFunds,
      cpiYoY,
      unrate,
      rgdpYoY,
      hySpread,
    });
  }

  return rows;
}

export function rowsToMatrix(rows: RegimeFeatureRow[]): number[][] {
  return rows.map((r) => [
    r.fedFunds,
    r.cpiYoY,
    r.unrate,
    r.rgdpYoY,
    r.hySpread,
  ]);
}
