import Link from "next/link";

import { getTopicDataset } from "@/lib/fred/get-topic-dataset";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import { formatMetricValue } from "@/lib/format-metric";
import { getFreshnessLabel } from "@/lib/freshness";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { fetchYahooDailyCloseSeries } from "@/lib/market/yahoo";
import { StreakBanner } from "@/components/global/streak-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SidebarShell } from "@/components/site/sidebar-shell";
import { PageWrapper } from "@/components/ui/animations";

export const dynamic = "force-dynamic";

type Row = {
  label: string;
  current: string;
  delta: number | null;
  direction: "up" | "down" | "flat";
  economyImpact: "Improving" | "Worsening" | "Stable" | "Mixed" | "Unknown";
  updatedText: string;
};

function getDirection(
  indicatorName: string,
  current: number | null,
  previous: number | null,
): Row["economyImpact"] {
  const lowerIsBetter = [
    "Interest Rates",
    "Inflation",
    "Unemployment",
    "Housing Market",
    "Credit & Spreads",
  ];
  const higherIsBetter = ["GDP Growth", "Stock Market", "Consumer Sentiment"];
  const neutral = ["Gold", "Trade & Dollar"];

  if (current == null || previous == null) return "Unknown";
  const change = current - previous;

  if (lowerIsBetter.includes(indicatorName)) {
    if (change < -0.1) return "Improving";
    if (change > 0.1) return "Worsening";
    return "Stable";
  }
  if (higherIsBetter.includes(indicatorName)) {
    if (change > 0.1) return "Improving";
    if (change < -0.1) return "Worsening";
    return "Stable";
  }
  if (neutral.includes(indicatorName)) return "Mixed";
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

  const bySlug = new Map(datasets.map((d) => [d.topic.slug, d]));

  const pick = (slug: string, key: string) => {
    const d = bySlug.get(slug);
    const k = d?.kpis.find((x) => x.key === key) ?? null;
    return { dataset: d ?? null, kpi: k };
  };

  const marketRow = async (label: string, ticker: string): Promise<Row> => {
    const daily = await fetchYahooDailyCloseSeries({ ticker, start: "1995-01-01" }).catch(() => []);
    const last = daily.at(-1) ?? null;
    const prev = daily.at(-2) ?? null;
    const current = last?.value ?? null;
    const previous = prev?.value ?? null;
    const delta = current != null && previous != null ? current - previous : null;
    return {
      label,
      current:
        current == null
          ? "Awaiting data"
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(current),
      delta,
      direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
      economyImpact: getDirection(label, current, previous),
      updatedText: getFreshnessLabel(last?.date ?? null).text,
    };
  };

  const rows: Row[] = [
    (() => {
      const { dataset, kpi } = pick("interest-rates", "fed");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.fed === "number" ? (last.fed as number) : null;
      const pr = typeof prev?.fed === "number" ? (prev.fed as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Interest Rates",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Interest Rates", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("inflation", "cpiYoy");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.cpiYoy === "number" ? (last.cpiYoy as number) : null;
      const pr = typeof prev?.cpiYoy === "number" ? (prev.cpiYoy as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Inflation",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Inflation", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("unemployment", "u3");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.u3 === "number" ? (last.u3 as number) : null;
      const pr = typeof prev?.u3 === "number" ? (prev.u3 as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Unemployment",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Unemployment", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("gdp-growth", "rgdpGrowth");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.rgdpGrowth === "number" ? (last.rgdpGrowth as number) : null;
      const pr = typeof prev?.rgdpGrowth === "number" ? (prev.rgdpGrowth as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "GDP Growth",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("GDP Growth", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("housing", "mort30");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.mort30 === "number" ? (last.mort30 as number) : null;
      const pr = typeof prev?.mort30 === "number" ? (prev.mort30 as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Housing Market",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Housing Market", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("credit-spreads", "hy");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.hy === "number" ? (last.hy as number) : null;
      const pr = typeof prev?.hy === "number" ? (prev.hy as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Credit & Spreads",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "percent"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Credit & Spreads", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
  ];

  const marketRows = await Promise.all([
    marketRow("Gold", "GC=F"),
    marketRow("Stock Market", "^GSPC"),
  ]);

  rows.push(...marketRows);

  rows.push(
    (() => {
      const { dataset, kpi } = pick("trade-dollar", "dxybroad");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.dxybroad === "number" ? (last.dxybroad as number) : null;
      const pr = typeof prev?.dxybroad === "number" ? (prev.dxybroad as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Trade & Dollar",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "index"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Trade & Dollar", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
    (() => {
      const { dataset, kpi } = pick("consumer-sentiment", "umich");
      const r = dataset?.chartRows ?? [];
      const last = r.at(-1);
      const prev = r.at(-2);
      const cur = typeof last?.umich === "number" ? (last.umich as number) : null;
      const pr = typeof prev?.umich === "number" ? (prev.umich as number) : null;
      const delta = cur != null && pr != null ? cur - pr : null;
      return {
        label: "Consumer Sentiment",
        current: formatMetricValue(kpi?.value ?? null, kpi?.unit ?? "index"),
        delta,
        direction: delta == null ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
        economyImpact: getDirection("Consumer Sentiment", cur, pr),
        updatedText: getFreshnessLabel(kpi?.updatedAt ?? null).text,
      };
    })(),
  );

  const meta = REGIME_BY_ID[analysis.current.regime];
  const status =
    analysis.current.confidencePct > 70
      ? "Stable"
      : analysis.current.confidencePct >= 50
        ? "Showing early signs of change"
        : "Transition risk is rising";

  return (
    <SidebarShell>
      <PageWrapper>
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-zinc-100 sm:px-6">
        <article className="mx-auto max-w-5xl space-y-8">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Weekly Briefing', href: null }
            ]} 
          />
          <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Zemen Weekly Briefing - Week of {weekOf}
            </h1>
            <p className="mt-3 text-lg text-zinc-300">
              What happened, what it means, what to watch.
            </p>
          </div>
          <StreakBanner />
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-[#FFFFFF]">This week in numbers</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-zinc-400">
                <tr>
                  <th className="pb-3">Indicator</th>
                  <th className="pb-3">Current value</th>
                  <th className="pb-3">Freshness</th>
                  <th className="pb-3">Change from last update</th>
                  <th className="pb-3">Direction for economy</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-white/10">
                    <td className="py-3">{row.label}</td>
                    <td className="py-3">{row.current}</td>
                    <td className="py-3 text-zinc-400">{row.updatedText}</td>
                    <td className="py-3">
                      {row.delta == null
                        ? "Awaiting data"
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
          <h2 className="text-xl font-semibold text-white">The big story this week</h2>
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
          <h2 className="text-xl font-semibold text-white">What Zemen is watching</h2>
          <ul className="mt-4 space-y-3 text-zinc-300">
            <li>1. CPI and wage growth: this tells us whether inflation cooling is durable.</li>
            <li>2. Unemployment trend: a fast rise would raise recession risk and policy urgency.</li>
            <li>3. Credit spreads: widening spreads often give early warning of stress before GDP data does.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="text-xl font-semibold text-white">Regime status</h2>
          <p className="mt-3 text-lg">
            <span style={{ color: meta.color }} className="font-semibold">
              {meta.label}
            </span>{" "}
            → {status}
          </p>
          <p className="mt-2 text-zinc-400">
            Confidence: {analysis.current.confidencePct.toFixed(1)}%. Last updated on {analysis.current.period}.
          </p>
          <Link href="/regime" className="mt-4 inline-block text-sm text-white hover:underline">
            Open full regime explanation
          </Link>
        </section>
      </article>
    </div>
    </PageWrapper>
  </SidebarShell>
  );
}

