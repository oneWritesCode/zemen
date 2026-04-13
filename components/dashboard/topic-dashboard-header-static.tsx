import { TopicIcon } from "@/components/icons/topic-icon";
import type { TopicDefinition } from "@/lib/fred/topics-config";

/** Header when data failed: topic from config only. */
export function TopicDashboardHeaderStatic({
  topic,
  subtitle,
}: {
  topic: TopicDefinition;
  subtitle?: string;
}) {
  return (
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
        {subtitle ?? "Monthly-aligned series · Data unavailable"}
      </p>
    </header>
  );
}
