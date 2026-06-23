import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { getDefaultWidgetsForTemplate } from '@/data/homepageTemplates'

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
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user._id || user.userId

    const config = await client.fetch(
      `*[_type == "homepageConfig" && userId._ref == $userId][0]`,
      { userId }
    )

    return NextResponse.json({ success: true, config: config ?? null })
  } catch (error) {
    console.error('Failed to fetch homepage config:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch homepage config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user._id || user.userId
    const body = await request.json()
    const { template, widgets, version } = body

    const existing = await client.fetch(
      `*[_type == "homepageConfig" && userId._ref == $userId][0]{_id}`,
      { userId }
    )

    const doc = {
      _type: 'homepageConfig',
      userId: { _ref: userId, _type: 'reference' },
      template: template || 'explorer',
      widgets: widgets || [],
      version: version || 1,
      updatedAt: new Date().toISOString(),
    }

    let result
    if (existing?._id) {
      result = await writeClient.patch(existing._id).set(doc).commit()
    } else {
      result = await writeClient.create({
        ...doc,
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, config: result })
  } catch (error) {
    console.error('Failed to save homepage config:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save homepage config' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user._id || user.userId

    const existing = await client.fetch(
      `*[_type == "homepageConfig" && userId._ref == $userId][0]{_id}`,
      { userId }
    )

    if (existing?._id) {
      await writeClient.delete(existing._id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete homepage config:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete homepage config' },
      { status: 500 }
    )
  }
}
