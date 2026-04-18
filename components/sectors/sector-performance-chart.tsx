"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
      <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-4 sm:p-5">
        <div className="text-sm font-semibold text-zinc-200">{sectorName} price performance</div>
        <div className="mt-4 flex h-[320px] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-zinc-500">
          Chart data temporarily unavailable. Please try again later.
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
    <div className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">{sectorName} price performance</h3>
          <p className="text-xs text-zinc-500">Sector (yellow) vs S&P 500 (gray dashed)</p>
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
          <LineChart data={combined} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 6" />
            <XAxis
              dataKey="dateIso"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#3f3f46" }}
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
            <Line type="monotone" dataKey="sector" stroke="#e4e4e7" strokeWidth={2} dot={false} />
            {compare ? (
              <Line
                type="monotone"
                dataKey="sp"
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 6"
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

