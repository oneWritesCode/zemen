import { TopicIcon } from "@/components/icons/topic-icon";
import { PersonaTopicBanner } from "@/components/dashboard/persona-topic-banner";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { TopicCharts } from "@/components/dashboard/topic-charts";
import { ActionPanel } from "@/components/actions/action-panel";
import type { TopicDataset } from "@/lib/fred/get-topic-dataset";

export function TopicDashboardView({ data }: { data: TopicDataset }) {
  const { topic, chartRows, kpis, meta, seriesMeta, computedMeta } = data;

  const seriesStyles: Record<string, { label: string; color: string }> = {};
  for (const [k, v] of Object.entries(seriesMeta)) {
    seriesStyles[k] = { label: v.label, color: v.color };
  }
  for (const [k, v] of Object.entries(computedMeta)) {
    seriesStyles[k] = { label: v.label, color: v.color };
  }

  const range =
    meta.firstPeriod && meta.lastPeriod
      ? `${new Date(meta.firstPeriod + "-01").toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })} – ${new Date(meta.lastPeriod + "-01").toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}`
      : "—";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-8 sm:px-8 lg:px-10">
      <header className="max-w-4xl">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.07] shrink-0">
            <TopicIcon
              id={topic.icon}
              className="h-4.5 w-4.5 text-zinc-300"
              aria-hidden
            />
          </div>
          <h1 className="font-bold text-3xl tracking-tight text-white sm:text-4xl">
            {topic.label}
          </h1>
        </div>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-400">
          {topic.description}
        </p>
        <p className="mt-3 text-[12px] text-zinc-600">
          Monthly-aligned · {range} · {meta.rowCount} observations
        </p>
        <PersonaTopicBanner topicSlug={topic.slug} />
      </header>

      <KpiRow kpis={kpis} />
      <TopicCharts
        key={`${topic.slug}-${meta.rowCount}`}
        charts={topic.charts}
        chartRows={chartRows}
        seriesStyles={seriesStyles}
        topicSlug={topic.slug}
      />
      <ActionPanel topicSlug={topic.slug} chartRows={chartRows} kpis={kpis} />
    </div>
  );
}
