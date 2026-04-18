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
          open?: Array<number | null>;
        }>;
        adjclose?: Array<{
          adjclose?: Array<number | null>;
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
  const encodedTicker = encodeURIComponent(params.ticker);
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodedTicker}?period1=${p1}&interval=1d&events=history`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodedTicker}?period1=${p1}&interval=1d&events=history`,
  ];

  let json: YahooChartResponse | null = null;
  let lastErr = "unknown Yahoo error";

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        // Cache is fine; sectors aren't trading execution.
        next: { revalidate: 60 * 60 },
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; ZemenBot/1.0)",
          accept: "application/json,text/plain,*/*",
        },
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) {
        lastErr = `Yahoo request failed (${res.status}) for ${params.ticker}`;
        continue;
      }
      json = (await res.json()) as YahooChartResponse;
      break;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : "network error";
    }
  }

  if (!json) throw new Error(lastErr);

  const result = json.chart?.result?.[0];
  const err = json.chart?.error?.description;
  if (!result || err) throw new Error(err || `Yahoo returned no data for ${params.ticker}`);

  const ts = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const adj = result.indicators?.adjclose?.[0]?.adjclose ?? [];
  const opens = result.indicators?.quote?.[0]?.open ?? [];
  const out: ParsedObservation[] = [];

  for (let i = 0; i < ts.length && i < closes.length; i++) {
    const t = ts[i];
    const c = adj[i] ?? closes[i] ?? opens[i] ?? null;
    if (typeof t !== "number") continue;
    if (typeof c !== "number" || !Number.isFinite(c)) continue;
    out.push({ date: toIso(new Date(t * 1000)), value: c });
  }

  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return out;
}

