import { NextResponse } from "next/server";

import { fetchFredObservations } from "@/lib/fred/client";
import { monthlyLastByPeriod } from "@/lib/fred/monthly";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";
import { buildRegimeFeatureRows } from "@/lib/regime/build-panel";
import { fetchYahooDailyCloseSeries } from "@/lib/market/yahoo";

export const dynamic = "force-dynamic";

type Body = {
  messages?: { role: "user" | "assistant"; content: string }[];
  mode?: "SIMPLE" | "DETAILED" | "RAW";
};

function latestMonthlyValue(obs: { date: string; value: number }[]): { value: number | null; date: string | null } {
  if (!obs.length) return { value: null, date: null };
  const m = monthlyLastByPeriod(obs);
  const lastPeriod = [...m.keys()].sort().at(-1) ?? null;
  if (!lastPeriod) return { value: null, date: null };
  return { value: m.get(lastPeriod) ?? null, date: lastPeriod ? `${lastPeriod}-01` : null };
}

async function safeFredSeries(seriesId: string, start: string) {
  try {
    return await fetchFredObservations({ seriesId, observationStart: start });
  } catch {
    return [];
  }
}

async function safeYahooLastClose(ticker: string) {
  try {
    const rows = await fetchYahooDailyCloseSeries({ ticker, start: "1995-01-01" });
    const last = rows.at(-1);
    return last ? { value: last.value, date: last.date } : { value: null, date: null };
  } catch {
    return { value: null, date: null };
  }
}

