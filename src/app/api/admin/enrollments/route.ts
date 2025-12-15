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
