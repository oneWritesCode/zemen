import type { LucideIcon } from "lucide-react";
import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  Flame,
  Globe2,
  Home,
  LayoutGrid,
  LineChart,
  HeartPulse,
} from "lucide-react";

import type { TopicIconId } from "@/lib/fred/topics-config";

const TOPIC_ICONS: Record<TopicIconId, LucideIcon> = {
  rates: LineChart,
  inflation: Flame,
  labor: BriefcaseBusiness,
  gdp: LayoutGrid,
  housing: Home,
  credit: CreditCard,
  gold: Award,
  equity: BarChart3,
  globe: Globe2,
  sentiment: HeartPulse,
};

export function TopicIcon({
  id,
  className,
  "aria-hidden": ariaHidden = true,
}: {
  id: TopicIconId;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const Icon = TOPIC_ICONS[id];
  return <Icon className={className} aria-hidden={ariaHidden} />;
}
