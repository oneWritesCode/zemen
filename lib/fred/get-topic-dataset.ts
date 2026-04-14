import { fetchFredObservations } from "./client";
import {
  type ComputedSeriesSpec,
  type FredSeriesSpec,
  type TopicChartSpec,
  type TopicDefinition,
} from "./topics-config";
import { lastDayOfMonth, monthlyLastByPeriod, sortedUnionPeriods } from "./monthly";

export type ChartRow = {
  period: string;
  label: string;
  /** Month-end ISO date for chart domains. */
  isoEnd: string;
  [key: string]: string | number | null | undefined;
};

export type KpiMetric = {
  key: string;
  label: string;
  value: number | null;
  delta1y: number | null;
  unit: FredSeriesSpec["unit"];
  color: string;
  /** Latest raw observation date (YYYY-MM-DD) for this KPI's underlying series. */
  updatedAt: string | null;
};

export type TopicDataset = {
  topic: TopicDefinition;
  seriesMeta: Record<
    string,
    { label: string; color: string; unit: FredSeriesSpec["unit"] }
  >;
  computedMeta: Record<
    string,
    { label: string; color: string; unit: FredSeriesSpec["unit"] }
  >;
  chartRows: ChartRow[];
  kpis: KpiMetric[];
  meta: {
    observationStart: string;
    firstPeriod: string | null;
    lastPeriod: string | null;
    rowCount: number;
  };
  error?: string;
};

