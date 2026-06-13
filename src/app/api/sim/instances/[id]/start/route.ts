import { NextRequest, NextResponse } from 'next/server'
import { getInstance } from '@/lib/sim-engine'
import { client } from '@/sanity/client'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const token = authHeader.substring(7)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) return null
    if (decoded.userId) {
      const user = await client.fetch(
        `*[_type == "user" && _id == $id][0]{_id, username, role, status}`,
        { id: decoded.userId }
      )
      if (!user || user.status === 'suspended') return null
      return user
    }
    return decoded
  } catch {
    return null
  }
}

type RouteContext = { params: Promise<{ id: string }> }

/**
 * POST /api/sim/instances/{id}/start
 *
 * Spawns the engine subprocess for a registered instance.
 * The actual spawning is handled by the orchestrator;
 * this route updates status and triggers the spawn.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const instance = await getInstance(id)

    if (instance.status === 'running') {
      return NextResponse.json(
        { success: false, message: 'Instance is already running' },
        { status: 409 }
      )
    }

    // TODO (Phase 2): Call orchestrator to actually spawn the engine process.
    // For now we mark it as running in the engine DB.
    const engineUrl = process.env.SIM_ENGINE_URL || 'http://localhost:9000'
    const res = await fetch(`${engineUrl}/api/v1/instances/${id}/start`, { method: 'POST' })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Engine start failed: ${text}`)
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to start instance:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to start simulation' },
      { status: 500 }
    )
  }
}
