import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { MdOutlineTimeline } from "react-icons/md";

import { HistoricalPlaybookTable } from "@/components/regime/historical-playbook-table";
import type { RegimeAnalysisResult } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";

function FeatureTable({
  row,
  labels,
}: {
  row: NonNullable<RegimeAnalysisResult["current"]["features"]>;
  labels: RegimeAnalysisResult["featureLabels"];
}) {
  const vals = [
    row.fedFunds,
    row.cpiYoY,
    row.unrate,
    row.rgdpYoY,
    row.hySpread,
  ];
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12121a]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] text-zinc-500">
            <th className="px-4 py-3 font-medium">Feature</th>
            <th className="px-4 py-3 font-mono font-medium tabular-nums">Value</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, i) => (
            <tr
              key={label}
              className="border-b border-white/[0.04] last:border-0"
            >
              <td className="px-4 py-2.5 text-zinc-400">{label}</td>
              <td className="px-4 py-2.5 font-mono tabular-nums text-white">
                {vals[i] == null ? (
                  <span className="font-sans text-sm text-zinc-500">Data not available</span>
                ) : (
                  vals[i]!.toFixed(2)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RegimeDetectorContent({ data }: { data: RegimeAnalysisResult }) {
  const meta = REGIME_BY_ID[data.current.regime];

  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-200"
        >
          {data.error}
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-[#ffcc00] hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <FlaskConical className="h-8 w-8 text-[#ffcc00]" aria-hidden />
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Regime detector
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-400">
            k-means (k=5) on monthly macro features from FRED: rates, CPI YoY,
            unemployment, real GDP YoY, and HY OAS. Clusters are matched to
            economic regime labels; confidence reflects soft assignment to the
            latest centroid.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <a
          href="#historical-playbook"
          className="inline-flex max-w-md flex-col gap-0.5 rounded-2xl border border-[#ffcc00]/35 bg-[#ffcc00]/[0.07] px-5 py-4 transition hover:border-[#ffcc00]/55 hover:bg-[#ffcc00]/[0.12]"
        >
          <span className="text-sm font-semibold text-[#ffcc00]">
            Historical playbook
          </span>
          <span className="text-xs leading-snug text-zinc-500">
            Average S&amp;P 500, gold &amp; 10Y bond proxy returns in the 90 &amp;
            180 days after past months like this regime
          </span>
        </a>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Current regime
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          As of <span className="text-zinc-200">{data.current.period}</span>{" "}
          (last month with full inputs)
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-10">
          <div
            className={`flex min-h-[140px] min-w-[min(100%,280px)] flex-col items-center justify-center rounded-2xl border-2 px-10 py-8 ${meta.borderClass} ${meta.bgClass}`}
          >
            <span
              className="font-serif text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: meta.color }}
            >
              {meta.label}
            </span>
            <span className="mt-3 font-mono text-2xl font-semibold tabular-nums text-white">
              {data.current.confidencePct.toFixed(1)}%
            </span>
            <span className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
              confidence
            </span>
          </div>
          <div className="max-w-md flex-1 text-sm leading-relaxed text-zinc-400">
            {meta.description}
          </div>
        </div>

        {data.current.features ? (
          <FeatureTable
            row={data.current.features}
            labels={data.featureLabels}
          />
        ) : null}
      </section>

      {data.historicalPlaybook ? (
        <HistoricalPlaybookTable
          playbook={data.historicalPlaybook}
          regimeMeta={meta}
        />
      ) : (
        <section
          id="historical-playbook"
          className="scroll-mt-24 mt-10 rounded-2xl border border-dashed border-white/15 bg-[#12121a]/50 p-8 text-center text-sm text-zinc-500"
        >
          <p className="font-medium text-zinc-400">Historical playbook</p>
          <p className="mt-2">
            Run the regime model successfully to see forward returns. Check{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-400">
              FRED_API_KEY
            </code>{" "}
            and try again.
          </p>
        </section>
      )}

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <MdOutlineTimeline className="h-6 w-6 text-[#ffcc00]" aria-hidden />
          <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl">
            Regime by year (1995–present)
          </h2>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-zinc-500">
          Each year uses the{" "}
          <strong className="font-medium text-zinc-400">most common</strong>{" "}
          monthly regime; the small percentage is how many months matched that
          regime.
        </p>

        <div className="relative overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#12121a] p-4 sm:p-6">
          <div className="flex min-w-max gap-2 pb-2">
            {data.yearly.map((y) => {
              const r = REGIME_BY_ID[y.regime];
              const pct = Math.round(y.confidence * 100);
              return (
                <div
                  key={y.year}
                  className="flex w-[72px] shrink-0 flex-col items-center gap-2"
                >
                  <span className="text-xs tabular-nums text-zinc-500">
                    {y.year}
                  </span>
                  <div
                    className={`flex h-16 w-full max-w-[72px] items-center justify-center rounded-xl border px-1 text-center ${r.borderClass} ${r.bgClass}`}
                    title={`${r.label} · ${pct}% of months`}
                  >
                    <span
                      className="line-clamp-3 text-[9px] font-semibold leading-tight"
                      style={{ color: r.color }}
                    >
                      {r.shortLabel}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-zinc-500">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-zinc-600">
        Model: {data.meta.nObs} monthly observations · Not investment advice.
      </p>
    </div>
  );
}
