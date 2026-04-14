import type { ParsedObservation } from "@/lib/fred/types";

function toIso(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          close?: Array<number | null>;
        }>;
      };
    }>;
    error?: { description?: string } | null;
  };
};

function epochSeconds(iso: string): number {
  const ms = Date.parse(`${iso}T00:00:00Z`);
  return Math.floor(ms / 1000);
}

/**
 * Fetches daily closes from Yahoo Finance.
 * Returns an ascending array of `{ date: YYYY-MM-DD, value }`.
 */
export async function fetchYahooDailyCloseSeries(params: {
  ticker: string;
  start: string; // YYYY-MM-DD
}): Promise<ParsedObservation[]> {
  const p1 = epochSeconds(params.start);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(params.ticker)}?period1=${p1}&interval=1d&events=history`;

  const res = await fetch(url, {
    // Cache is fine; playbook isn't a trading app.
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) throw new Error(`Yahoo request failed (${res.status}) for ${params.ticker}`);
  const json = (await res.json()) as YahooChartResponse;
  const result = json.chart?.result?.[0];
  const err = json.chart?.error?.description;
  if (!result || err) throw new Error(err || `Yahoo returned no data for ${params.ticker}`);

  const ts = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const out: ParsedObservation[] = [];

  for (let i = 0; i < ts.length && i < closes.length; i++) {
    const t = ts[i];
    const c = closes[i];
    if (typeof t !== "number") continue;
    if (typeof c !== "number" || !Number.isFinite(c)) continue;
    out.push({ date: toIso(new Date(t * 1000)), value: c });
  }

  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return out;
}