function addMonthsYm(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function periodLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

function buildComputed(
  rowsByPeriod: Map<string, Record<string, number | null>>,
  computed: ComputedSeriesSpec[] | undefined,
): void {
  if (!computed?.length) return;

  const yoyBySource = new Map<string, Map<string, number | null>>();
  for (const c of computed) {
    if (c.op !== "yoy") continue;
    const m = new Map<string, number | null>();
    for (const [p, vals] of rowsByPeriod) {
      const cur = vals[c.source];
      const prevP = addMonthsYm(p, -12);
      const prev = rowsByPeriod.get(prevP)?.[c.source];
      if (cur != null && prev != null && prev !== 0) {
        m.set(p, (cur / prev - 1) * 100);
      } else {
        m.set(p, null);
      }
    }
    yoyBySource.set(c.key, m);
  }

  for (const c of computed) {
    if (c.op === "yoy") {
      const m = yoyBySource.get(c.key);
      if (!m) continue;
      for (const [p, vals] of rowsByPeriod) {
        vals[c.key] = m.get(p) ?? null;
      }
    } else {
      for (const [, vals] of rowsByPeriod) {
        const a = vals[c.left];
        const b = vals[c.right];
        vals[c.key] =
          a != null && b != null ? a - b : null;
      }
    }
  }
}

function seriesMetaMap(topic: TopicDefinition) {
  const seriesMeta: TopicDataset["seriesMeta"] = {};
  for (const s of topic.series) {
    seriesMeta[s.key] = { label: s.label, color: s.color, unit: s.unit };
  }
  const computedMeta: TopicDataset["computedMeta"] = {};
  for (const c of topic.computed ?? []) {
    computedMeta[c.key] = { label: c.label, color: c.color, unit: c.unit };
  }
  return { seriesMeta, computedMeta };
}

function filterChartRows(
  rows: ChartRow[],
  charts: TopicChartSpec[],
): ChartRow[] {
  const keys = new Set<string>();
  for (const ch of charts) for (const k of ch.seriesKeys) keys.add(k);
  return rows.map((r) => {
    const next: ChartRow = {
      period: r.period,
      label: r.label,
      isoEnd: r.isoEnd,
    };
    for (const k of keys) {
      const v = r[k];
      if (typeof v === "number" || v === null || v === undefined) {
        next[k] = v ?? null;
      }
    }
    return next;
  });
}

function buildKpis(
  topic: TopicDefinition,
  lastRow: ChartRow | undefined,
  rowsByPeriod: Map<string, Record<string, number | null>>,
  seriesMeta: TopicDataset["seriesMeta"],
  computedMeta: TopicDataset["computedMeta"],
  lastUpdatedByKey: Map<string, string | null>,
): KpiMetric[] {
  if (!lastRow) return [];
  const lastP = lastRow.period;
  const prevP = addMonthsYm(lastP, -12);

  const seen = new Set<string>();
  const keys = topic.kpiKeys.filter((k) => {
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return keys.map((key) => {
    const sMeta = seriesMeta[key];
    const cMeta = computedMeta[key];
    const label = sMeta?.label ?? cMeta?.label ?? key;
    const color = sMeta?.color ?? cMeta?.color ?? "#ffcc00";
    const unit = sMeta?.unit ?? cMeta?.unit ?? "index";
    const cur = (lastRow[key] as number | null | undefined) ?? null;
    const prevRow = rowsByPeriod.get(prevP);
    const prev =
      prevRow && key in prevRow ? (prevRow[key] ?? null) : null;

    let delta1y: number | null = null;
    if (cur != null && prev != null) delta1y = cur - prev;

    return {
      key,
      label,
      value: cur,
      delta1y,
      unit,
      color,
      updatedAt: lastUpdatedByKey.get(key) ?? null,
    };
  });
}

export async function getTopicDataset(topic: TopicDefinition): Promise<TopicDataset> {
  const { seriesMeta, computedMeta } = seriesMetaMap(topic);

  try {
    const fetched = await Promise.all(
      topic.series.map((s) =>
        fetchFredObservations({
          seriesId: s.fredId,
          observationStart: topic.observationStart,
        }).catch(() => []),
      ),
    );

    const lastUpdatedByKey = new Map<string, string | null>();
    for (let i = 0; i < topic.series.length; i++) {
      const key = topic.series[i]!.key;
      lastUpdatedByKey.set(key, fetched[i]?.at(-1)?.date ?? null);
    }

    const maps = topic.series.map((s, i) => ({
      key: s.key,
      map: monthlyLastByPeriod(fetched[i]!),
    }));

    const periods = sortedUnionPeriods(maps.map((m) => m.map));
    const rowsByPeriod = new Map<string, Record<string, number | null>>();

    for (const p of periods) {
      const vals: Record<string, number | null> = {};
      for (const { key, map } of maps) {
        vals[key] = map.get(p) ?? null;
      }
      rowsByPeriod.set(p, vals);
    }

    buildComputed(rowsByPeriod, topic.computed);

    // Computed series inherit "freshness" from their source(s).
    for (const c of topic.computed ?? []) {
      if (c.op === "yoy") {
        lastUpdatedByKey.set(c.key, lastUpdatedByKey.get(c.source) ?? null);
      } else {
        const a = lastUpdatedByKey.get(c.left) ?? null;
        const b = lastUpdatedByKey.get(c.right) ?? null;
        // Use the older of the two (min) as the freshness bound.
        lastUpdatedByKey.set(c.key, a && b ? (a < b ? a : b) : a ?? b ?? null);
      }
    }

    const chartRowsFull: ChartRow[] = periods.map((p) => {
      const vals = rowsByPeriod.get(p)!;
      const row: ChartRow = {
        period: p,
        label: periodLabel(p),
        isoEnd: lastDayOfMonth(p),
      };
      for (const [k, v] of Object.entries(vals)) {
        row[k] = v;
      }
      return row;
    });

    const chartRows = filterChartRows(chartRowsFull, topic.charts);
    const last = chartRowsFull[chartRowsFull.length - 1];
    const kpis = buildKpis(
      topic,
      last,
      rowsByPeriod,
      seriesMeta,
      computedMeta,
      lastUpdatedByKey,
    );

    return {
      topic,
      seriesMeta,
      computedMeta,
      chartRows,
      kpis,
      meta: {
        observationStart: topic.observationStart,
        firstPeriod: periods[0] ?? null,
        lastPeriod: periods[periods.length - 1] ?? null,
        rowCount: chartRows.length,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load FRED data.";
    return {
      topic,
      seriesMeta,
      computedMeta,
      chartRows: [],
      kpis: [],
      meta: {
        observationStart: topic.observationStart,
        firstPeriod: null,
        lastPeriod: null,
        rowCount: 0,
      },
      error: message,
    };
  }
}
