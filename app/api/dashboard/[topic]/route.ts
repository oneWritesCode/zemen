import { NextResponse } from "next/server";

import { getTopicDataset } from "@/lib/fred/get-topic-dataset";
import { getTopicBySlug } from "@/lib/fred/topics-config";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ topic: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { topic: slug } = await ctx.params;
  const def = getTopicBySlug(slug);
  if (!def) {
    return NextResponse.json(
      { error: "Unknown dashboard topic." },
      { status: 404 },
    );
  }

  try {
    const data = await getTopicDataset(def);
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
