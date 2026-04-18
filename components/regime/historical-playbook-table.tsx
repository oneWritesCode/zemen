import { BookOpen } from "lucide-react";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";

import type { HistoricalPlaybook } from "@/lib/regime/playbook";
import type { RegimeMeta } from "@/lib/regime/types";

function ReturnCell({ value, n }: { value: number | null; n: number }) {
  if (value === null) {
    return (
      <span className="text-xs text-zinc-500">
        {n > 0 ? `Insufficient history (n=${n})` : "Insufficient data"}
      </span>
    );
  }
  const up = value >= 0;
  return (
    <span className="inline-flex flex-col items-center justify-center">
      <span
        className={`inline-flex items-center justify-center gap-1.5 font-mono text-sm font-medium tabular-nums sm:text-base ${
          up ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {up ? (
          <TbArrowBigUp className="h-5 w-5 shrink-0" aria-hidden />
        ) : (
          <TbArrowBigDown className="h-5 w-5 shrink-0" aria-hidden />
        )}
        {up ? "+" : ""}
        {value.toFixed(2)}%
      </span>
      <span className="mt-0.5 text-[10px] text-zinc-600">{`n=${n}`}</span>
    </span>
  );
}

export function HistoricalPlaybookTable({
  playbook,
  regimeMeta,
}: {
  playbook: HistoricalPlaybook;
  regimeMeta: RegimeMeta;
}) {
  return (
    <section
      id="historical-playbook"
      className="scroll-mt-24 mt-8 rounded-2xl border border-white/[0.07] bg-[#0e0e10] overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.07]">
            <BookOpen className="h-4 w-4 text-zinc-400" aria-hidden />
          </div>
          <h2 className="font-bold text-xl text-white sm:text-2xl">
            Historical Playbook
          </h2>
        </div>

        {playbook.loadError ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-amber-500/20 bg-amber-950/30 px-4 py-3 text-sm text-amber-300/80"
          >
            <strong className="font-medium">Could not load full playbook.</strong>{" "}
            {playbook.loadError}
          </div>
        ) : null}

        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Average forward performance after past months that{" "}
          <strong className="font-medium text-zinc-300">first entered</strong> a{" "}
          <span style={{ color: regimeMeta.color }}>{regimeMeta.label}</span>{" "}
          spell (same clustering label as today). Windows are{" "}
          <strong className="font-medium text-zinc-300">calendar</strong> days
          from month-end.
        </p>

        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-black/20 text-zinc-500">
                <th className="px-4 py-3 font-medium text-xs">Asset</th>
                <th className="px-4 py-3 font-medium text-xs">Avg. 90 days</th>
                <th className="px-4 py-3 font-medium text-xs">Avg. 180 days</th>
              </tr>
            </thead>
            <tbody>
              {playbook.rows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition"
                >
                  <td className="px-4 py-3.5 text-zinc-300 text-sm">{row.label}</td>
                  <td className="px-4 py-3.5">
                    <ReturnCell value={row.return90} n={row.return90N} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ReturnCell value={row.return180} n={row.return180N} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-zinc-600">
          {playbook.methodNote} Eligible regime entries:{" "}
          <span className="tabular-nums text-zinc-500">{playbook.episodes90}</span>{" "}
          with a full 90-day window;{" "}
          <span className="tabular-nums text-zinc-500">
            {playbook.episodes180}
          </span>{" "}
          with 180 days. Sample counts per cell can be lower if a series has gaps.
        </p>
      </div>
    </section>
  );
}
