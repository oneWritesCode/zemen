import type { RegimeId } from "./types";

/** Feature order: fedFunds, cpiYoY, unrate, rgdpYoY, hySpread */
const REGIME_TEMPLATES: Record<RegimeId, number[]> = {
  goldilocks: [0.45, 0.35, 0.25, 0.55, 0.35],
  stagflation: [0.55, 0.95, 0.55, 0.2, 0.55],
  recession: [0.35, 0.35, 0.95, 0.1, 0.9],
  recovery: [0.35, 0.4, 0.45, 0.75, 0.45],
  overheating: [0.85, 0.85, 0.15, 0.75, 0.35],
};

const REGIME_ORDER: RegimeId[] = [
  "goldilocks",
  "stagflation",
  "recession",
  "recovery",
  "overheating",
];

/** Min-max each column of centroid matrix to [0,1] across clusters. */
function minMaxColumns(centroids: number[][]): number[][] {
  const k = centroids.length;
  const d = centroids[0]!.length;
  const out: number[][] = centroids.map((row) => [...row]);
  for (let j = 0; j < d; j++) {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < k; i++) {
      const v = centroids[i]![j]!;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const span = max - min || 1;
    for (let i = 0; i < k; i++) {
      out[i]![j] = (centroids[i]![j]! - min) / span;
    }
  }
  return out;
}

function templateDist(a: number[], b: number[]): number {
  let s = 0;
  for (let j = 0; j < a.length; j++) {
    const d = a[j]! - b[j]!;
    s += d * d;
  }
  return Math.sqrt(s);
}

/**
 * Maps each k-means cluster index (0..k-1) to a regime id using template matching
 * with a greedy unique assignment.
 */
export function assignClusterToRegime(
  centroidsOriginal: number[][],
): Map<number, RegimeId> {
  const k = centroidsOriginal.length;
  const normalized = minMaxColumns(centroidsOriginal);

  type Pair = { cluster: number; regime: RegimeId; dist: number };
  const pairs: Pair[] = [];
  for (let c = 0; c < k; c++) {
    for (const r of REGIME_ORDER) {
      pairs.push({
        cluster: c,
        regime: r,
        dist: templateDist(normalized[c]!, REGIME_TEMPLATES[r]),
      });
    }
  }
  pairs.sort((a, b) => a.dist - b.dist);

  const map = new Map<number, RegimeId>();
  const usedC = new Set<number>();
  const usedR = new Set<RegimeId>();

  for (const p of pairs) {
    if (usedC.has(p.cluster) || usedR.has(p.regime)) continue;
    map.set(p.cluster, p.regime);
    usedC.add(p.cluster);
    usedR.add(p.regime);
  }

  const usedRegimes = new Set(map.values());
  const remClusters = [...Array(k).keys()].filter((c) => !map.has(c));
  const remRegimes = REGIME_ORDER.filter((r) => !usedRegimes.has(r));
  for (let i = 0; i < remClusters.length; i++) {
    map.set(remClusters[i]!, remRegimes[i] ?? REGIME_ORDER[i % REGIME_ORDER.length]!);
  }

  return map;
}
