"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function SectorPerformanceChart({
  sectorMonthly,
  spMonthly,
  sectorName,
}: {
  sectorMonthly: Array<{ dateIso: string; value: number }>;
  spMonthly: Array<{ dateIso: string; value: number }>;
  sectorName: string;
}) {
  const [range, setRange] = useState<"3M" | "6M" | "1Y" | "3Y" | "5Y">("1Y");
  const [compare, setCompare] = useState(true);

  const filteredSector = useMemo(() => {
    const n =
      range === "3M" ? 3 : range === "6M" ? 6 : range === "1Y" ? 12 : range === "3Y" ? 36 : 60;
    return sectorMonthly.slice(-n);
  }, [range, sectorMonthly]);

  const filteredSp = useMemo(() => {
    const n =
      range === "3M" ? 3 : range === "6M" ? 6 : range === "1Y" ? 12 : range === "3Y" ? 36 : 60;
    return spMonthly.slice(-n);
  }, [range, spMonthly]);

  const combined = useMemo(() => {
    const spByDate = new Map(filteredSp.map((p) => [p.dateIso, p.value]));
    return filteredSector.map((p) => ({
      dateIso: p.dateIso,
      sector: p.value,
      sp: spByDate.get(p.dateIso) ?? null,
    }));
  }, [filteredSector, filteredSp]);

  if (combined.length < 2) {
    return (
      <div className="rounded-2xl bg-[#0a0a0a] shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-4 sm:p-5">
        <div className="text-sm font-semibold text-zinc-200">{sectorName} price performance</div>
        <div className="mt-4 flex h-[320px] items-center justify-center rounded-xl bg-white/[0.02] text-sm text-[#838383]">
          Loading chart data…
        </div>
      </div>
    );
  }

  const findBand = (from: string, to: string) => {
    const xs = combined.map((d) => d.dateIso);
    const inRange = xs.filter((x) => x >= from && x <= to);
    if (inRange.length === 0) return null;
    return { x1: inRange[0]!, x2: inRange[inRange.length - 1]! };
  };

  const covidBand = findBand("2020-02-29", "2020-06-30");
  const crashBand = findBand("2022-05-31", "2022-10-31");

  return (
    <div className="rounded-2xl border-none bg-transparent shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{sectorName} price performance</h3>
          <p className="text-xs text-zinc-500">Sector (solid) vs S&P 500 (gray dashed)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["3M", "6M", "1Y", "3Y", "5Y"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={[
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                r === range
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/[0.08] bg-white/[0.03] text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-200",
              ].join(" ")}
            >
              {r}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCompare((v) => !v)}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-semibold text-zinc-400 hover:border-white/20 hover:text-white transition"
          >
            {compare ? "Hide S&P" : "Show S&P"}
          </button>
        </div>
      </div>

      <div className="mt-4 h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={combined} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <filter id="glowSector" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="sectorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4C72F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4C72F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} horizontal={false} />
            <XAxis
              dataKey="dateIso"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.04)" }}
              interval={Math.max(0, Math.floor(combined.length / 6))}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            {covidBand ? (
              <ReferenceArea x1={covidBand.x1} x2={covidBand.x2} fill="rgba(255,255,255,0.04)" strokeOpacity={0} />
            ) : null}
            {crashBand ? (
              <ReferenceArea x1={crashBand.x1} x2={crashBand.x2} fill="rgba(96,165,250,0.06)" strokeOpacity={0} />
            ) : null}
            <Area 
              type="monotone" 
              dataKey="sector" 
              stroke="#4C72F6" 
              fill="url(#sectorGradient)"
              strokeWidth={3} 
              dot={false}
              filter="url(#glowSector)" 
            />
            {compare ? (
              <Area
                type="monotone"
                dataKey="sp"
                stroke="#9ca3af"
                fill="transparent"
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 6"
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

