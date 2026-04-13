/** Euclidean distance between two equal-length vectors. */
export function euclidean(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i]! - b[i]!;
    s += d * d;
  }
  return Math.sqrt(s);
}

function argminDist(x: number[], centroids: number[][]): number {
  let best = 0;
  let bestD = Infinity;
  for (let j = 0; j < centroids.length; j++) {
    const d = euclidean(x, centroids[j]!);
    if (d < bestD) {
      bestD = d;
      best = j;
    }
  }
  return best;
}

/** Column-wise mean and std for standardization (ddof=0). */
export function columnStats(X: number[][]): {
  mean: number[];
  std: number[];
} {
  const n = X.length;
  const d = X[0]!.length;
  const mean = new Array(d).fill(0);
  for (const row of X) {
    for (let j = 0; j < d; j++) mean[j]! += row[j]!;
  }
  for (let j = 0; j < d; j++) mean[j]! /= n;

  const variance = new Array(d).fill(0);
  for (const row of X) {
    for (let j = 0; j < d; j++) {
      const t = row[j]! - mean[j]!;
      variance[j]! += t * t;
    }
  }
  const std = variance.map((v) => Math.sqrt(v / n) || 1);
  return { mean, std };
}

export function standardize(
  X: number[][],
  mean: number[],
  std: number[],
): number[][] {
  return X.map((row) => row.map((v, j) => (v - mean[j]!) / std[j]!));
}

export function standardizeRow(
  row: number[],
  mean: number[],
  std: number[],
): number[] {
  return row.map((v, j) => (v - mean[j]!) / std[j]!);
}

/**
 * k-means on row vectors. Returns labels and centroids in **standardized** space.
 */
export function kmeans(
  Z: number[][],
  k: number,
  opts?: { maxIter?: number; seed?: number },
): { labels: number[]; centroids: number[][] } {
  const maxIter = opts?.maxIter ?? 100;
  const n = Z.length;
  const d = Z[0]!.length;
  if (k > n) throw new Error("k-means: k cannot exceed n");

  const rng = mulberry32(opts?.seed ?? 42);
  const centroids: number[][] = [];
  const used = new Set<number>();
  while (centroids.length < k) {
    const idx = Math.floor(rng() * n);
    if (used.has(idx)) continue;
    used.add(idx);
    centroids.push([...Z[idx]!]);
  }

  const labels = new Array(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      const a = argminDist(Z[i]!, centroids);
      if (labels[i] !== a) {
        labels[i] = a;
        changed = true;
      }
    }

    const sums = Array.from({ length: k }, () => new Array(d).fill(0));
    const counts = new Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      const c = labels[i]!;
      counts[c]!++;
      for (let j = 0; j < d; j++) sums[c]![j]! += Z[i]![j]!;
    }

    for (let c = 0; c < k; c++) {
      if (counts[c]! === 0) {
        const idx = Math.floor(rng() * n);
        centroids[c] = [...Z[idx]!];
        continue;
      }
      for (let j = 0; j < d; j++) {
        centroids[c]![j] = sums[c]![j]! / counts[c]!;
      }
    }

    if (!changed) break;
  }

  return { labels, centroids };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Softmax of negative squared distances (Gaussian-like membership). */
export function regimeSoftmaxProbs(
  z: number[],
  centroids: number[][],
  sigma: number,
): number[] {
  const logits = centroids.map((c) => {
    const dist = euclidean(z, c);
    return (-dist * dist) / (2 * sigma * sigma);
  });
  const maxL = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxL));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}
