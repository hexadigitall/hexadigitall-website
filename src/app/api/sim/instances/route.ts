import { NextRequest, NextResponse } from 'next/server'
import { createInstance, listInstances } from '@/lib/sim-engine'
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

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId') || user._id || user.userId
    const status = searchParams.get('status') || undefined

    const instances = await listInstances(ownerId, status)
    return NextResponse.json({ success: true, data: instances })
  } catch (error) {
    console.error('Failed to list instances:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to list instances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { labDefinitionId } = body

    if (!labDefinitionId) {
      return NextResponse.json(
        { success: false, message: 'labDefinitionId is required' },
        { status: 400 }
      )
    }

    const instance = await createInstance(labDefinitionId, user._id || user.userId)
    return NextResponse.json({ success: true, data: instance })
  } catch (error) {
    console.error('Failed to create instance:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create instance' },
      { status: 500 }
    )
  }
}
