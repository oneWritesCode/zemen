"use client";

import { HiArrowPath } from "react-icons/hi2";
import { MdOutlineAreaChart } from "react-icons/md";

type Props = {
  title: string;
  errorMessage: string;
  onRetry: () => void;
};

export function ChartRetryCard({
  title,
  errorMessage,
  onRetry,
}: Props) {
  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-red-500/25 bg-[#12121a] p-4 pb-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <MdOutlineAreaChart className="h-5 w-5 text-red-400/90" aria-hidden />
        <h3 className="font-serif text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-red-200/90">{errorMessage}</p>
      <div className="mt-auto flex flex-1 flex-col items-center justify-center gap-3 pt-6">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <HiArrowPath className="h-4 w-4" aria-hidden />
          Retry
        </button>
      </div>
    </div>
  );
}
