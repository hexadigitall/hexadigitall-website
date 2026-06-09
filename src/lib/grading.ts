import type { GradingHint, GradingCheck, GradingResult, SimDeviceState } from '@/types/simulation'

function resolveJsonPath(obj: unknown, path: string): unknown {
  if (!path.startsWith('/')) return undefined
  const parts = path.slice(1).split('/')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    // Convert snake_case from jsonPath to camelCase for TS objects
    const camelPart = part.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    current = (current as Record<string, unknown>)[camelPart] ?? (current as Record<string, unknown>)[part]
  }
  return current
}

function findTarget(devices: SimDeviceState[], targetType: string, targetId: string): unknown {
  for (const device of devices) {
    if (device.id === targetId && (targetType === 'device' || !targetType)) return device
    if (device.children) {
      for (const port of device.children) {
        if (port.id === targetId && targetType === 'port') return port
      }
    }
  }
  return null
}

export function evaluateGradingHints(
  devices: SimDeviceState[],
  hints: GradingHint[],
): GradingResult {
  const checks: GradingCheck[] = []
  let earnedPoints = 0
  let totalPoints = 0
  let passed = 0

  for (const hint of hints) {
    const target = findTarget(devices, hint.targetType, hint.targetId)
    const actual = target ? resolveJsonPath(target, hint.jsonPath) : undefined
    const isPassed = String(actual) === String(hint.expectedValue)
    totalPoints += hint.points
    if (isPassed) {
      earnedPoints += hint.points
      passed++
    }
    checks.push({
      label: hint.label || `${hint.targetId} ${hint.jsonPath}`,
      targetId: hint.targetId,
      jsonPath: hint.jsonPath,
      expected: hint.expectedValue,
      actual,
      points: hint.points,
      passed: isPassed,
    })
  }

  return {
    totalPoints,
    earnedPoints,
    passed,
    total: hints.length,
    checks,
    submittedAt: new Date().toISOString(),
  }
}
