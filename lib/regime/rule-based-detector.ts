import type { RegimeFeatureRow } from "./build-panel";
import type { RegimeId } from "./types";

/**
 * Rule-based regime detection as fallback when clustering fails
 * Uses simple thresholds based on economic indicators
 */
export function detectRegimeByRules(features: RegimeFeatureRow): RegimeId {
  const { fedFunds, cpiYoY, unrate, rgdpYoY, yieldCurve } = features;

  // Recession: High unemployment, negative GDP growth, low rates
  if (unrate > 6.5 && rgdpYoY < -1 && fedFunds < 2) {
    return "recession";
  }

  // Stagflation: High inflation + high unemployment + low growth
  if (cpiYoY > 4 && unrate > 5 && rgdpYoY < 2) {
    return "stagflation";
  }

  // Overheating: High inflation, low unemployment, high rates, inverted yield curve
  if (cpiYoY > 3.5 && unrate < 4 && fedFunds > 4 && yieldCurve < -0.5) {
    return "overheating";
  }

  // Recovery: Improving GDP, falling unemployment, moderate rates
  if (rgdpYoY > 2 && unrate > 4.5 && fedFunds < 3) {
    return "recovery";
  }

  // Default to Goldilocks
  return "goldilocks";
}

/**
 * Calculate confidence score for rule-based detection
 */
export function calculateRuleConfidence(features: RegimeFeatureRow, regime: RegimeId): number {
  const { fedFunds, cpiYoY, unrate, rgdpYoY, yieldCurve } = features;
  
  let score = 0.5; // Base confidence
  
  switch (regime) {
    case "recession":
      if (unrate > 7) score += 0.2;
      if (rgdpYoY < -2) score += 0.2;
      if (fedFunds < 1.5) score += 0.1;
      break;
      
    case "stagflation":
      if (cpiYoY > 5) score += 0.2;
      if (unrate > 6) score += 0.2;
      if (rgdpYoY < 1) score += 0.1;
      break;
      
    case "overheating":
      if (cpiYoY > 4) score += 0.2;
      if (unrate < 3.5) score += 0.2;
      if (fedFunds > 5) score += 0.1;
      if (yieldCurve < -1) score += 0.1;
      break;
      
    case "recovery":
      if (rgdpYoY > 3) score += 0.2;
      if (unrate > 5 && unrate < 7) score += 0.2;
      if (fedFunds < 2.5) score += 0.1;
      break;
      
    case "goldilocks":
      if (cpiYoY > 1.5 && cpiYoY < 3) score += 0.2;
      if (unrate > 3.5 && unrate < 5.5) score += 0.2;
      if (fedFunds > 2 && fedFunds < 4) score += 0.1;
      if (yieldCurve > 0.5) score += 0.1;
      break;
  }
  
  return Math.min(score, 0.95); // Cap at 95%
}

/**
 * Get key contributing factors for the detected regime
 */
export function getRegimeContributors(features: RegimeFeatureRow, regime: RegimeId): string[] {
  const { fedFunds, cpiYoY, unrate, rgdpYoY, yieldCurve } = features;
  const contributors: string[] = [];
  
  switch (regime) {
    case "recession":
      if (unrate > 6.5) contributors.push(`High unemployment (${unrate.toFixed(1)}%)`);
      if (rgdpYoY < -1) contributors.push(`Negative GDP growth (${rgdpYoY.toFixed(1)}%)`);
      if (fedFunds < 2) contributors.push(`Low rates (${fedFunds.toFixed(1)}%)`);
      break;
      
    case "stagflation":
      if (cpiYoY > 4) contributors.push(`High inflation (${cpiYoY.toFixed(1)}%)`);
      if (unrate > 5) contributors.push(`High unemployment (${unrate.toFixed(1)}%)`);
      if (rgdpYoY < 2) contributors.push(`Weak growth (${rgdpYoY.toFixed(1)}%)`);
      break;
      
    case "overheating":
      if (cpiYoY > 3.5) contributors.push(`Rising inflation (${cpiYoY.toFixed(1)}%)`);
      if (unrate < 4) contributors.push(`Tight labor market (${unrate.toFixed(1)}%)`);
      if (fedFunds > 4) contributors.push(`High rates (${fedFunds.toFixed(1)}%)`);
      if (yieldCurve < -0.5) contributors.push(`Inverted yield curve (${yieldCurve.toFixed(2)}%)`);
      break;
      
    case "recovery":
      if (rgdpYoY > 2) contributors.push(`Strong GDP growth (${rgdpYoY.toFixed(1)}%)`);
      if (unrate > 4.5) contributors.push(`Improving employment (${unrate.toFixed(1)}%)`);
      if (fedFunds < 3) contributors.push(`Supportive rates (${fedFunds.toFixed(1)}%)`);
      break;
      
    case "goldilocks":
      if (cpiYoY > 1.5 && cpiYoY < 3) contributors.push(`Moderate inflation (${cpiYoY.toFixed(1)}%)`);
      if (unrate > 3.5 && unrate < 5.5) contributors.push(`Balanced employment (${unrate.toFixed(1)}%)`);
      if (fedFunds > 2 && fedFunds < 4) contributors.push(`Neutral rates (${fedFunds.toFixed(1)}%)`);
      if (yieldCurve > 0.5) contributors.push(`Positive yield curve (${yieldCurve.toFixed(2)}%)`);
      break;
  }
  
  return contributors;
}
