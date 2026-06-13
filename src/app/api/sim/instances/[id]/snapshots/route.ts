import { NextRequest, NextResponse } from 'next/server'
import { listSnapshots, createSnapshot, getInstance } from '@/lib/sim-engine'
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

export async function GET(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await context.params
    const snapshots = await listSnapshots(id)
    return NextResponse.json({ success: true, data: snapshots })
  } catch (error) {
    console.error('Failed to list snapshots:', error)
    return NextResponse.json({ success: false, message: 'Failed to list snapshots' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await context.params
    const body = await request.json()
    const instance = await getInstance(id)
    const snapshot = await createSnapshot(id, body.deviceTree || {}, body.label || `Tick ${instance.tick}`)
    return NextResponse.json({ success: true, data: snapshot })
  } catch (error) {
    console.error('Failed to create snapshot:', error)
    return NextResponse.json({ success: false, message: 'Failed to create snapshot' }, { status: 500 })
  }
}
