"use client";

import Link from "next/link";
import { FlaskConical, BookOpen, Calendar, RefreshCw, CheckCircle } from "lucide-react";
import { MdOutlineTimeline } from "react-icons/md";
import { useState } from "react";

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
    row.m2YoY,
    row.housingYoY,
    row.yieldCurve,
    row.consumerSentiment,
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

function ContributorsList({
  contributors,
  isFallback,
}: {
  contributors: string[];
  isFallback?: boolean;
}) {
  if (!contributors || contributors.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Key Contributing Factors
        </p>
      </div>
      <div className="px-4 py-3 space-y-2">
        {contributors.map((contributor, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60"></div>
            <span>{contributor}</span>
          </div>
        ))}
        {isFallback && (
          <p className="mt-2 text-xs text-zinc-500 italic">
            Analysis based on rule-based detection due to limited historical data.
          </p>
        )}
      </div>
    </div>
  );
}

export function RegimeDetectorContent({ data }: { data: RegimeAnalysisResult }) {
  const meta = REGIME_BY_ID[data.current.regime];
  const [isRerunning, setIsRerunning] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    points?: number;
  } | null>(null);

  const handleRerun = async () => {
    setIsRerunning(true);
    setNotification(null);
    
    try {
      const response = await fetch('/api/regime/rerun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: result.message,
          points: result.pointsAwarded,
        });
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({
          type: 'error',
          message: result.error,
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to re-run regime detection. Please try again.',
      });
    } finally {
      setIsRerunning(false);
    }
  };

  if (data.error && !data.current.period) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-950/10 px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Regime Detection Unavailable</h3>
              <p className="text-zinc-400 text-sm mt-1">
                {data.error}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/[0.05]">
            <p className="text-zinc-300 text-sm mb-3">
              <strong>Current Assessment:</strong> Unable to determine regime due to data limitations.
            </p>
            <p className="text-zinc-400 text-xs">
              Please check your FRED API key configuration and try again later.
            </p>
          </div>
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
            <>
              <FeatureTable
                row={data.current.features}
                labels={data.featureLabels}
              />
              {data.current.contributors && (
                <ContributorsList
                  contributors={data.current.contributors}
                  isFallback={data.current.isFallback}
                />
              )}
            </>
          ) : null}

          {/* Notification */}
          {notification && (
            <div className={`mt-4 p-3 rounded-lg border ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <FlaskConical className="h-4 w-4" />
                )}
                <span className="text-sm">{notification.message}</span>
                {notification.points && (
                  <span className="ml-auto font-mono text-xs bg-yellow-500/20 px-2 py-1 rounded">
                    +{notification.points} ZP
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Re-run button */}
          <div className="mt-6">
            <button
              onClick={handleRerun}
              disabled={isRerunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRerunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <FlaskConical className="h-4 w-4" />
                  Re-run Regime Detection
                </>
              )}
            </button>
          </div>
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

      {/* Learn section */}
      <section className="mt-12">
        <details className="group">
          <summary className="cursor-pointer rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-6 transition-colors hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-zinc-400" />
                <h3 className="font-semibold text-white">Learn how regimes work</h3>
              </div>
              <div className="text-zinc-500 group-open:rotate-180 transition-transform">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Understand how we detect and classify economic regimes
            </p>
          </summary>
          <div className="mt-6 space-y-4 text-sm text-zinc-400">
            <div>
              <h4 className="font-semibold text-white mb-2">What are Economic Regimes?</h4>
              <p>Economic regimes are distinct periods in the business cycle characterized by specific patterns in key macroeconomic indicators. We identify five main regimes:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                <h5 className="font-medium text-yellow-500 mb-1">Goldilocks</h5>
                <p className="text-xs">Moderate growth, low inflation, stable employment</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                <h5 className="font-medium text-green-500 mb-1">Recovery</h5>
                <p className="text-xs">Strong growth, improving employment, supportive policy</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                <h5 className="font-medium text-orange-500 mb-1">Overheating</h5>
                <p className="text-xs">High inflation, tight labor market, rising rates</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                <h5 className="font-medium text-red-500 mb-1">Stagflation</h5>
                <p className="text-xs">High inflation + high unemployment + weak growth</p>
              </div>
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                <h5 className="font-medium text-purple-500 mb-1">Recession</h5>
                <p className="text-xs">Negative growth, high unemployment, falling rates</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">How We Detect Regimes</h4>
              <p>We use machine learning (k-means clustering) on 8 key macro indicators to identify patterns and classify the current economic environment. When data is limited, we fall back to rule-based detection using economic thresholds.</p>
            </div>
          </div>
        </details>
      </section>

      <p className="mt-10 text-center text-xs text-zinc-700">
        {data.current.isFallback ? (
          <>Rule-based analysis · Not investment advice.</>
        ) : (
          <>Model: {data.meta.nObs} monthly observations · Not investment advice.</>
        )}
      </p>
    </div>
  );
}
