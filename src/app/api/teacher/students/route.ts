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
    
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) {
      return null
    }

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

    // Fetch enrollments for courses this teacher is assigned to
    const query = `*[_type == "enrollment" && courseType == "live" && teacherId._ref == $userId]{
      _id,
      studentName,
      studentEmail,
      studentPhone,
      studentId,
      status,
      enrolledAt,
      experience,
      goals,
      "course": courseId->{
        _id,
        title,
        slug,
        level
      }
    } | order(enrolledAt desc)`

    const students = await client.fetch(query, { userId })

    return NextResponse.json({
      success: true,
      students,
    })
  } catch (error) {
    console.error('Failed to fetch teacher students:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
