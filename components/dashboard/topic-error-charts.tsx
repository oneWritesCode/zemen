"use client";

import type { TopicChartSpec } from "@/lib/fred/topics-config";

import { ChartRetryCard } from "@/components/dashboard/chart-retry-card";

export function TopicErrorCharts({
  charts,
  errorMessage,
  onRetry,
}: {
  charts: TopicChartSpec[];
  errorMessage: string;
  onRetry: () => void;
}) {
  const split = charts.filter((c) => c.span === "split");
  const full = charts.filter((c) => c.span === "full");

  return (
    <div className="flex flex-col gap-6">
      {split.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {split.map((spec) => (
            <ChartRetryCard
              key={spec.title}
              title={spec.title}
              errorMessage={errorMessage}
              onRetry={onRetry}
            />
          ))}
        </div>
      ) : null}
      {full.map((spec) => (
        <ChartRetryCard
          key={spec.title}
          title={spec.title}
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}
