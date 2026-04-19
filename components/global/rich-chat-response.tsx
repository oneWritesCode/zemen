"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  parseMarkdownBlocks,
  parseRichResponse,
  type ChartData,
  type MetricData,
  type TableData,
} from "@/lib/chat/rich";

function BulletList({ items }: { items: Array<{ text: string; depth: number }> }) {
  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-start gap-2" style={{ marginLeft: it.depth * 14 }}>
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
          <div className="min-w-0 text-sm leading-relaxed text-zinc-200">{it.text}</div>
        </div>
      ))}
    </div>
  );
}

function MarkdownText({ text }: { text: string }) {
  const blocks = parseMarkdownBlocks(text);
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.type === "ul") return <BulletList key={i} items={b.items} />;
        return (
          <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function MetricCards({ data }: { data: MetricData }) {
  const items = Array.isArray(data?.metrics) ? data.metrics : [];
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((m) => {
        const tone =
          m.good === true ? "border-emerald-500/30" : m.good === false ? "border-red-500/30" : "border-white/10";
        const deltaTone =
          m.good === true ? "text-emerald-300" : m.good === false ? "text-red-300" : "text-white";
        return (
          <div key={`${m.label}-${m.value}`} className={`rounded-xl border ${tone} bg-white/[0.03] px-3 py-2`}>
            <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">{m.label}</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white">{m.value}</div>
            {m.change ? (
              <div className={`mt-0.5 text-xs ${deltaTone}`}>{m.change}</div>
            ) : (
              <div className="mt-0.5 text-xs text-zinc-600"> </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChatTable({ table }: { table: TableData }) {
  const headers = Array.isArray(table?.headers) ? table.headers : [];
  const rows = Array.isArray(table?.rows) ? table.rows : [];
  if (headers.length === 0 || rows.length === 0) return null;
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#0a0a0a]">
      <div className="max-h-[300px] overflow-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="sticky top-0 bg-white text-black font-bold">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#111111]" : "bg-[#161616]"}>
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2 text-zinc-200">
                    {c == null ? "" : String(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Chart({ chart }: { chart: ChartData }) {
  const color = ("color" in chart && chart.color) || "#FFFFFF";
  const title = ("title" in chart && chart.title) || "";

  if (chart.type === "gauge") {
    const min = chart.min ?? 0;
    const max = chart.max ?? 100;
    const pct = Math.max(0, Math.min(1, (chart.value - min) / (max - min || 1)));
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        {title ? <div className="mb-2 text-xs font-medium text-zinc-400">{title}</div> : null}
        <div className="flex items-end justify-between">
          <div className="font-mono text-2xl font-semibold text-white">{chart.value}</div>
          <div className="text-xs text-zinc-500">{chart.ylabel ?? ""}</div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: color }} />
        </div>
      </div>
    );
  }

  const data = chart.x.map((x, i) => ({ x, y: chart.y[i] ?? null })).filter((d) => d.y != null) as Array<{
    x: string | number;
    y: number;
  }>;
  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
      {title ? <div className="mb-2 text-xs font-medium text-zinc-400">{title}</div> : null}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 6" />
              <XAxis dataKey="x" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,18,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fafafa",
                }}
              />
              <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          ) : chart.type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 6" />
              <XAxis dataKey="x" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,18,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fafafa",
                }}
              />
              <Bar dataKey="y" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <ScatterChart>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 6" />
              <XAxis dataKey="x" type="number" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <YAxis dataKey="y" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,15,18,0.95)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fafafa",
                }}
              />
              <Scatter data={data as unknown as Array<Record<string, unknown>>} fill={color} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
      {"ylabel" in chart && chart.ylabel ? (
        <div className="mt-2 text-[11px] text-zinc-500">{chart.ylabel}</div>
      ) : null}
    </div>
  );
}

export function RichChatResponse({
  content,
  onExpandCharts,
}: {
  content: string;
  onExpandCharts?: (charts: ChartData[]) => void;
}) {
  const parsed = parseRichResponse(content);

  return (
    <div className="space-y-4 w-full">
      {parsed.metrics.map((m, i) => (
        <MetricCards key={i} data={m} />
      ))}

      {parsed.charts.map((c, i) => (
        <Chart key={i} chart={c} />
      ))}

      {parsed.tables.map((t, i) => (
        <ChatTable key={i} table={t} />
      ))}

      {parsed.text ? <MarkdownText text={parsed.text} /> : null}

      {parsed.charts.length > 0 && onExpandCharts ? (
        <button
          type="button"
          onClick={() => onExpandCharts(parsed.charts)}
          className="text-xs text-zinc-500 hover:text-zinc-200 transition"
        >
          Expand charts
        </button>
      ) : null}
    </div>
  );
}

