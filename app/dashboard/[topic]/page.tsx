import { notFound } from "next/navigation";

import { TopicDashboardClient } from "@/components/dashboard/topic-dashboard-client";
import { getTopicBySlug } from "@/lib/fred/topics-config";

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props) {
  const { topic } = await params;
  const def = getTopicBySlug(topic);
  return {
    title: def ? def.label : "Dashboard",
    description: def?.description ?? "Zemen macro dashboard",
  };
}

export default async function DashboardTopicPage({ params }: Props) {
  const { topic } = await params;
  if (!getTopicBySlug(topic)) notFound();

  return <TopicDashboardClient topicSlug={topic} />;
}
