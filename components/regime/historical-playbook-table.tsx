import { BookOpen } from "lucide-react";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";

import type { HistoricalPlaybook } from "@/lib/regime/playbook";
import type { RegimeMeta } from "@/lib/regime/types";

function ReturnCell({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-zinc-500">Data not available</span>;
  }
  const up = value >= 0;
  return (
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
      className="scroll-mt-24 mt-10 rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 sm:p-8"
    >
      <div className="mb-2 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-[#ffcc00]" aria-hidden />
        <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl">
          Historical playbook
        </h2>
      </div>
      {playbook.loadError ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
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
            <tr className="border-b border-white/[0.08] bg-black/20 text-zinc-500">
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Avg. 90 days</th>
              <th className="px-4 py-3 font-medium">Avg. 180 days</th>
            </tr>
          </thead>
          <tbody>
            {playbook.rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-white/[0.04] last:border-0"
              >
                <td className="px-4 py-3.5 text-zinc-300">{row.label}</td>
                <td className="px-4 py-3.5">
                  <ReturnCell value={row.return90} />
                </td>
                <td className="px-4 py-3.5">
                  <ReturnCell value={row.return180} />
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
        with 180 days (through latest FRED data). Sample counts per cell can be
        lower if a series has gaps.
      </p>
    </section>
  );
}
