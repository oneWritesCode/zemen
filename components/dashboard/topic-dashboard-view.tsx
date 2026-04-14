import { TopicIcon } from "@/components/icons/topic-icon";
import { PersonaTopicBanner } from "@/components/dashboard/persona-topic-banner";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { TopicCharts } from "@/components/dashboard/topic-charts";
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
        <h1 className="flex flex-wrap items-center gap-3 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          <TopicIcon
            id={topic.icon}
            className="h-9 w-9 shrink-0 text-[#ffcc00]"
            aria-hidden
          />
          {topic.label}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-400">
          {topic.description}
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Monthly-aligned series · {range} · {meta.rowCount} observations
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
    </div>
  );
}
