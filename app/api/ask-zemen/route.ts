import { NextResponse } from "next/server";

import { getTopicDataset } from "@/lib/fred/get-topic-dataset";
import { DASHBOARD_TOPICS } from "@/lib/fred/topics-config";
import { formatMetricValue } from "@/lib/format-metric";
import { getRegimeAnalysis } from "@/lib/regime/get-analysis";
import { REGIME_BY_ID } from "@/lib/regime/types";

export const dynamic = "force-dynamic";

type Body = {
  messages?: { role: "user" | "assistant"; content: string }[];
};

export async function POST(req: Request) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  if (!anthropicKey && !groqKey) {
    return NextResponse.json(
      { error: "Missing AI key. Set ANTHROPIC_API_KEY or GROQ_API_KEY." },
      { status: 500 },
    );
  }

  const body = (await req.json()) as Body;
  const messages = body.messages?.slice(-10) ?? [];
  const userMessages = messages.filter((m) => m.role === "user");

  const [regime, topicData] = await Promise.all([
    getRegimeAnalysis(),
    Promise.all(DASHBOARD_TOPICS.map((t) => getTopicDataset(t))),
  ]);

  const indicators = topicData
    .map((d) => {
      const first = d.kpis[0];
      if (!first) return null;
      return `${d.topic.label}: ${formatMetricValue(first.value, first.unit)}`;
    })
    .filter(Boolean)
    .join("; ");

  const system = `You are Zemen, a macroeconomic intelligence assistant.
You explain economic concepts in simple plain English that anyone can understand.
You have access to the following current economic data: ${indicators}

When answering questions:
- Always start with a one sentence plain English answer
- Use the weather app analogy when helpful
- Reference the current economic regime
- Give historical context when relevant
- Never give specific financial advice
- End with one thing the user should watch next

Current regime: ${REGIME_BY_ID[regime.current.regime].label}
Current indicators: ${indicators}`;

  const useGroq = Boolean(groqKey);
  const response = await fetch(
    useGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: useGroq
        ? {
            "content-type": "application/json",
            authorization: `Bearer ${groqKey}`,
          }
        : {
            "content-type": "application/json",
            "x-api-key": anthropicKey!,
            "anthropic-version": "2023-06-01",
          },
      body: useGroq
        ? JSON.stringify({
            model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
            temperature: 0.2,
            messages: [
              { role: "system", content: system },
              ...userMessages.map((m) => ({ role: "user", content: m.content })),
            ],
          })
        : JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 900,
            system,
            messages: userMessages.map((m) => ({ role: "user", content: m.content })),
          }),
    },
  );

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
            "The configured LLM model is unavailable or expired. Update GROQ_MODEL/ANTHROPIC model and try again.",
        },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: `${useGroq ? "Groq" : "Claude"} API error: ${errorText}` },
      { status: 502 },
    );
  }

  const answer = useGroq
    ? (
        (await response.json()) as {
          choices?: { message?: { content?: string } }[];
        }
      ).choices?.[0]?.message?.content
    : (
        (await response.json()) as {
          content?: { type: string; text?: string }[];
        }
      ).content?.find((c) => c.type === "text")?.text;

  return NextResponse.json({ answer: answer ?? "I could not generate a response." });
}

