import { notFound } from "next/navigation";
import { TopicDashboardClient } from "@/components/dashboard/topic-dashboard-client";
import { getTopicBySlug } from "@/lib/fred/topics-config";
import { BackButton } from "@/components/ui/back-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const def = getTopicBySlug(slug);
  return {
    title: def ? def.label : "Indicator Detail",
    description: def?.description ?? "Zemen macro indicator detail",
  };
}

export default async function IndicatorDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-6 sm:px-8 lg:px-10">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Indicators', href: '/indicators' },
            { label: topic.label, href: null }
          ]} 
        />
        <BackButton href="/indicators" label="All Indicators" />
      </div>
      <TopicDashboardClient topicSlug={slug} />
    </div>
  );
}
