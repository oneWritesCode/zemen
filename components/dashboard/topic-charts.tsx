"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { TopicChartSpec } from "@/lib/fred/topics-config";
import type { ChartRow } from "@/lib/fred/get-topic-dataset";
import { IntelligencePanel } from "@/components/dashboard/intelligence-panel";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = { stroke: "#52525b", fontSize: 11 };
const GRID = { stroke: "#27272a", strokeDasharray: "3 6" };
const TOOLTIP_STYLE = {
  backgroundColor: "#12121a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fafafa",
};

/** Shaded comparison windows (month-end dates aligned to typical FRED monthly rows). */
const COMPARE_2008 = {
  id: "2008" as const,
  label: "Great Recession",
  x1: "2007-12-31",
  x2: "2009-06-30",
};
const COMPARE_2020 = {
  id: "2020" as const,
  label: "COVID crash",
  x1: "2020-02-29",
  x2: "2020-06-30",
};

type SeriesStyle = { label: string; color: string };

function toTime(iso: string): number {
  return Date.parse(`${iso}T12:00:00Z`) || 0;
}

function rangesOverlapMs(
  viewStart: number,
  viewEnd: number,
  r1: number,
  r2: number,
): boolean {
  return !(viewEnd < r1 || viewStart > r2);
}

const T_2008: [number, number] = [
  toTime(COMPARE_2008.x1),
  toTime(COMPARE_2008.x2),
];
const T_2020: [number, number] = [
  toTime(COMPARE_2020.x1),
  toTime(COMPARE_2020.x2),
];

type RowTime = ChartRow & { t: number };

function withTime(rows: ChartRow[]): RowTime[] {
  return rows.map((r) => ({ ...r, t: toTime(r.isoEnd) }));
}

function tickTime(v: number) {
  if (!Number.isFinite(v)) return "";
  const y = new Date(v).getUTCFullYear();
  return String(y);
}

