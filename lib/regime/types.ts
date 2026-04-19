import { Sun, CloudRain, AlertTriangle, TrendingUp, Flame } from "lucide-react";

export type RegimeId =
  | "goldilocks"
  | "stagflation"
  | "recession"
  | "recovery"
  | "overheating";

export type RegimeMeta = {
  id: RegimeId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bgClass: string;
  borderClass: string;
  icon: React.ElementType;
};

export const REGIMES: RegimeMeta[] = [
  {
    id: "goldilocks",
    label: "Goldilocks",
    shortLabel: "Goldilocks",
    description: "Solid growth with tame inflation and a healthy labor market.",
    color: "#34d399",
    bgClass: "bg-emerald-500/15",
    borderClass: "border-emerald-400/40",
    icon: Sun,
  },
  {
    id: "stagflation",
    label: "Stagflation",
    shortLabel: "Stagflation",
    description: "Elevated inflation with weak growth or labor slack.",
    color: "#fb923c",
    bgClass: "bg-orange-500/15",
    borderClass: "border-orange-400/40",
    icon: CloudRain,
  },
  {
    id: "recession",
    label: "Recession",
    shortLabel: "Recession",
    description: "Rising joblessness, wide spreads, and contracting activity.",
    color: "#f87171",
    bgClass: "bg-red-500/15",
    borderClass: "border-red-400/40",
    icon: AlertTriangle,
  },
  {
    id: "recovery",
    label: "Recovery",
    shortLabel: "Recovery",
    description: "Rebound in growth and labor as conditions normalize.",
    color: "#60a5fa",
    bgClass: "bg-blue-500/15",
    borderClass: "border-blue-400/40",
    icon: TrendingUp,
  },
  {
    id: "overheating",
    label: "Overheating",
    shortLabel: "Overheating",
    description: "Tight labor, strong demand, and building price pressure.",
    color: "#f472b6",
    bgClass: "bg-pink-500/15",
    borderClass: "border-pink-400/40",
    icon: Flame,
  },
];

export const REGIME_BY_ID = Object.fromEntries(
  REGIMES.map((r) => [r.id, r]),
) as Record<RegimeId, RegimeMeta>;
