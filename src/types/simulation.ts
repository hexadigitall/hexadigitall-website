// ── Simulation Instance ──────────────────────────────────────────────────

export interface SimInstance {
  id: string
  labDefinitionId: string
  ownerId: string
  status: 'starting' | 'running' | 'paused' | 'stopped' | 'error' | 'expired'
  enginePort: number | null
  tick: number
  createdAt: string
  expiresAt: string
}

export interface SimInstanceCreate {
  labDefinitionId: string
}

// ── Lab Assignment (linking a student to a lab definition) ──────────────

export interface SimLabAssignment {
  id: string
  labDefinitionId: string
  studentId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'expired' | 'failed'
  grade: number | null
  gradeMax: number | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

// ── Sanity Lab Definition (returned from Sanity queries) ────────────────

export interface SimLabDefinition {
  _id: string
  title: string
  slug: { current: string }
  course?: { _ref: string; title?: string }
  description?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationMinutes: number
  seedTopology?: string
  instructions?: string
  tags?: string[]
  published: boolean
}

// ── Snapshot ─────────────────────────────────────────────────────────────

export interface SimSnapshot {
  id: string
  tick: number
  label: string | null
  createdAt: string
  deviceTree?: Record<string, unknown>
}

export interface SimSnapshotCreate {
  label?: string
  deviceTree: Record<string, unknown>
}

// ── Event ────────────────────────────────────────────────────────────────

export interface SimEvent {
  id: string
  instanceId: string
  tick: number
  timestamp: string
  actor: string
  action: string
  targetType: string | null
  targetId: string | null
  path: string | null
  oldValue: unknown
  newValue: unknown
  accepted: boolean
}

// ── API Key ──────────────────────────────────────────────────────────────

export interface SimApiKey {
  id: string
  key?: string // only returned on creation
  label: string
  keyPrefix?: string
  createdAt: string
  lastUsedAt?: string
}

export interface SimApiKeyCreate {
  label?: string
}

// ── Live Device State (Phase 3 — WebSocket streaming) ───────────────────

export interface SimDevicePort {
  id: string
  label: string
  type: string
  status: string
  rxBytes?: number
  txBytes?: number
}

export interface SimDeviceState {
  id: string
  label: string
  type: string
  status: string
  cpuPct?: number
  memPct?: number
  uptimeTicks?: number
  children?: SimDevicePort[]
}

export interface SimStateSnapshot {
  type: 'state_snapshot' | 'tick_update'
  instanceId: string
  status: string
  tick: number
  devices: SimDeviceState[]
}

export interface SimWSError {
  type: 'error'
  detail: string
}

export type SimWSMessage = SimStateSnapshot | SimWSError

// ── Grading (Phase 5) ────────────────────────────────────────────────────

export interface GradingHint {
  label?: string
  targetType: string
  targetId: string
  jsonPath: string
  expectedValue: string
  points: number
}

export interface GradingResult {
  totalPoints: number
  earnedPoints: number
  passed: number
  total: number
  checks: GradingCheck[]
  submittedAt: string
}

export interface GradingCheck {
  label: string
  targetId: string
  jsonPath: string
  expected: string
  actual: unknown
  points: number
  passed: boolean
}

// ── Engine Health ────────────────────────────────────────────────────────

export interface EngineHealth {
  status: string
  service: string
  version: string
  timestamp: string
}