export async function POST(req: Request) {
  // Primary: Groq Chat Completions with llama-3.3-70b-versatile.
  // Back-compat: some environments may have stored the Groq key in ANTHROPIC_API_KEY by mistake.
  const groqKey =
    process.env.GROQ_API_KEY ??
    (process.env.ANTHROPIC_API_KEY?.startsWith("gsk_")
      ? process.env.ANTHROPIC_API_KEY
      : undefined);

  if (!groqKey) {
    return NextResponse.json(
      {
        error:
          "Missing GROQ_API_KEY. Add it to .env/.env.local to enable Ask Zemen (llama-3.3-70b-versatile).",
      },
      { status: 500 },
    );
  }

  const body = (await req.json()) as Body;
  const messages = body.messages?.slice(-10) ?? [];
  const userMessages = messages.filter((m) => m.role === "user");
  const mode = body.mode === "SIMPLE" || body.mode === "RAW" ? body.mode : "DETAILED";

  const regime = await getRegimeAnalysis();
  const meta = REGIME_BY_ID[regime.current.regime];

  // Live macro snapshot (best-effort; never throw).
  const [featureRows, dgs10, baa10y, umich, dtwex, gdpGrowth, corePce, spx] = await Promise.all([
    buildRegimeFeatureRows("1995-01-01").catch(() => []),
    safeFredSeries("DGS10", "1995-01-01"),
    safeFredSeries("BAA10Y", "1995-01-01"),
    safeFredSeries("UMCSENT", "1995-01-01"),
    safeFredSeries("DTWEXBGS", "1995-01-01"),
    safeFredSeries("A191RL1Q225SBEA", "1995-01-01"),
    safeFredSeries("PCEPILFE", "1994-01-01"),
    safeYahooLastClose("^GSPC"),
  ]);

  const last = featureRows.at(-1) ?? null;
  const fedFunds = last?.fedFunds ?? null;
  const cpiYoy = last?.cpiYoY ?? null;
  const unrate = last?.unrate ?? null;
  const gdpYoy = last?.rgdpYoY ?? null;
  const hy = last?.hySpread ?? null;

  const t10 = latestMonthlyValue(dgs10).value;
  const baa = latestMonthlyValue(baa10y).value;
  const sent = latestMonthlyValue(umich).value;
  const usd = latestMonthlyValue(dtwex).value;
  const gdpQoqAnn = latestMonthlyValue(gdpGrowth).value;

  // Core PCE YoY from index.
  let corePceYoy: number | null = null;
  if (corePce.length) {
    const m = monthlyLastByPeriod(corePce);
    const periods = [...m.keys()].sort();
    const p = periods.at(-1);
    if (p) {
      const y = String(Number(p.slice(0, 4)) - 1);
      const prevP = `${y}-${p.slice(5, 7)}`;
      const cur = m.get(p) ?? null;
      const prev = m.get(prevP) ?? null;
      if (cur != null && prev != null && prev !== 0) corePceYoy = (cur / prev - 1) * 100;
    }
  }

  const system = `You are Zemen, an expert macroeconomic intelligence assistant built into the Zemen Macro Intelligence platform. You have deep knowledge of economics, financial markets, and historical economic cycles.

CURRENT ECONOMIC DATA (updated live):
- Current Regime: ${meta.label}
- Regime Confidence: ${regime.current.confidencePct.toFixed(1)}%
- Fed Funds Rate: ${fedFunds ?? "N/A"}%
- CPI Inflation YoY: ${cpiYoy ?? "N/A"}%
- Core PCE: ${corePceYoy ?? "N/A"}%
- Unemployment Rate: ${unrate ?? "N/A"}%
- GDP Growth: ${gdpQoqAnn ?? gdpYoy ?? "N/A"}%
- 10Y Treasury: ${t10 ?? "N/A"}%
- Credit Spread (BAA): ${baa ?? hy ?? "N/A"}%
- Consumer Sentiment: ${sent ?? "N/A"}
- S&P 500: ${spx.value ?? "N/A"}
- USD Index: ${usd ?? "N/A"}

RESPONSE MODE: ${mode}

IF RESPONSE MODE IS "SIMPLE":
- Answer in 2-4 plain sentences
- No jargon, no technical terms
- No charts or tables
- Speak like explaining to a curious teenager
- End with one key takeaway

IF RESPONSE MODE IS "DETAILED":
- Start with a 1 sentence direct answer
- Use bullet points for key facts (4-6 bullets)
- Include a CHART_DATA block if the question involves any time series or comparison data
- Include a TABLE_DATA block if comparing 3 or more things across 2 or more dimensions
- Use METRIC_DATA block for 2-4 key current numbers
- End with "What to watch:" followed by 2 bullet points on what to monitor next
- Keep total response under 350 words of text
- Light jargon allowed but always explain it

IF RESPONSE MODE IS "RAW / ANALYST":
- Start with executive summary (2 sentences)
- Full bullet point breakdown with sub-bullets
- Always include CHART_DATA with full historical data
- Always include TABLE_DATA with all relevant numbers
- Include METRIC_DATA for all relevant indicators
- Use correct technical terminology
- Reference specific historical analogues
- Include a "Risk factors" section
- Include a "Consensus vs Zemen view" section
- End with numbered "Key signals to watch"
- No word limit

FORMATTING RULES FOR ALL MODES:
- CHART_DATA must be on its own line
- TABLE_DATA must be on its own line
- METRIC_DATA must be on its own line
- These blocks must be valid JSON
- Never put CHART_DATA inside a sentence
- Always put these blocks BEFORE the text explanation`;

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        ...userMessages.map((m) => ({ role: "user", content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const lower = errorText.toLowerCase();
    if (
      lower.includes("model") &&
      (lower.includes("deprec") ||
        lower.includes("expired") ||
        lower.includes("not found") ||
        lower.includes("unsupported"))
    ) {
      return NextResponse.json(
        {
          error:
            `The configured model (${model}) is unavailable or expired. Update GROQ_MODEL and try again.`,
        },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: `Groq API error: ${errorText}` },
      { status: 502 },
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const answer = data.choices?.[0]?.message?.content;

  return NextResponse.json({ answer: answer ?? "I could not generate a response." });
}

