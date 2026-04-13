import { NextResponse } from "next/server";

import { ingestMacroMonthlyPanel } from "@/lib/fred";

export const dynamic = "force-dynamic";

/**
 * Dev / integration endpoint: returns the merged monthly macro panel from FRED.
 * Requires `FRED_API_KEY` in the environment.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const observationStart = searchParams.get("observationStart") ?? undefined;

  try {
    const rows = await ingestMacroMonthlyPanel({ observationStart });
    const last = rows[rows.length - 1];
    return NextResponse.json({
      meta: {
        observationStart: observationStart ?? "1970-01-01",
        rowCount: rows.length,
        lastPeriod: last?.period ?? null,
      },
      rows,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const isConfig = message.includes("FRED_API_KEY");
    return NextResponse.json(
      { error: message },
      { status: isConfig ? 503 : 502 },
    );
  }
}
