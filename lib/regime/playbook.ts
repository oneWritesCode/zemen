import { fetchFredObservations } from "@/lib/fred/client";
import { lastDayOfMonth } from "@/lib/fred/monthly";
import type { ParsedObservation } from "@/lib/fred/types";

import type { RegimeId } from "./types";

type MonthRegime = { period: string; regime: RegimeId };

/** Rough modified duration (years) for 10Y par bond — scales yield Δpp → price return %. */
const MOD_DUR_10Y = 8.5;

export type PlaybookAssetRow = {
  key: "sp500" | "gold" | "bonds";
  label: string;
  /** Average total return % (or proxy) over horizon. */
  return90: number | null;
  return180: number | null;
};

export type HistoricalPlaybook = {
  rows: PlaybookAssetRow[];
  episodes90: number;
  episodes180: number;
  methodNote: string;
  /** Set when FRED or computation failed; UI can still show the section. */
  loadError?: string;
};

const EMPTY_ROWS: PlaybookAssetRow[] = [
  { key: "sp500", label: "S&P 500", return90: null, return180: null },
  { key: "gold", label: "Gold", return90: null, return180: null },
  {
    key: "bonds",
    label: "10Y Treasury (est.)",
    return90: null,
    return180: null,
  },
];

function addCalendarDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function valueOnOrBefore(
  sortedAsc: ParsedObservation[],
  iso: string,
): number | null {
  let lo = 0;
  let hi = sortedAsc.length - 1;
  let best = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sortedAsc[mid]!.date <= iso) {
      best = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return best >= 0 ? sortedAsc[best]!.value : null;
}

/** First month of each contiguous run of `regime` (reduces overlapping forward windows). */
function regimeStreakStartPeriods(
  monthly: MonthRegime[],
  regime: RegimeId,
): string[] {
  const out: string[] = [];
  for (let i = 0; i < monthly.length; i++) {
    if (monthly[i]!.regime !== regime) continue;
    if (i > 0 && monthly[i - 1]!.regime === regime) continue;
    out.push(monthly[i]!.period);
  }
  return out;
}

function mean(a: number[]): number | null {
  if (a.length === 0) return null;
  return a.reduce((s, x) => s + x, 0) / a.length;
}

function minIso(dates: (string | undefined)[]): string {
  return dates.filter(Boolean).sort().at(0) ?? "";
}

/**
 * Average forward returns after **entering** the given regime (streak starts),
 * using month-end as the anchor date.
 */
export async function computeHistoricalPlaybook(
  monthly: MonthRegime[],
  regime: RegimeId,
): Promise<HistoricalPlaybook> {
  try {
    return await computeHistoricalPlaybookInner(monthly, regime);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not load playbook data.";
    return {
      rows: EMPTY_ROWS,
      episodes90: 0,
      episodes180: 0,
      methodNote: "",
      loadError: msg,
    };
  }
}

async function computeHistoricalPlaybookInner(
  monthly: MonthRegime[],
  regime: RegimeId,
): Promise<HistoricalPlaybook> {
  const periods = regimeStreakStartPeriods(monthly, regime);
  const anchors = periods.map((p) => lastDayOfMonth(p));

  const [sp500, gold, y10] = await Promise.all([
    fetchFredObservations({
      seriesId: "SP500",
      observationStart: "1994-01-01",
    }),
    fetchFredObservations({
      seriesId: "GOLDAMGBD228NLBM",
      observationStart: "1994-01-01",
    }),
    fetchFredObservations({
      seriesId: "DGS10",
      observationStart: "1994-01-01",
    }),
  ]);

  const maxD = minIso([sp500.at(-1)?.date, gold.at(-1)?.date, y10.at(-1)?.date]);
  if (!maxD) {
    return {
      rows: EMPTY_ROWS,
      episodes90: 0,
      episodes180: 0,
      methodNote: "Insufficient market data.",
      loadError: "No end dates returned for one or more price series.",
    };
  }

  const sp90: number[] = [];
  const sp180: number[] = [];
  const au90: number[] = [];
  const au180: number[] = [];
  const bd90: number[] = [];
  const bd180: number[] = [];
  let n90 = 0;
  let n180 = 0;

  for (const start of anchors) {
    const t90 = addCalendarDays(start, 90);
    const t180 = addCalendarDays(start, 180);

    const sp0 = valueOnOrBefore(sp500, start);
    const au0 = valueOnOrBefore(gold, start);
    const y0 = valueOnOrBefore(y10, start);

    if (t90 <= maxD) {
      n90++;
      const sp1 = valueOnOrBefore(sp500, t90);
      const au1 = valueOnOrBefore(gold, t90);
      const y1 = valueOnOrBefore(y10, t90);
      if (sp0 != null && sp1 != null && sp0 !== 0) {
        sp90.push((sp1 / sp0 - 1) * 100);
      }
      if (au0 != null && au1 != null && au0 !== 0) {
        au90.push((au1 / au0 - 1) * 100);
      }
      if (y0 != null && y1 != null) {
        bd90.push(-MOD_DUR_10Y * (y1 - y0));
      }
    }

    if (t180 <= maxD) {
      n180++;
      const sp2 = valueOnOrBefore(sp500, t180);
      const au2 = valueOnOrBefore(gold, t180);
      const y2 = valueOnOrBefore(y10, t180);
      if (sp0 != null && sp2 != null && sp0 !== 0) {
        sp180.push((sp2 / sp0 - 1) * 100);
      }
      if (au0 != null && au2 != null && au0 !== 0) {
        au180.push((au2 / au0 - 1) * 100);
      }
      if (y0 != null && y2 != null) {
        bd180.push(-MOD_DUR_10Y * (y2 - y0));
      }
    }
  }

  return {
    rows: [
      {
        key: "sp500",
        label: "S&P 500",
        return90: mean(sp90),
        return180: mean(sp180),
      },
      {
        key: "gold",
        label: "Gold",
        return90: mean(au90),
        return180: mean(au180),
      },
      {
        key: "bonds",
        label: "10Y Treasury (est.)",
        return90: mean(bd90),
        return180: mean(bd180),
      },
    ],
    episodes90: n90,
    episodes180: n180,
    methodNote:
      "Anchored at month-end on the first month of each regime spell. S&P 500 and gold use last available daily levels within each window. 10Y column approximates bond price return from changes in the 10Y yield (DGS10) using an 8.5-year modified-duration rule.",
  };
}
