"use client";

import { useCallback, useMemo, useState } from "react";

import type { TopicChartSpec } from "@/lib/fred/topics-config";
import type { ChartRow } from "@/lib/fred/get-topic-dataset";
import { motion } from "framer-motion";
import { ExpandButton } from "@/components/ExpandButton";
import { GraphModal } from "@/components/GraphModal";
import {
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS = { stroke: "#666", fontSize: 10 };
const GRID = { stroke: "rgba(255,255,255,0.03)", strokeDasharray: "0" };
const TOOLTIP_STYLE = {
  backgroundColor: "#0d0d0d",
  border: "1px solid #333",
  borderRadius: 8,
  color: "#fff",
  padding: "8px 12px",
};

function getIndicatorColor(topicSlug: string): string {
  const slug = topicSlug.toLowerCase();
  if (slug.includes("rate") || slug.includes("yield") || slug.includes("money") || slug.includes("treasury")) return "#4d9fff";
  if (slug.includes("inflation") || slug.includes("cpi") || slug.includes("pce") || slug.includes("risk")) return "#ff6b6b";
  if (slug.includes("unemployment") || slug.includes("job")) return "#f97316";
  if (slug.includes("gdp") || slug.includes("growth") || slug.includes("stock") || slug.includes("market")) return "#00ff88";
  if (slug.includes("housing") || slug.includes("home") || slug.includes("sentiment") || slug.includes("consumer")) return "#00d4ff";
  if (slug.includes("credit") || slug.includes("spread") || slug.includes("gold") || slug.includes("debt")) return "#f0a500";
  return "rgba(255,255,255,0.7)";
}

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
  hidden,
}: {
  spec: TopicChartSpec;
  rows: ChartRow[];
  seriesStyles: Record<string, SeriesStyle>;
  compare2008: boolean;
  compare2020: boolean;
  topicSlug: string;
  hidden: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
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

  const renderChart = (height: number = 280) => {
    const primaryColor = getIndicatorColor(topicSlug);
    
    return (
      <div style={{ position: 'relative' }}>
        {/* Subtle top glow matching line color */}
        <div style={{
          position: 'absolute',
          top: -20,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(to right, transparent, ${primaryColor}33, transparent)`,
          zIndex: 1
        }}/>
        
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...GRID} vertical={false} horizontal={false} />
            <XAxis
              dataKey="t"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tick={AXIS}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.04)" }}
              tickFormatter={tickTime}
              minTickGap={28}
            />
            <YAxis
              yAxisId="left"
              tick={AXIS}
              tickLine={false}
              axisLine={false}
              width={48}
              domain={["auto", "auto"]}
            />
            {rightKeys.length > 0 ? (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={AXIS}
                tickLine={false}
                axisLine={false}
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
                fillOpacity={0.06}
                strokeOpacity={0}
              />
            ) : null}
            {show2020 ? (
              <ReferenceArea
                yAxisId="left"
                x1={T_2020[0]}
                x2={T_2020[1]}
                fill="#60a5fa"
                fillOpacity={0.08}
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
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 16, color: "#999" }} />
            {leftKeys.map((key, idx) => {
              const st = seriesStyles[key];
              if (!st) return null;
              const color = idx === 0 ? getIndicatorColor(topicSlug) : `${getIndicatorColor(topicSlug)}80`;
              return (
                <Area
                  key={key}
                  yAxisId="left"
                  type="monotone"
                  dataKey={key}
                  name={st.label}
                  stroke={color}
                  fill={idx === 0 ? "url(#colorGradient)" : "transparent"}
                  strokeWidth={3}
                  dot={false}
                  connectNulls
                  filter="url(#glow)"
                  animationDuration={1000}
                />
              );
            })}
            {rightKeys.map((key, idx) => {
              const st = seriesStyles[key];
              if (!st) return null;
              const color = idx === 0 ? getIndicatorColor(topicSlug) : `${getIndicatorColor(topicSlug)}80`;
              return (
                <Area
                  key={key}
                  yAxisId="right"
                  type="monotone"
                  dataKey={key}
                  name={st.label}
                  stroke={color}
                  fill="transparent"
                  strokeWidth={3}
                  dot={false}
                  connectNulls
                  filter="url(#glow)"
                  animationDuration={1000}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="relative min-w-0 rounded-2xl border border-[#111] bg-[#080808] p-5 pb-3 shadow-lg">
      <div className="absolute right-3 top-3 z-20">
        <ExpandButton onClick={() => setModalOpen(true)} />
      </div>

      <GraphModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={spec.title}
        subtitle={`${topicSlug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ')} Intelligence View`}
        chart={renderChart(400)}
        topicSlug={topicSlug}
        chartRows={rows}
        intelligenceData={{
          whatYouSee: `This chart visualizes ${spec.seriesKeys.map(k => seriesStyles[k]?.label).join(' and ')} over the selected period. It helps identify structural trends and cyclical shifts in the ${topicSlug.replace('-', ' ')} environment.`,
          unit: "Varies by series",
          normalRange: "Historical average",
          currentReading: "See latest observation",
          whenHigh: ["Increased market volatility", "Potential regime shift", "Policy reassessment required"],
          whenLow: ["Stable economic environment", "Trend persistence", "Low immediate risk"],
          keyFactors: spec.seriesKeys.map(k => ({
            name: seriesStyles[k]?.label ?? k,
            direction: "UP/DOWN",
            explanation: `The movement of ${seriesStyles[k]?.label ?? k} is a primary driver of this indicator.`
          })),
          historicalEvents: [
            { year: "2008", event: "Global Financial Crisis", impact: "Significant deleveraging and policy intervention." },
            { year: "2020", event: "COVID-19 Shock", impact: "Unprecedented liquidity injection and rapid recovery." },
            { year: "2022", event: "Inflation Surge", impact: "Aggressive rate hiking cycle and market repricing." }
          ]
        }}
      />

      <div className="mb-4 pl-1">
        <h3 className="text-xs font-medium uppercase tracking-[2px] text-[#999]">
          {spec.title}
        </h3>
      </div>
      
      <div
        className={[
          "grid overflow-hidden transition-all duration-300 ease-out",
          hidden ? "grid-rows-[0fr] opacity-60" : "grid-rows-[1fr] opacity-100",
        ].join(" ")}
      >
        <div className="min-h-0">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[280px] min-h-[280px] w-full min-w-0 cursor-pointer transition-opacity hover:opacity-95"
            onClick={() => setModalOpen(true)}
          >
            {renderChart()}
          </motion.div>
        </div>
      </div>
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
    <div className="mb-8 rounded-2xl border border-[#111] bg-[#080808] p-6 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#999]">
        Chart range & comparisons
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#bbb]">
        Drag the sliders to zoom the charts. Use presets for common episodes.
        Comparison bands show when the selected range overlaps those periods.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {RANGE_PRESETS.map((p) => {
          const isActive = (p.id === 'full' && startIdx === 0 && endIdx === maxI);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className={[
                "rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-all duration-200",
                isActive 
                  ? "bg-white border-white text-black" 
                  : "bg-transparent border-[#1e1e1e] text-[#999] hover:border-white/20 hover:text-[#eee]"
              ].join(" ")}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[1px] text-[#999]">
            Start — {startLabel}
          </label>
          <div className="relative h-6 flex items-center">
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
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#111] accent-white"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-[1px] text-[#999]">
            End — {endLabel}
          </label>
          <div className="relative h-6 flex items-center">
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
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#111] accent-white"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 border-t border-[#111] pt-6">
        <button
          type="button"
          role="switch"
          aria-checked={compare2008}
          onClick={() => onCompare2008(!compare2008)}
          className={[
            "flex-1 min-w-[200px] rounded-xl border px-5 py-4 text-left transition-all duration-200",
            compare2008
              ? "border-white/20 bg-white/5 text-white"
              : "border-[#161616] bg-[#0d0d0d] text-[#bbb] hover:border-white/10 hover:text-[#eee]",
          ].join(" ")}
        >
          <span className="block text-[13px] font-bold">Compare to 2008</span>
          <span className="mt-1 block text-[11px] font-medium opacity-80">
            Shade Great Recession ({COMPARE_2008.x1.slice(0, 7)} – {COMPARE_2008.x2.slice(0, 7)})
          </span>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={compare2020}
          onClick={() => onCompare2020(!compare2020)}
          className={[
            "flex-1 min-w-[200px] rounded-xl border px-5 py-4 text-left transition-all duration-200",
            compare2020
              ? "border-white/20 bg-white/5 text-white"
              : "border-[#161616] bg-[#0d0d0d] text-[#bbb] hover:border-white/10 hover:text-[#eee]",
          ].join(" ")}
        >
          <span className="block text-[13px] font-bold">Compare to 2020</span>
          <span className="mt-1 block text-[11px] font-medium opacity-80">
            Shade COVID crash window ({COMPARE_2020.x1.slice(0, 7)} – {COMPARE_2020.x2.slice(0, 7)})
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
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  const filteredRows = useMemo(() => {
    if (sorted.length === 0) return [];
    const safeStart = Math.min(startIdx, maxI);
    const safeEnd = Math.min(endIdx, maxI);
    const a = Math.min(safeStart, safeEnd);
    const b = Math.max(safeStart, safeEnd);
    return sorted.slice(a, b + 1);
  }, [sorted, startIdx, endIdx, maxI]);

  const splitCharts = charts.filter((c) => c.span === "split");
  const fullCharts = charts.filter((c) => c.span === "full");
  const hiddenTitles = useMemo(() => [...hidden.values()].sort(), [hidden]);

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
              <div
                key={spec.title}
                className="min-w-0"
              >
                <ChartBlock
                  spec={spec}
                  rows={filteredRows}
                  seriesStyles={seriesStyles}
                  compare2008={compare2008}
                  compare2020={compare2020}
                  topicSlug={topicSlug}
                  hidden={hidden.has(spec.title)}
                />
              </div>
            ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {fullCharts.map((spec) => (
            <div
              key={spec.title}
              className="min-w-0"
            >
              <ChartBlock
                spec={spec}
                rows={filteredRows}
                seriesStyles={seriesStyles}
                compare2008={compare2008}
                compare2020={compare2020}
                topicSlug={topicSlug}
                hidden={hidden.has(spec.title)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
