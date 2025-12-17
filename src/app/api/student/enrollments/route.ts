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
    
    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user._id || user.userId

    // Fetch enrollments for this student
    const query = `*[_type == "enrollment" && studentId._ref == $userId]{
      _id,
      courseType,
      status,
      enrolledAt,
      monthlyAmount,
      totalPrice,
      nextPaymentDue,
      "course": courseId->{
        _id,
        title,
        slug,
        description,
        level,
        mainImage,
        contentPdf,
        roadmapPdf,
        courseType
      },
      "teacher": teacherId->{
        _id,
        name,
        email
      }
    } | order(enrolledAt desc)`

    const enrollments = await client.fetch(query, { userId })

    return NextResponse.json({
      success: true,
      enrollments,
    })
  } catch (error) {
    console.error('Failed to fetch student enrollments:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}
