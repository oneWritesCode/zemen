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
  "Money Supply YoY (%)",
  "Housing Starts (%)",
  "Yield Curve (%)",
  "Consumer Sentiment",
] as const;

export type RegimeFeatureRow = {
  period: string;
  fedFunds: number;
  cpiYoY: number;
  unrate: number;
  rgdpYoY: number;
  m2YoY: number;
  housingYoY: number;
  yieldCurve: number;
  consumerSentiment: number;
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
  observationStart = "2010-01-01",
): Promise<RegimeFeatureRow[]> {
  // Fetch reliable, long-history FRED series
  const [fed, cpi, un, gdp, m2, housing, yield10y, yield2y, sentiment] = await Promise.all([
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
      seriesId: "M2SL",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "HOUST",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "DGS10",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "DGS2",
      observationStart,
    }),
    fetchFredObservations({
      seriesId: "UMCSENT",
      observationStart,
    }),
  ]);

  // Convert to monthly frequency
  const mFed = monthlyLastByPeriod(fed);
  const mCpi = monthlyLastByPeriod(cpi);
  const mUn = monthlyLastByPeriod(un);
  const mM2 = monthlyLastByPeriod(m2);
  const mHousing = monthlyLastByPeriod(housing);
  const mYield10y = monthlyLastByPeriod(yield10y);
  const mYield2y = monthlyLastByPeriod(yield2y);
  const mSentiment = monthlyLastByPeriod(sentiment);

  // Get all periods that have data
  const periods = sortedUnionPeriods([mFed, mCpi, mUn, mM2, mHousing, mYield10y, mYield2y, mSentiment]);
  const gdpLevels = gdpLevelByMonth(periods, gdp);

  const rows: RegimeFeatureRow[] = [];

  for (const p of periods) {
    const fedFunds = mFed.get(p);
    const cpiNow = mCpi.get(p);
    const cpiLag = mCpi.get(addMonthsYm(p, -12));
    const unrate = mUn.get(p);
    const gNow = gdpLevels.get(p);
    const gLag = gdpLevels.get(addMonthsYm(p, -12));
    const m2Now = mM2.get(p);
    const m2Lag = mM2.get(addMonthsYm(p, -12));
    const housingNow = mHousing.get(p);
    const housingLag = mHousing.get(addMonthsYm(p, -12));
    const yield10y = mYield10y.get(p);
    const yield2y = mYield2y.get(p);
    const sentiment = mSentiment.get(p);

    // Skip if any critical data is missing
    if (
      fedFunds === undefined ||
      cpiNow === undefined ||
      cpiLag === undefined ||
      cpiLag === 0 ||
      unrate === undefined ||
      gNow === undefined ||
      gLag === undefined ||
      gLag === 0 ||
      m2Now === undefined ||
      m2Lag === undefined ||
      m2Lag === 0 ||
      housingNow === undefined ||
      housingLag === undefined ||
      housingLag === 0 ||
      yield10y === undefined ||
      yield2y === undefined ||
      sentiment === undefined
    ) {
      continue;
    }

    // Calculate year-over-year changes
    const cpiYoY = ((cpiNow / cpiLag - 1) * 100);
    const rgdpYoY = ((gNow / gLag - 1) * 100);
    const m2YoY = ((m2Now / m2Lag - 1) * 100);
    const housingYoY = ((housingNow / housingLag - 1) * 100);
    const yieldCurve = yield10y - yield2y;

    rows.push({
      period: p,
      fedFunds,
      cpiYoY,
      unrate,
      rgdpYoY,
      m2YoY,
      housingYoY,
      yieldCurve,
      consumerSentiment: sentiment,
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
    r.m2YoY,
    r.housingYoY,
    r.yieldCurve,
    r.consumerSentiment,
  ]);
}
