import { Skeleton } from "@/components/ui/skeleton";
import type { TopicDefinition, TopicChartSpec } from "@/lib/fred/topics-config";

function ChartBlockSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#12121a]/80 p-4 sm:p-5">
      <Skeleton className="mb-4 h-5 w-2/3 max-w-xs" />
      <Skeleton className="h-[280px] w-full rounded-xl" />
    </div>
  );
}

function ChartsSkeleton({ charts }: { charts: TopicDefinition["charts"] }) {
  const split = charts.filter((c) => c.span === "split");
  const full = charts.filter((c) => c.span === "full");

  return (
    <div className="flex flex-col gap-6">
      {split.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {split.map((c) => (
            <ChartBlockSkeleton key={c.title} />
          ))}
        </div>
      ) : null}
      {full.map((c) => (
        <ChartBlockSkeleton key={c.title} />
      ))}
    </div>
  );
}

export function TopicDashboardSkeleton({ topic }: { topic: TopicDefinition }) {
  const kpiCount = new Set(topic.kpiKeys).size;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-8 sm:px-8 lg:px-10">
      <header className="max-w-4xl space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <Skeleton className="h-9 w-48 sm:w-64" />
        </div>
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
        <Skeleton className="h-3 w-52" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: Math.min(kpiCount, 4) }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-[#12121a]/80 px-5 py-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-28" />
            <Skeleton className="mt-2 h-4 w-36" />
          </div>
        ))}
      </div>

      <ChartsSkeleton charts={topic.charts} />
    </div>
  );
}
