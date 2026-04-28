import { buildRegimeFeatureRows } from './build-panel'
import type { RegimeFeatureRow } from './build-panel'

// Simple in-memory cache with TTL
const cache = new Map<string, { data: RegimeFeatureRow[]; timestamp: number }>()
const CACHE_TTL = 3600000 // 1 hour in milliseconds

export async function getCachedRegimeFeatures(observationStart = "2010-01-01"): Promise<RegimeFeatureRow[]> {
  const cacheKey = `regime-features-${observationStart}`
  const cached = cache.get(cacheKey)
  
  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Using cached regime features')
    return cached.data
  }
  
  // Fetch fresh data
  console.log('Fetching fresh regime features')
  const data = await buildRegimeFeatureRows(observationStart)
  
  // Update cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
  
  return data
}

export function clearRegimeCache(): void {
  cache.clear()
  console.log('Regime cache cleared')
}

// Cache cleanup function (call this periodically)
export function cleanupCache(): void {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}
