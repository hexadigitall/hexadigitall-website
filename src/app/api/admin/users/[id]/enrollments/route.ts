import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

type EnrollmentRecord = {
  _id: string
  courseId?: { _ref?: string }
  studentId?: { _ref?: string }
  studentEmail?: string
  courseAccessGranted?: boolean
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id: studentId } = await params

  try {
    const student = await client.fetch(
      `*[_type == "user" && _id == $studentId && role == "student"][0]{ _id, email }`,
      { studentId }
    )

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 })
    }

    const allCourses = await client.fetch(
      `*[_type == "course"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description
      }`
    )

    const assignedCourses = await client.fetch<Array<{ courseId?: { _id?: string } }>>(
      `*[_type == "enrollment" && courseAccessGranted == true && ((defined(studentId._ref) && studentId._ref == $studentId) || lower(studentEmail) == lower($studentEmail))] {
        courseId->{ _id }
      }`,
      { studentId, studentEmail: student.email || '' }
    )

    const assignedCourseIds = assignedCourses
      .map((enrollment) => enrollment.courseId?._id)
      .filter((courseId): courseId is string => Boolean(courseId))

    return NextResponse.json({ success: true, allCourses, assignedCourseIds })
  } catch (error) {
    console.error('Failed to fetch student enrollments:', error)
    return NextResponse.json({ message: 'Failed to fetch student enrollments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id: studentId } = await params

  try {
    const body = await req.json()
    const { courseIds } = body as { courseIds: string[] }

    if (!Array.isArray(courseIds)) {
      return NextResponse.json({ message: 'courseIds must be an array' }, { status: 400 })
    }

    const student = await client.fetch(
      `*[_type == "user" && _id == $studentId && role == "student"][0]{ _id, name, username, email }`,
      { studentId }
    )

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 })
    }

    const allCourses = await client.fetch<Array<{ _id: string }>>(
      `*[_type == "course"]{ _id }`
    )

    const validCourseIds = new Set(allCourses.map((course) => course._id))
    const requestedCourseIds = [...new Set(courseIds)].filter((courseId) => validCourseIds.has(courseId))

    const enrollments = await client.fetch<Array<EnrollmentRecord>>(
      `*[_type == "enrollment" && ((defined(studentId._ref) && studentId._ref == $studentId) || lower(studentEmail) == lower($studentEmail))] {
        _id,
        courseId,
        studentId,
        studentEmail,
        courseAccessGranted
      }`,
      { studentId, studentEmail: student.email || '' }
    )

    const enrollmentsByCourse = new Map<string, EnrollmentRecord[]>()
    for (const enrollment of enrollments) {
      const courseId = enrollment.courseId?._ref
      if (!courseId) continue

      const existing = enrollmentsByCourse.get(courseId) || []
      existing.push(enrollment)
      enrollmentsByCourse.set(courseId, existing)
    }

    const updates: Array<Promise<unknown>> = []

    for (const [courseId, matchingEnrollments] of enrollmentsByCourse.entries()) {
      if (!requestedCourseIds.includes(courseId)) {
        for (const enrollment of matchingEnrollments) {
          if (enrollment.courseAccessGranted) {
            updates.push(
              writeClient
                .patch(enrollment._id)
                .set({ courseAccessGranted: false, paymentStatus: 'cancelled' })
                .commit()
            )
          }
        }
      }
    }

    for (const courseId of requestedCourseIds) {
      const matchingEnrollments = enrollmentsByCourse.get(courseId) || []
      const grantedEnrollment = matchingEnrollments.find((enrollment) => enrollment.courseAccessGranted)

      if (grantedEnrollment) {
        if (grantedEnrollment.studentId?._ref !== studentId) {
          updates.push(
            writeClient
              .patch(grantedEnrollment._id)
              .set({
                studentId: { _type: 'reference', _ref: studentId },
                studentName: student.name || student.username,
                studentEmail: student.email,
              })
              .commit()
          )
        }
        continue
      }

      const existingEnrollment = matchingEnrollments[0]

      if (existingEnrollment) {
        updates.push(
          writeClient
            .patch(existingEnrollment._id)
            .set({
              studentId: { _type: 'reference', _ref: studentId },
              studentName: student.name || student.username,
              studentEmail: student.email,
              courseAccessGranted: true,
              paymentStatus: 'completed',
            })
            .commit()
        )
        continue
      }

      updates.push(
        writeClient.create({
          _type: 'enrollment',
          courseId: { _type: 'reference', _ref: courseId },
          studentId: { _type: 'reference', _ref: studentId },
          studentName: student.name || student.username,
          studentEmail: student.email,
          studentPhone: 'N/A',
          courseType: 'self-paced',
          paymentStatus: 'completed',
          courseAccessGranted: true,
          enrolledAt: new Date().toISOString(),
          stripeSessionId: `admin-grant-${studentId}-${Date.now()}`,
          amount: 1,
        })
      )
    }

    await Promise.all(updates)

    return NextResponse.json({ success: true, message: 'Student course access updated' })
  } catch (error) {
    console.error('Failed to update student course access:', error)
    return NextResponse.json({ message: 'Failed to update student course access' }, { status: 500 })
  }
}