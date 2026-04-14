"use client";

import { usePersona } from "@/components/global/persona-provider";
import { getPersonaTopicCopy } from "@/lib/personalization";

export function PersonaTopicBanner({ topicSlug }: { topicSlug: string }) {
  const { persona } = usePersona();

  if (!persona) return null;

  return (
    <div className="mt-4 rounded-xl border border-[#FFD000]/30 bg-[#FFD000]/10 px-4 py-3 text-sm leading-6 text-zinc-100">
      {getPersonaTopicCopy(topicSlug, persona)}
    </div>
  );
}

