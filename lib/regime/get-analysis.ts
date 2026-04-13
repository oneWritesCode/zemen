import { assignClusterToRegime } from "./assign-labels";
import {
  computeHistoricalPlaybook,
  type HistoricalPlaybook,
} from "./playbook";
import {
  buildRegimeFeatureRows,
  REGIME_FEATURE_LABELS,
  rowsToMatrix,
  type RegimeFeatureRow,
} from "./build-panel";
import { yearFromPeriod } from "./dates";
import {
  columnStats,
  kmeans,
  regimeSoftmaxProbs,
  standardize,
  euclidean,
} from "./kmeans";
import type { RegimeId } from "./types";

export type MonthlyRegimePoint = {
  period: string;
  regime: RegimeId;
  cluster: number;
};

export type YearlyRegimePoint = {
  year: number;
  regime: RegimeId;
  /** Share of months in that year with the modal regime (0–1). */
  confidence: number;
};

export type RegimeAnalysisResult = {
  featureLabels: typeof REGIME_FEATURE_LABELS;
  current: {
    period: string;
    regime: RegimeId;
    confidencePct: number;
    features: RegimeFeatureRow | null;
    /** Softmax probability of assigned regime. */
    probability: number;
  };
  monthly: MonthlyRegimePoint[];
  yearly: YearlyRegimePoint[];
  meta: {
    nObs: number;
    lastPeriod: string | null;
    sigma: number;
  };
  historicalPlaybook: HistoricalPlaybook | null;
  error?: string;
};

function modeWithShare(items: RegimeId[]): { value: RegimeId; share: number } {
  if (items.length === 0) {
    return { value: "goldilocks", share: 0 };
  }
  const counts = new Map<RegimeId, number>();
  for (const x of items) counts.set(x, (counts.get(x) ?? 0) + 1);
  let best = items[0]!;
  let bestN = 0;
  for (const [v, n] of counts) {
    if (n > bestN) {
      bestN = n;
      best = v;
    }
  }
  return { value: best, share: bestN / items.length };
}

export async function getRegimeAnalysis(): Promise<RegimeAnalysisResult> {
  const featureLabels = REGIME_FEATURE_LABELS;

  try {
    const rows = await buildRegimeFeatureRows("1995-01-01");
    if (rows.length < 60) {
      return {
        featureLabels,
        current: {
          period: "",
          regime: "goldilocks",
          confidencePct: 0,
          features: null,
          probability: 0,
        },
        monthly: [],
        yearly: [],
        meta: { nObs: rows.length, lastPeriod: null, sigma: 1 },
        historicalPlaybook: null,
        error: "Not enough overlapping FRED history to fit the model.",
      };
    }

    const X = rowsToMatrix(rows);
    const { mean, std } = columnStats(X);
    const Z = standardize(X, mean, std);

    const { labels, centroids } = kmeans(Z, 5, { maxIter: 150, seed: 7 });

    const centroidsOriginal = centroids.map((c) =>
      c.map((z, dim) => z * std[dim]! + mean[dim]!),
    );
    const clusterToRegime = assignClusterToRegime(centroidsOriginal);

    const monthly: MonthlyRegimePoint[] = rows.map((row, i) => ({
      period: row.period,
      regime: clusterToRegime.get(labels[i]!)!,
      cluster: labels[i]!,
    }));

    const distsAll = Z.flatMap((z) =>
      centroids.map((c) => euclidean(z, c)),
    );
    const medianDist =
      [...distsAll].sort((a, b) => a - b)[
        Math.floor(distsAll.length / 2)
      ] ?? 1;
    const sigma = Math.max(0.35, medianDist * 0.85);

    const lastRow = rows[rows.length - 1]!;
    const lastZ = Z[Z.length - 1]!;
    const probs = regimeSoftmaxProbs(lastZ, centroids, sigma);
    const lastCluster = labels[labels.length - 1]!;
    const lastRegime = clusterToRegime.get(lastCluster)!;
    const probAssigned = probs[lastCluster] ?? 0;
    const confidencePct = Math.round(probAssigned * 1000) / 10;

    const byYear = new Map<number, RegimeId[]>();
    for (const m of monthly) {
      const y = yearFromPeriod(m.period);
      if (y < 1995) continue;
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y)!.push(m.regime);
    }

    const yearly: YearlyRegimePoint[] = [];
    const years = [...byYear.keys()].sort((a, b) => a - b);
    for (const year of years) {
      const regimes = byYear.get(year)!;
      const { value, share } = modeWithShare(regimes);
      yearly.push({ year, regime: value, confidence: share });
    }

    const historicalPlaybook =
      await computeHistoricalPlaybook(monthly, lastRegime);

    return {
      featureLabels,
      current: {
        period: lastRow.period,
        regime: lastRegime,
        confidencePct,
        features: lastRow,
        probability: probAssigned,
      },
      monthly,
      yearly,
      meta: {
        nObs: rows.length,
        lastPeriod: lastRow.period,
        sigma,
      },
      historicalPlaybook,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Regime analysis failed.";
    return {
      featureLabels,
      current: {
        period: "",
        regime: "goldilocks",
        confidencePct: 0,
        features: null,
        probability: 0,
      },
      monthly: [],
      yearly: [],
      meta: { nObs: 0, lastPeriod: null, sigma: 1 },
      historicalPlaybook: null,
      error: message,
    };
  }
}
