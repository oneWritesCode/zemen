import Link from "next/link";
import { FlaskConical, BookOpen, Calendar } from "lucide-react";
import { MdOutlineTimeline } from "react-icons/md";

import type { RegimeAnalysisResult } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";

import { RegimePredictionWidget } from "@/components/regime/regime-prediction-widget";

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
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Input Features
        </p>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-zinc-600">
            <th className="px-4 py-3 font-medium text-xs">Feature</th>
            <th className="px-4 py-3 font-mono font-medium text-xs tabular-nums">Value</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, i) => (
            <tr
              key={label}
              className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition"
            >
              <td className="px-4 py-2.5 text-zinc-400 text-sm">{label}</td>
              <td className="px-4 py-2.5 font-mono tabular-nums text-white text-sm">
                {vals[i] == null ? (
                  <span className="font-sans text-sm text-zinc-600">—</span>
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
          className="rounded-2xl border border-red-500/20 bg-red-950/30 px-5 py-4 text-sm text-red-300"
        >
          {data.error}
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/dashboard" className="text-zinc-300 hover:text-white underline underline-offset-2">
            Back to dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page header */}
      <div className="mb-10 flex flex-wrap items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08]">
          <FlaskConical className="h-5 w-5 text-zinc-300" aria-hidden />
        </div>
        <div>
          <h1 className="font-bold text-3xl tracking-tight text-white sm:text-4xl">
            Regime Detector
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-zinc-500 leading-relaxed">
            k-means (k=5) on monthly macro features from FRED: rates, CPI YoY,
            unemployment, real GDP YoY, and HY OAS. Confidence reflects soft assignment to the
            latest centroid.
          </p>
        </div>
      </div>

      {/* Historical playbook shortcut */}
      <div className="mb-8">
        <Link
          href="/regime/playbook"
          className="inline-flex max-w-md flex-col gap-0.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 transition hover:border-white/[0.14] hover:bg-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-200">Historical Playbook</span>
          </div>
          <span className="text-xs leading-snug text-zinc-500">
            Average S&amp;P 500, gold &amp; 10Y bond proxy returns in the 90 &amp;
            180 days after past months like this regime
          </span>
        </Link>
      </div>

      {/* Current regime card */}
      <section className="rounded-2xl border border-white/[0.07] bg-[#0e0e10] overflow-hidden">
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}40, transparent)` }}
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.15em]">
              Current Regime
            </p>
          </div>
          <p className="text-sm text-zinc-500 mb-8">
            As of <span className="text-zinc-200 font-medium">{data.current.period}</span>{" "}
            (last month with full inputs)
          </p>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-10">
            <div
              className={`flex min-h-[140px] min-w-[min(100%,260px)] flex-col items-center justify-center rounded-2xl border-2 px-10 py-8 ${meta.borderClass} ${meta.bgClass}`}
            >
              <span
                className="font-bold text-3xl tracking-tight sm:text-4xl"
                style={{ color: meta.color }}
              >
                {meta.label}
              </span>
              <span className="mt-3 font-mono text-2xl font-semibold tabular-nums text-white">
                {data.current.confidencePct.toFixed(1)}%
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
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
        </div>
      </section>

      {data.historicalPlaybook ? null : (
        <section
          id="historical-playbook"
          className="scroll-mt-24 mt-8 rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.01] p-8 text-center text-sm text-zinc-500"
        >
          <p className="font-medium text-zinc-400">Historical Playbook</p>
          <p className="mt-2">
            Run the regime model successfully to see forward returns. Check{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-zinc-400">
              FRED_API_KEY
            </code>{" "}
            and try again.
          </p>
        </section>
      )}

      {/* Regime by year */}
      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2.5">
          <MdOutlineTimeline className="h-5 w-5 text-zinc-400" aria-hidden />
          <h2 className="font-bold text-xl text-white sm:text-2xl">
            Regime by Year (1995–present)
          </h2>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-zinc-500">
          Each year uses the{" "}
          <strong className="font-medium text-zinc-400">most common</strong>{" "}
          monthly regime; the percentage is how many months matched that regime.
        </p>

        <div className="relative overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-4 sm:p-6">
          <div className="flex min-w-max gap-2 pb-2">
            {data.yearly.map((y) => {
              const r = REGIME_BY_ID[y.regime];
              const pct = Math.round(y.confidence * 100);
              return (
                <div
                  key={y.year}
                  className="flex w-[70px] shrink-0 flex-col items-center gap-2"
                >
                  <span className="text-[10px] tabular-nums text-zinc-600">
                    {y.year}
                  </span>
                  <div
                    className={`flex h-14 w-full max-w-[70px] items-center justify-center rounded-xl border px-1 text-center cursor-default transition hover:opacity-80 ${r.borderClass} ${r.bgClass}`}
                    title={`${r.label} · ${pct}% of months`}
                  >
                    <span
                      className="line-clamp-3 text-[9px] font-bold leading-tight"
                      style={{ color: r.color }}
                    >
                      {r.shortLabel}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tabular-nums text-zinc-600">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <RegimePredictionWidget currentRegimeId={data.current.regime} />

      <p className="mt-10 text-center text-xs text-zinc-700">
        Model: {data.meta.nObs} monthly observations · Not investment advice.
      </p>
    </div>
  );
}
