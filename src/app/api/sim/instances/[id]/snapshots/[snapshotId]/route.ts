import { NextRequest, NextResponse } from 'next/server'
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

type RouteContext = { params: Promise<{ id: string; snapshotId: string }> }

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, snapshotId } = await context.params
    const engineUrl = process.env.SIM_ENGINE_URL || 'http://localhost:9000'
    const res = await fetch(
      `${engineUrl}/api/v1/instances/${id}/snapshots/${snapshotId}`,
      { method: 'DELETE' }
    )

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Engine delete snapshot failed: ${text}`)
    }

    return NextResponse.json({ success: true, data: { deleted: snapshotId } })
  } catch (error) {
    console.error('Failed to delete snapshot:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete snapshot' },
      { status: 500 }
    )
  }
}
