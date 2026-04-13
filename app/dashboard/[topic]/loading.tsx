import { TopicDashboardSkeleton } from "@/components/dashboard/topic-dashboard-skeleton";
import { getTopicBySlug } from "@/lib/fred/topics-config";

export default function DashboardTopicLoading() {
  const topic = getTopicBySlug("interest-rates")!;
  return <TopicDashboardSkeleton topic={topic} />;
}
