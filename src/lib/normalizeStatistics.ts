// src/lib/normalizeStatistics.ts
// Small runtime normalizer to map various incoming Sanity `statistics` shapes
// into a canonical `{ metrics }` object used by UI components.

export type Metrics = {
  projectsCompleted?: number
  clientSatisfaction?: number
  averageDeliveryTime?: string
  teamSize?: number
  [key: string]: unknown
}

export function normalizeStatistics(raw: unknown): { metrics?: Metrics } {
  if (!raw) return {}
  if (typeof raw !== 'object' || raw === null) return {}

  const anyRaw = raw as Record<string, unknown>

  // If it already has a metrics object, return it (ensure it's an object)
  if (anyRaw.metrics && typeof anyRaw.metrics === 'object') {
    return { metrics: { ...(anyRaw.metrics as Metrics) } }
  }

  const metrics: Metrics = {}

  if (typeof anyRaw.projectsCompleted === 'number') metrics.projectsCompleted = anyRaw.projectsCompleted as number
  if (typeof anyRaw.clientSatisfaction === 'number') metrics.clientSatisfaction = anyRaw.clientSatisfaction as number
  if (typeof anyRaw.averageDeliveryTime === 'string') metrics.averageDeliveryTime = anyRaw.averageDeliveryTime as string
  if (typeof anyRaw.teamSize === 'number') metrics.teamSize = anyRaw.teamSize as number

  // Map legacy or alternate fields if present
  if (!metrics.clientSatisfaction && typeof anyRaw.fundingSuccessRate === 'number') {
    metrics.clientSatisfaction = anyRaw.fundingSuccessRate as number
  }

  // Some documents may have numeric strings for certain fields — coerce where reasonable
  if (!metrics.projectsCompleted && typeof anyRaw.projectsCompleted === 'string' && !Number.isNaN(Number(anyRaw.projectsCompleted))) {
    metrics.projectsCompleted = Number(anyRaw.projectsCompleted)
  }

  if (Object.keys(metrics).length === 0) return {}
  return { metrics }
}

export default normalizeStatistics
