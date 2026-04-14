import { NextResponse } from "next/server";

import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getRegimeAnalysis();
  const current = result.current;
  const label = REGIME_BY_ID[current.regime].label;

  let lastTransitionYear: number | null = null;
  for (let i = result.monthly.length - 2; i >= 0; i--) {
    if (result.monthly[i]?.regime !== current.regime) {
      const y = Number(result.monthly[i]?.period.slice(0, 4));
      lastTransitionYear = Number.isFinite(y) ? y : null;
      break;
    }
  }

  return NextResponse.json({
    regime: label,
    confidence: current.confidencePct,
    updatedAt: current.period || "N/A",
    lastTransitionYear,
  });
}

