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

/**
 * GET /api/sim/labs
 *
 * Returns published lab definitions from Sanity.
 * Students see published labs; instructors/admins see all.
 */
export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const includeUnpublished = user.role === 'teacher' || user.role === 'admin'

    let query = `*[_type == "simLabDefinition"`
    const params: Record<string, unknown> = {}

    if (!includeUnpublished) {
      query += ` && published == true`
    }
    if (courseId) {
      query += ` && course._ref == $courseId`
      params.courseId = courseId
    }
    query += `] | order(title asc) { _id, title, slug, description, difficulty, durationMinutes, published, "courseTitle": course->title }`

    const labs = await client.fetch(query, params)
    return NextResponse.json({ success: true, data: labs })
  } catch (error) {
    console.error('Failed to fetch lab definitions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch lab definitions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sim/labs — Create a new lab definition in Sanity
 * Teacher/Admin only.
 */
export async function POST(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { writeClient } = await import('@/sanity/client')

    const doc = await writeClient.create({
      _type: 'simLabDefinition',
      ...body,
      published: false,
    })

    return NextResponse.json({ success: true, data: doc })
  } catch (error) {
    console.error('Failed to create lab definition:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create lab definition' },
      { status: 500 }
    )
  }
}
