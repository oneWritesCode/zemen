import { TopicIcon } from "@/components/icons/topic-icon";
import { PersonaTopicBanner } from "@/components/dashboard/persona-topic-banner";
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
        {subtitle ?? "Monthly-aligned · Data unavailable"}
      </p>
      <PersonaTopicBanner topicSlug={topic.slug} />
    </header>
  );
}
