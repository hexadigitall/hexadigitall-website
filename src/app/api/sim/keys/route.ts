import { NextRequest, NextResponse } from 'next/server'
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/sim-engine'
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
    const instanceId = searchParams.get('instanceId')
    if (!instanceId) {
      return NextResponse.json(
        { success: false, message: 'instanceId query parameter is required' },
        { status: 400 }
      )
    }

    const keys = await listApiKeys(instanceId)
    return NextResponse.json({ success: true, data: keys })
  } catch (error) {
    console.error('Failed to list API keys:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to list API keys' },
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
    const { instanceId, label } = body

    if (!instanceId) {
      return NextResponse.json(
        { success: false, message: 'instanceId is required' },
        { status: 400 }
      )
    }

    const key = await createApiKey(instanceId, label)
    return NextResponse.json({ success: true, data: key })
  } catch (error) {
    console.error('Failed to create API key:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { instanceId, keyId } = body

    if (!instanceId || !keyId) {
      return NextResponse.json(
        { success: false, message: 'instanceId and keyId are required' },
        { status: 400 }
      )
    }

    const result = await revokeApiKey(instanceId, keyId)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Failed to revoke API key:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to revoke API key' },
      { status: 500 }
    )
  }
}
