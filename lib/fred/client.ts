import type { FredObservationsResponse, ParsedObservation } from "./types";

const FRED_OBSERVATIONS_URL = "https://api.stlouisfed.org/fred/series/observations";

export type FetchFredObservationsParams = {
  seriesId: string;
  observationStart?: string;
  observationEnd?: string;
  /** FRED default is 1000; macro histories need more. */
  limit?: number;
};

function requireFredApiKey(): string {
  const key = process.env.FRED_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing FRED_API_KEY. Add it to .env.local (see .env.example).",
    );
  }
  return key;
}

function parseValue(raw: string): number | null {
  if (raw === "." || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function parseFredObservations(
  rows: FredObservationsResponse["observations"],
): ParsedObservation[] {
  const out: ParsedObservation[] = [];
  for (const row of rows) {
    const v = parseValue(row.value);
    if (v === null) continue;
    out.push({ date: row.date, value: v });
  }
  return out;
}

/**
 * Fetches all observations for a series, following FRED pagination (`offset`).
 */
export async function fetchFredObservations(
  params: FetchFredObservationsParams,
): Promise<ParsedObservation[]> {
  const apiKey = requireFredApiKey();
  const limit = params.limit ?? 10_000;
  const aggregated: ParsedObservation[] = [];
  let offset = 0;

  for (;;) {
    const search = new URLSearchParams({
      series_id: params.seriesId,
      api_key: apiKey,
      file_type: "json",
      sort_order: "asc",
      limit: String(limit),
      offset: String(offset),
    });
    if (params.observationStart)
      search.set("observation_start", params.observationStart);
    if (params.observationEnd) search.set("observation_end", params.observationEnd);

    const url = `${FRED_OBSERVATIONS_URL}?${search.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `FRED request failed (${res.status}) for ${params.seriesId}: ${body.slice(0, 500)}`,
      );
    }

    const json = (await res.json()) as FredObservationsResponse;
    const batch = parseFredObservations(json.observations);
    aggregated.push(...batch);

    const count = json.observations?.length ?? 0;
    if (count < limit) break;
    offset += limit;
  }

  return aggregated;
}
