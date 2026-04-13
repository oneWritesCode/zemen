import { buildRegimeFeatureRows } from "@/lib/regime/build-panel";

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/** Lower unemployment → higher score (US cycle range). */
function scoreLabor(unrate: number): number {
  if (unrate <= 3.5) return 100;
  if (unrate >= 9) return 0;
  return clamp((100 * (9 - unrate)) / (9 - 3.5), 0, 100);
}

/** CPI YoY near ~2% is healthiest. */
function scoreInflation(cpiYoY: number): number {
  const d = Math.abs(cpiYoY - 2);
  return clamp(100 - d * 14, 0, 100);
}

/** Positive real GDP YoY supports the score. */
function scoreGrowth(rgdpYoY: number): number {
  return clamp(45 + rgdpYoY * 14, 0, 100);
}

/** Tighter HY OAS → less credit stress. */
function scoreCredit(hySpread: number): number {
  if (hySpread <= 2) return 100;
  if (hySpread >= 9) return 0;
  return clamp((100 * (9 - hySpread)) / (9 - 2), 0, 100);
}

/** Moderate policy rate vs extremes (rough neutral ~3%). */
function scorePolicy(fedFunds: number): number {
  const d = Math.abs(fedFunds - 3);
  return clamp(100 - d * 11, 0, 100);
}

export type MacroHealthBreakdown = {
  label: string;
  weight: number;
  subScore: number;
  contribution: number;
};

export type MacroHealthScoreResult = {
  score: number;
  period: string;
  breakdown: MacroHealthBreakdown[];
};

export type MacroHealthScoreError = {
  score: null;
  error: string;
};

const WEIGHTS = {
  labor: 0.2,
  inflation: 0.2,
  growth: 0.2,
  credit: 0.2,
  policy: 0.2,
} as const;

/**
 * 0–100 composite from the same five macro inputs as the regime model
 * (Fed funds, CPI YoY, unemployment, real GDP YoY, HY OAS). Heuristic only.
 */
export async function getMacroHealthScore(): Promise<
  MacroHealthScoreResult | MacroHealthScoreError
> {
  try {
    const rows = await buildRegimeFeatureRows("1995-01-01");
    if (rows.length === 0) {
      return { score: null, error: "Insufficient FRED history for a score." };
    }
    const r = rows[rows.length - 1]!;

    const labor = scoreLabor(r.unrate);
    const inflation = scoreInflation(r.cpiYoY);
    const growth = scoreGrowth(r.rgdpYoY);
    const credit = scoreCredit(r.hySpread);
    const policy = scorePolicy(r.fedFunds);

    const breakdown: MacroHealthBreakdown[] = [
      {
        label: "Labor market",
        weight: WEIGHTS.labor,
        subScore: labor,
        contribution: WEIGHTS.labor * labor,
      },
      {
        label: "Inflation vs target",
        weight: WEIGHTS.inflation,
        subScore: inflation,
        contribution: WEIGHTS.inflation * inflation,
      },
      {
        label: "Real GDP growth",
        weight: WEIGHTS.growth,
        subScore: growth,
        contribution: WEIGHTS.growth * growth,
      },
      {
        label: "Credit stress (HY OAS)",
        weight: WEIGHTS.credit,
        subScore: credit,
        contribution: WEIGHTS.credit * credit,
      },
      {
        label: "Policy rate stance",
        weight: WEIGHTS.policy,
        subScore: policy,
        contribution: WEIGHTS.policy * policy,
      },
    ];

    const raw = breakdown.reduce((s, b) => s + b.contribution, 0);
    const score = Math.round(clamp(raw, 0, 100));

    return {
      score,
      period: r.period,
      breakdown,
    };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not compute macro health score.";
    return { score: null, error: msg };
  }
}