function ChartBlock({
  spec,
  rows,
  seriesStyles,
  compare2008,
  compare2020,
  topicSlug,
}: {
  spec: TopicChartSpec;
  rows: ChartRow[];
  seriesStyles: Record<string, SeriesStyle>;
  compare2008: boolean;
  compare2020: boolean;
  topicSlug: string;
}) {
  const right = new Set(spec.useRightAxis ?? []);
  const leftKeys = spec.seriesKeys.filter((k) => !right.has(k));
  const rightKeys = spec.seriesKeys.filter((k) => right.has(k));

  const data = useMemo(() => withTime(rows), [rows]);

  const tMin = data[0]?.t ?? 0;
  const tMax = data[data.length - 1]?.t ?? 0;

  const show2008 =
    compare2008 &&
    data.length > 0 &&
    rangesOverlapMs(tMin, tMax, T_2008[0]!, T_2008[1]!);
  const show2020 =
    compare2020 &&
    data.length > 0 &&
    rangesOverlapMs(tMin, tMax, T_2020[0]!, T_2020[1]!);

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#12121a] p-4 pb-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold tracking-tight text-white">
        {spec.title}
      </h3>
      <div className="h-[280px] min-h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid {...GRID} />
            <XAxis
              dataKey="t"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tick={AXIS}
              tickLine={false}
              axisLine={{ stroke: "#3f3f46" }}
              tickFormatter={tickTime}
              minTickGap={28}
            />
            <YAxis
              yAxisId="left"
              tick={AXIS}
              tickLine={false}
              axisLine={{ stroke: "#3f3f46" }}
              width={48}
              domain={["auto", "auto"]}
            />
            {rightKeys.length > 0 ? (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={AXIS}
                tickLine={false}
                axisLine={{ stroke: "#3f3f46" }}
                width={52}
                domain={["auto", "auto"]}
              />
            ) : null}
            {show2008 ? (
              <ReferenceArea
                yAxisId="left"
                x1={T_2008[0]}
                x2={T_2008[1]}
                fill="#ffcc00"
                fillOpacity={0.12}
                strokeOpacity={0}
              />
            ) : null}
            {show2020 ? (
              <ReferenceArea
                yAxisId="left"
                x1={T_2020[0]}
                x2={T_2020[1]}
                fill="#60a5fa"
                fillOpacity={0.15}
                strokeOpacity={0}
              />
            ) : null}
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(_label, payload) => {
                const row = payload?.[0]?.payload as RowTime | undefined;
                return row?.label ?? "";
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12, color: "#a1a1aa" }}
            />
            {leftKeys.map((key) => {
              const st = seriesStyles[key];
              if (!st) return null;
              return (
                <Line
                  key={key}
                  yAxisId="left"
                  type="monotone"
                  dataKey={key}
                  name={st.label}
                  stroke={st.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              );
            })}
            {rightKeys.map((key) => {
              const st = seriesStyles[key];
              if (!st) return null;
              return (
                <Line
                  key={key}
                  yAxisId="right"
                  type="monotone"
                  dataKey={key}
                  name={st.label}
                  stroke={st.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <IntelligencePanel topicSlug={topicSlug} chartTitle={spec.title} rows={rows} />
    </div>
  );
}

function sortedRows(rows: ChartRow[]): ChartRow[] {
  return [...rows].sort((a, b) => a.isoEnd.localeCompare(b.isoEnd));
}

type Preset = { id: string; label: string; startYm: string; endYm: string };

const RANGE_PRESETS: Preset[] = [
  { id: "full", label: "Full range", startYm: "", endYm: "" },
  { id: "2008", label: "2008 crisis", startYm: "2007-01", endYm: "2010-12" },
  { id: "2020", label: "2020 COVID", startYm: "2019-06", endYm: "2021-12" },
  { id: "2022", label: "2022 inflation", startYm: "2021-06", endYm: "2023-12" },
];

function ChartRangeToolbar({
  sorted,
  startIdx,
  endIdx,
  onStartIdx,
  onEndIdx,
  compare2008,
  compare2020,
  onCompare2008,
  onCompare2020,
}: {
  sorted: ChartRow[];
  startIdx: number;
  endIdx: number;
  onStartIdx: (n: number) => void;
  onEndIdx: (n: number) => void;
  compare2008: boolean;
  compare2020: boolean;
  onCompare2008: (v: boolean) => void;
  onCompare2020: (v: boolean) => void;
}) {
  const n = sorted.length;
  const maxI = Math.max(0, n - 1);

  const applyPreset = useCallback(
    (p: Preset) => {
      if (p.id === "full" || !p.startYm) {
        onStartIdx(0);
        onEndIdx(maxI);
        return;
      }
      const si = sorted.findIndex((r) => r.period >= p.startYm);
      const ei = (() => {
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (sorted[i]!.period <= p.endYm) return i;
        }
        return maxI;
      })();
      const s = si < 0 ? 0 : si;
      const e = Math.max(s, Math.min(ei, maxI));
      onStartIdx(s);
      onEndIdx(e);
    },
    [sorted, maxI, onStartIdx, onEndIdx],
  );

  if (n === 0) return null;

  const startLabel = sorted[startIdx]?.label ?? "";
  const endLabel = sorted[endIdx]?.label ?? "";

  return (
    <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#12121a] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Chart range & comparisons
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        Drag the sliders to zoom the charts. Use presets for common episodes.
        Comparison bands show when the selected range overlaps those periods.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-[#ffcc00]/40 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Start — {startLabel}
          </label>
          <input
            type="range"
            min={0}
            max={maxI}
            value={startIdx}
            aria-label="Chart range start"
            onChange={(e) => {
              const v = Number(e.target.value);
              onStartIdx(Math.min(v, endIdx));
            }}
            className="h-2 w-full cursor-pointer accent-[#ffcc00]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            End — {endLabel}
          </label>
          <input
            type="range"
            min={0}
            max={maxI}
            value={endIdx}
            aria-label="Chart range end"
            onChange={(e) => {
              const v = Number(e.target.value);
              onEndIdx(Math.max(v, startIdx));
            }}
            className="h-2 w-full cursor-pointer accent-[#ffcc00]"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-white/[0.06] pt-4">
        <button
          type="button"
          role="switch"
          aria-checked={compare2008}
          onClick={() => onCompare2008(!compare2008)}
          className={[
            "rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition",
            compare2008
              ? "border-[#ffcc00]/50 bg-[#ffcc00]/15 text-[#ffcc00]"
              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200",
          ].join(" ")}
        >
          <span className="block">Compare to 2008</span>
          <span className="mt-0.5 block text-xs font-normal text-zinc-500">
            Shade Great Recession ({COMPARE_2008.x1.slice(0, 7)} –{" "}
            {COMPARE_2008.x2.slice(0, 7)})
          </span>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={compare2020}
          onClick={() => onCompare2020(!compare2020)}
          className={[
            "rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition",
            compare2020
              ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200",
          ].join(" ")}
        >
          <span className="block">Compare to 2020</span>
          <span className="mt-0.5 block text-xs font-normal text-zinc-500">
            Shade COVID crash window ({COMPARE_2020.x1.slice(0, 7)} –{" "}
            {COMPARE_2020.x2.slice(0, 7)})
          </span>
        </button>
      </div>
    </div>
  );
}

export function TopicCharts({
  charts,
  chartRows,
  seriesStyles,
  topicSlug,
}: {
  charts: TopicChartSpec[];
  chartRows: ChartRow[];
  seriesStyles: Record<string, SeriesStyle>;
  topicSlug: string;
}) {
  const sorted = useMemo(() => sortedRows(chartRows), [chartRows]);
  const maxI = Math.max(0, sorted.length - 1);

  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(maxI);
  const [compare2008, setCompare2008] = useState(false);
  const [compare2020, setCompare2020] = useState(false);

  useEffect(() => {
    setStartIdx(0);
    setEndIdx(Math.max(0, sorted.length - 1));
  }, [chartRows, sorted.length]);

  const filteredRows = useMemo(() => {
    if (sorted.length === 0) return [];
    const a = Math.min(startIdx, endIdx);
    const b = Math.max(startIdx, endIdx);
    return sorted.slice(a, b + 1);
  }, [sorted, startIdx, endIdx]);

  const splitCharts = charts.filter((c) => c.span === "split");
  const fullCharts = charts.filter((c) => c.span === "full");

  return (
    <div className="flex flex-col gap-6">
      <ChartRangeToolbar
        sorted={sorted}
        startIdx={startIdx}
        endIdx={endIdx}
        onStartIdx={setStartIdx}
        onEndIdx={setEndIdx}
        compare2008={compare2008}
        compare2020={compare2020}
        onCompare2008={setCompare2008}
        onCompare2020={setCompare2020}
      />

      {splitCharts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {splitCharts.map((spec) => (
            <ChartBlock
              key={spec.title}
              spec={spec}
              rows={filteredRows}
              seriesStyles={seriesStyles}
              compare2008={compare2008}
              compare2020={compare2020}
              topicSlug={topicSlug}
            />
          ))}
        </div>
      ) : null}
      {fullCharts.map((spec) => (
        <ChartBlock
          key={spec.title}
          spec={spec}
          rows={filteredRows}
          seriesStyles={seriesStyles}
          compare2008={compare2008}
          compare2020={compare2020}
          topicSlug={topicSlug}
        />
      ))}
    </div>
  );
}
