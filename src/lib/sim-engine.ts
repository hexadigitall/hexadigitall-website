/**
 * Simulation Engine API Client
 *
 * BFF-friendly client that talks to the Python orchestration engine.
 * All requests are authenticated via the shared AUTH_SECRET JWT.
 */

const ENGINE_URL = process.env.SIM_ENGINE_URL || 'http://localhost:9000'

interface FetchOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function engineFetch(path: string, options: FetchOptions = {}) {
  const url = `${ENGINE_URL}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Engine API error ${res.status}: ${text}`)
  }

  return res.json()
}

// ── Instance CRUD ────────────────────────────────────────────────────────

export function listInstances(ownerId?: string, status?: string) {
  const params = new URLSearchParams()
  if (ownerId) params.set('owner_id', ownerId)
  if (status) params.set('status', status)
  const qs = params.toString()
  return engineFetch(`/api/v1/instances${qs ? `?${qs}` : ''}`)
}

export function getInstance(instanceId: string) {
  return engineFetch(`/api/v1/instances/${instanceId}`)
}

export function createInstance(labDefinitionId: string, ownerId: string) {
  return engineFetch('/api/v1/instances', {
    method: 'POST',
    body: { lab_definition_id: labDefinitionId, owner_id: ownerId },
  })
}

export function deleteInstance(instanceId: string) {
  return engineFetch(`/api/v1/instances/${instanceId}`, { method: 'DELETE' })
}

// ── Snapshots ────────────────────────────────────────────────────────────

export function listSnapshots(instanceId: string) {
  return engineFetch(`/api/v1/instances/${instanceId}/snapshots`)
}

export function createSnapshot(instanceId: string, deviceTree: unknown, label?: string) {
  return engineFetch(`/api/v1/instances/${instanceId}/snapshots`, {
    method: 'POST',
    body: { device_tree: deviceTree, label },
  })
}

// ── API Keys ─────────────────────────────────────────────────────────────

export function listApiKeys(instanceId: string) {
  return engineFetch(`/api/v1/instances/${instanceId}/keys`)
}

export function createApiKey(instanceId: string, label?: string) {
  return engineFetch(`/api/v1/instances/${instanceId}/keys`, {
    method: 'POST',
    body: { label: label || 'default' },
  })
}

export function revokeApiKey(instanceId: string, keyId: string) {
  return engineFetch(`/api/v1/instances/${instanceId}/keys/${keyId}`, {
    method: 'DELETE',
  })
}

// ── Events ───────────────────────────────────────────────────────────────

export function listEvents(instanceId: string, fromTick = 0, toTick?: number, limit = 100) {
  const params = new URLSearchParams({ from_tick: String(fromTick), limit: String(limit) })
  if (toTick !== undefined) params.set('to_tick', String(toTick))
  return engineFetch(`/api/v1/instances/${instanceId}/events?${params}`)
}

// ── Health ───────────────────────────────────────────────────────────────

export function engineHealth() {
  return engineFetch('/health')
}
