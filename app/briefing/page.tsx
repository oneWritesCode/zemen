import Link from "next/link";

import { getTopicDataset } from "@/lib/fred/get-topic-dataset";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import { formatMetricValue } from "@/lib/format-metric";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";

export const dynamic = "force-dynamic";

type Row = {
  label: string;
  current: string;
  delta: number | null;
  direction: "up" | "down" | "flat";
  economyImpact: "Improving" | "Worsening" | "Mixed";
};

function getEconomyImpact(topicSlug: string, delta: number | null): Row["economyImpact"] {
  if (delta == null) return "Mixed";
  if (["unemployment", "inflation", "credit-spreads"].includes(topicSlug)) {
    return delta <= 0 ? "Improving" : "Worsening";
  }
  if (["gdp-growth", "consumer-sentiment"].includes(topicSlug)) {
    return delta >= 0 ? "Improving" : "Worsening";
  }
  return "Mixed";
}

export default async function BriefingPage() {
  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const [analysis, datasets] = await Promise.all([
    getRegimeAnalysis(),
    Promise.all(DASHBOARD_TOPICS.map((t) => getTopicDataset(t))),
  ]);

  const rows: Row[] = datasets.map((dataset) => {
    const kpi = dataset.kpis[0];
    const latest = dataset.chartRows[dataset.chartRows.length - 1];
    const prev = dataset.chartRows[dataset.chartRows.length - 2];
    const key = kpi?.key;
    const latestNum = key && typeof latest?.[key] === "number" ? (latest[key] as number) : null;
    const prevNum = key && typeof prev?.[key] === "number" ? (prev[key] as number) : null;
    const delta = latestNum != null && prevNum != null ? latestNum - prevNum : null;
    return {
      label: dataset.topic.label,
      current: kpi ? formatMetricValue(kpi.value, kpi.unit) : "Data not available",
      delta,
      direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
      economyImpact: getEconomyImpact(dataset.topic.slug, delta),
    };
  });

  const meta = REGIME_BY_ID[analysis.current.regime];
  const status =
    analysis.current.confidencePct > 70
      ? "Stable"
      : analysis.current.confidencePct >= 50
        ? "Showing early signs of change"
        : "Transition risk is rising";

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-zinc-100 sm:px-6">
      <article className="mx-auto max-w-5xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Zemen Weekly Briefing - Week of {weekOf}
          </h1>
          <p className="mt-3 text-lg text-zinc-300">
            What happened, what it means, what to watch.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-[#FFD000]">This week in numbers</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="pb-3">Indicator</th>
                  <th className="pb-3">Current value</th>
                  <th className="pb-3">Change from last update</th>
                  <th className="pb-3">Direction for economy</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-white/10">
                    <td className="py-3">{row.label}</td>
                    <td className="py-3">{row.current}</td>
                    <td className="py-3">
                      {row.delta == null
                        ? "Data not available"
                        : `${row.direction === "up" ? "↑" : row.direction === "down" ? "↓" : "→"} ${Math.abs(row.delta).toFixed(2)}`}
                    </td>
                    <td className="py-3">{row.economyImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-[#FFD000]">The big story this week</h2>
          <div className="mt-4 space-y-4 text-zinc-300">
            <p>
              The main macro story is the tug-of-war between inflation progress and policy caution. Price pressure is much lower than the 2022 peak, but the final stretch back to target is slower and more uneven than markets hoped.
            </p>
            <p>
              At the same time, policy stays restrictive enough to keep borrowing costs elevated. That helps avoid a fresh inflation surge, but it also keeps pressure on housing, small businesses, and highly leveraged companies.
            </p>
            <p>
              Trade policy and tariff headlines are adding uncertainty to the 2025-2026 outlook. Economists are watching whether these shocks pass quickly or start feeding into prices and confidence in a more persistent way.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-[#FFD000]">What Zemen is watching</h2>
          <ul className="mt-4 space-y-3 text-zinc-300">
            <li>1. CPI and wage growth: this tells us whether inflation cooling is durable.</li>
            <li>2. Unemployment trend: a fast rise would raise recession risk and policy urgency.</li>
            <li>3. Credit spreads: widening spreads often give early warning of stress before GDP data does.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-[#FFD000]">Regime status</h2>
          <p className="mt-3 text-lg">
            <span style={{ color: meta.color }} className="font-semibold">
              {meta.label}
            </span>{" "}
            → {status}
          </p>
          <p className="mt-2 text-zinc-400">
            Confidence: {analysis.current.confidencePct.toFixed(1)}%. Last updated on {analysis.current.period}.
          </p>
          <Link href="/regime-detector" className="mt-4 inline-block text-sm text-[#FFD000] hover:underline">
            Open full regime explanation
          </Link>
        </section>
      </article>
    </div>
  );
}

