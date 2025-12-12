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

  try {
    let query = '*[_type == "enrollment"]'
    if (courseId) {
      query = '*[_type == "enrollment" && courseId._ref == $courseId]'
    }
    query += ` | order(enrolledAt desc) {
      _id,
      courseId->{_id, title, slug},
      studentId->{_id, username, email},
      teacherId->{_id, username, name, email},
      studentName,
      studentEmail,
      studentPhone,
      courseType,
      paymentStatus,
      enrolledAt,
      isActive
    }`

    const enrollments = await client.fetch(query, courseId ? { courseId } : {})
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
