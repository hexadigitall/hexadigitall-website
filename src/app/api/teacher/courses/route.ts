import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Verify token is recent (24 hours)
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) {
      return null
    }

    // Verify user still exists and is active
    if (decoded.userId) {
      const user = await client.fetch(
        `*[_type == "user" && _id == $id][0]{_id, username, role, status}`,
        { id: decoded.userId }
      )
      if (!user || user.status === 'suspended') {
        return null
      }
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
    
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user._id || user.userId

    // Admin sees all courses, teachers see only assigned courses
    let query: string
    if (user.role === 'admin') {
      query = `*[_type == "course"]{
        _id,
        title,
        slug,
        description,
        level,
        courseType,
        mainImage,
        contentPdf,
        roadmapPdf,
        "enrollmentCount": count(*[_type == "enrollment" && references(^._id) && courseType == "live"]),
        "activeEnrollments": *[_type == "enrollment" && references(^._id) && courseType == "live" && status == "active"]{
          _id,
          studentName,
          studentEmail,
          studentId,
          status,
          enrolledAt
        }
      }`
    } else {
      // Teacher sees courses where they are in assignedTeachers array OR where enrollments reference them
      query = `*[_type == "course" && ($userId in assignedTeachers[]._ref || references($userId))]{
        _id,
        title,
        slug,
        description,
        level,
        courseType,
        mainImage,
        contentPdf,
        roadmapPdf,
        "enrollmentCount": count(*[_type == "enrollment" && references(^._id) && courseType == "live" && teacherId._ref == $userId]),
        "activeEnrollments": *[_type == "enrollment" && references(^._id) && courseType == "live" && status == "active" && teacherId._ref == $userId]{
          _id,
          studentName,
          studentEmail,
          studentId,
          status,
          enrolledAt
        }
      }`
    }

    const courses = await client.fetch(query, { userId })

    return NextResponse.json({
      success: true,
      courses,
    })
  } catch (error) {
    console.error('Failed to fetch teacher courses:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
