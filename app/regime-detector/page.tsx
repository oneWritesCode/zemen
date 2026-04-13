import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { RegimeDetectorContent } from "@/components/regime/regime-detector-content";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Regime detector",
  description:
    "Macro regime classification from FRED data using k-means clustering.",
};

export default async function RegimeDetectorPage() {
  const data = await getRegimeAnalysis();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <div className="border-b border-white/[0.08] bg-[#0a0a0b]/95">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Dashboard
          </Link>
          <span className="text-zinc-700">|</span>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            Home
          </Link>
        </div>
      </div>
      <RegimeDetectorContent data={data} />
    </div>
  );
}
