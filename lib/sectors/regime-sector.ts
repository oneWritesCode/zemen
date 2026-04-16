import type { RegimeId } from "@/lib/regime/types";
import type { SectorId } from "./sector-config";

export const TOP_3_SECTORS_FOR_REGIME: Record<RegimeId, SectorId[]> = {
  goldilocks: ["technology", "consumer-discretionary", "financials"],
  recovery: ["industrials", "real-estate", "consumer-discretionary"],
  overheating: ["energy", "materials", "emerging-tech"],
  stagflation: ["energy", "healthcare", "utilities"],
  recession: ["healthcare", "utilities", "consumer-staples"],
};

export function getSectorFit(regime: RegimeId, sector: SectorId): "HOT" | "NEUTRAL" | "COLD" {
  const hot = new Set<SectorId>(TOP_3_SECTORS_FOR_REGIME[regime] ?? []);
  if (hot.has(sector)) return "HOT";

  // Deterministic neutral/cold mapping derived from sector fit intuition.
  // These are "soft" categories to avoid everything defaulting to COLD.
  const neutralByRegime: Record<RegimeId, SectorId[]> = {
    goldilocks: ["financials", "industrials", "healthcare"],
    recovery: ["financials", "technology", "real-estate"],
    overheating: ["consumer-staples", "utilities", "financials"],
    stagflation: ["technology", "consumer-discretionary", "real-estate"],
    recession: ["financials", "technology", "consumer-discretionary"],
  };

  const neutral = new Set<SectorId>(neutralByRegime[regime] ?? []);
  return neutral.has(sector) ? "NEUTRAL" : "COLD";
}

