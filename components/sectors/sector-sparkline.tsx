"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

export function SectorSparkline({
  values,
  dates,
  color,
}: {
  values: number[];
  dates: string[];
  color: string;
}) {
  const data = values
    .map((v, i) => ({ x: dates[i] ?? String(i), y: v }))
    .filter((d) => Number.isFinite(d.y));

  return (
    <div className="h-[80px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

