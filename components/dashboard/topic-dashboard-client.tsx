"use client";

import { useCallback, useEffect, useState } from "react";

import { TopicDashboardHeaderStatic } from "@/components/dashboard/topic-dashboard-header-static";
import { TopicDashboardSkeleton } from "@/components/dashboard/topic-dashboard-skeleton";
import { TopicDashboardView } from "@/components/dashboard/topic-dashboard-view";
import { TopicErrorCharts } from "@/components/dashboard/topic-error-charts";
import type { TopicDataset } from "@/lib/fred/get-topic-dataset";
import { getTopicBySlug } from "@/lib/fred/topics-config";

export function TopicDashboardClient({ topicSlug }: { topicSlug: string }) {
  const topic = getTopicBySlug(topicSlug);
  const [phase, setPhase] = useState<"loading" | "ok" | "error">("loading");
  const [data, setData] = useState<TopicDataset | null>(null);
  const [message, setMessage] = useState<string>("");

  const load = useCallback(async () => {
    if (!topic) return;
    setPhase("loading");
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/${topicSlug}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as TopicDataset & { error?: string };

      if (!res.ok) {
        setData(null);
        setMessage(
          typeof json.error === "string"
            ? json.error
            : `Request failed (${res.status})`,
        );
        setPhase("error");
        return;
      }

      setData(json);
      if (json.error) {
        setMessage(json.error);
        setPhase("error");
        return;
      }

      setPhase("ok");
    } catch (e) {
      setData(null);
      setMessage(e instanceof Error ? e.message : "Network error");
      setPhase("error");
    }
  }, [topic, topicSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!topic) return null;

  if (phase === "loading") {
    return <TopicDashboardSkeleton topic={topic} />;
  }

  if (phase === "ok" && data && !data.error) {
    return <TopicDashboardView data={data} />;
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-8 sm:px-8 lg:px-10">
      <TopicDashboardHeaderStatic topic={topic} />
      <div
        role="alert"
        className="max-w-3xl rounded-2xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-200"
      >
        {message || "Could not load FRED data."}
      </div>
      <TopicErrorCharts
        charts={topic.charts}
        errorMessage={message || "Could not load FRED data."}
        onRetry={() => void load()}
      />
    </div>
  );
}
