import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

async function getEnrollmentById(id: string) {
  return client.fetch(
    `*[_type == "enrollment" && _id == $id][0]{
      _id,
      courseId->{_id, title},
      studentName,
      studentEmail,
      courseType,
      paymentStatus,
      teacherId->{_id, username, name, email}
    }`,
    { id }
  )
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const url = new URL(request.url)
  const courseId = url.searchParams.get('courseId')
  const enrollmentId = url.searchParams.get('enrollmentId')

  try {
    let query = '*[_type == "enrollment"]'
    let queryParams: Record<string, string> = {}

    if (courseId) {
      query = '*[_type == "enrollment" && courseId._ref == $courseId]'
      queryParams = { courseId }
    } else if (enrollmentId) {
      query = '*[_type == "enrollment" && _id == $enrollmentId]'
      queryParams = { enrollmentId }
    }

    query += ` | order(enrolledAt desc) {
      _id,
      courseId->{_id, title, slug, price},
      studentId->{_id, username, email},
      teacherId->{_id, username, name, email},
      studentName,
      studentEmail,
      studentPhone,
      courseType,
      paymentStatus,
      enrolledAt,
      isActive,
      monthlyAmount,
      totalHours,
      goals,
      experience,
      hoursPerWeek,
      sessionFormat,
      preferredSchedule
    }`

    const enrollments = await client.fetch(query, queryParams)
    return NextResponse.json({ success: true, enrollments })
  } catch (error) {
    console.error('Enrollments fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  try {
    const body = await request.json() as {
      userId: string
      courseId: string
      studentName: string
      studentEmail: string
    }

    const { userId, courseId, studentName, studentEmail } = body

    if (!courseId || !studentName || !studentEmail) {
      return NextResponse.json(
        { success: false, message: 'courseId, studentName, and studentEmail are required' },
        { status: 400 }
      )
    }

    // Verify course exists
    const course = await client.fetch('*[_type == "course" && _id == $id][0]{_id, title}', { id: courseId })
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 })
    }

    // Check for existing enrollment for the same user + course
    if (userId) {
      const existing = await client.fetch(
        '*[_type == "enrollment" && courseId._ref == $courseId && studentId._ref == $userId][0]{_id}',
        { courseId, userId }
      )
      if (existing) {
        // If enrollment exists but access not granted, grant it
        await writeClient.patch(existing._id).set({ courseAccessGranted: true, paymentStatus: 'completed' }).commit()
        const updated = await getEnrollmentById(existing._id)
        return NextResponse.json({ success: true, enrollment: updated, message: 'Existing enrollment updated with access granted' })
      }
    }

    // Create enrollment document
    const enrollmentData: Record<string, unknown> = {
      _type: 'enrollment',
      courseId: { _type: 'reference', _ref: courseId },
      studentName,
      studentEmail,
      studentPhone: 'N/A',
      courseType: 'self-paced',
      paymentStatus: 'completed',
      courseAccessGranted: true,
      enrolledAt: new Date().toISOString(),
      stripeSessionId: `admin-grant-${Date.now()}`,
      amount: 1,
    }

    if (userId) {
      enrollmentData.studentId = { _type: 'reference', _ref: userId }
    }

    const enrollment = await writeClient.create(enrollmentData)
    const created = await getEnrollmentById(enrollment._id)
    return NextResponse.json({ success: true, enrollment: created }, { status: 201 })
  } catch (error) {
    console.error('Grant enrollment error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to grant course access' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const url = new URL(request.url)
  const match = url.pathname.match(/\/enrollments\/([^/]+)/)
  const enrollmentId = match ? match[1] : null

  if (!enrollmentId) {
    return NextResponse.json(
      { success: false, message: 'Enrollment ID required' },
      { status: 400 }
    )
  }

  try {
    const { teacherId } = await request.json()

    if (!teacherId) {
      return NextResponse.json(
        { success: false, message: 'Teacher ID required' },
        { status: 400 }
      )
    }

    // Verify teacher exists and has teacher role
    const teacher = await client.fetch(
      '*[_type == "user" && _id == $id && role == "teacher"][0]{ _id }',
      { id: teacherId }
    )

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Invalid teacher ID' },
        { status: 400 }
      )
    }

    await writeClient
      .patch(enrollmentId)
      .set({ teacherId: { _type: 'reference', _ref: teacherId } })
      .commit()

    const updatedEnrollment = await getEnrollmentById(enrollmentId)

    return NextResponse.json({ success: true, enrollment: updatedEnrollment })
  } catch (error) {
    console.error('Assign teacher error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to assign teacher' },
      { status: 500 }
    )
  }
}
