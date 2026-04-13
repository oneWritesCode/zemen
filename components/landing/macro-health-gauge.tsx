type Props = {
  score: number | null;
  period: string | null;
  error?: string | null;
};

function gaugeColor(score: number): string {
  if (score >= 60) return "#34d399";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

/**
 * Semicircular dial: track + progress arc (pathLength 100, dasharray = score).
 */
export function MacroHealthGauge({ score, period, error }: Props) {
  if (error || score === null) {
    return (
      <div className="flex w-full max-w-[280px] flex-col items-center rounded-2xl border border-white/10 bg-[#12121a]/80 p-6 backdrop-blur-sm sm:max-w-[320px]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Zemen Macro Health Score
        </p>
        <div className="mt-6 min-h-[120px] w-full px-2 text-center text-sm leading-relaxed text-zinc-500">
          {error ?? "Score unavailable — check FRED_API_KEY."}
        </div>
      </div>
    );
  }

  const color = gaugeColor(score);
  const dash = `${score} ${100 - score}`;

  return (
    <div className="flex w-full max-w-[280px] flex-col items-center rounded-2xl border border-white/[0.08] bg-[#12121a]/90 p-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:max-w-[320px] sm:p-6">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
        Zemen Macro Health Score
      </p>
      <p className="mt-1 text-center text-xs text-zinc-600">
        0–100 from rates, inflation, jobs, GDP &amp; credit
      </p>

      <div className="mt-1 flex w-full flex-col items-center">
        <svg
          viewBox="0 0 220 118"
          className="h-[118px] w-full max-w-[220px]"
          aria-hidden
        >
          <path
            d="M 28 100 A 82 82 0 0 1 192 100"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={100}
          />
          <path
            d="M 28 100 A 82 82 0 0 1 192 100"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={dash}
          />
        </svg>
        <div className="-mt-14 flex flex-col items-center text-center">
          <span
            className="font-mono text-5xl font-bold tabular-nums tracking-tight sm:text-6xl"
            style={{ color }}
          >
            {score}
          </span>
          <span className="mt-0.5 text-xs text-zinc-500">
            {score >= 60 ? "Strong" : score >= 40 ? "Mixed" : "Stressed"}
          </span>
        </div>
      </div>

      {period ? (
        <p className="mt-4 text-center text-[11px] text-zinc-600">
          Latest inputs · {period}
        </p>
      ) : null}

      <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-600">
        Green ≥60 · Yellow 40–59 · Red under 40 · Heuristic, not advice
      </p>
    </div>
  );
}
