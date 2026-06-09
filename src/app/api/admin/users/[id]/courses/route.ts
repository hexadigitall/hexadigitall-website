import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id: teacherId } = await params

  try {
    // Fetch the teacher to verify they exist and are a teacher
    const teacher = await client.fetch(
      `*[_type == "user" && _id == $teacherId && role == "teacher"][0]`,
      { teacherId }
    )

    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 })
    }

    // Fetch all courses
    const allCourses = await client.fetch(
      `*[_type == "course"] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description
      }`
    )

    // Fetch courses where this teacher is assigned
    const assignedCourses = await client.fetch(
      `*[_type == "course" && references($teacherId)] { _id }`,
      { teacherId }
    )

    const assignedCourseIds = assignedCourses.map((c: { _id: string }) => c._id)

    const coursesWithAudit = await client.fetch<
      Array<{
        title: string
        entries?: Array<{ action: 'assigned' | 'removed'; changedAt: string; changedByUsername?: string }>
      }>
    >(
      `*[_type == "course" && count(assignmentAuditTrail[teacherId == $teacherId]) > 0] {
        title,
        "entries": assignmentAuditTrail[teacherId == $teacherId] | order(changedAt desc)[0...5] {
          action,
          changedAt,
          changedByUsername
        }
      }`,
      { teacherId }
    )

    const recentAuditEntries = coursesWithAudit
      .flatMap((item) =>
        (item.entries || []).map((entry) => ({
          courseTitle: item.title,
          action: entry.action,
          changedAt: entry.changedAt,
          changedByUsername: entry.changedByUsername || 'admin',
        }))
      )
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
      .slice(0, 8)

    return NextResponse.json({ success: true, allCourses, assignedCourseIds, recentAuditEntries })
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json({ message: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  const { id: teacherId } = await params

  try {
    const body = await req.json()
    const { courseIds } = body as { courseIds: string[] }
    if (!Array.isArray(courseIds)) {
      return NextResponse.json({ message: 'courseIds must be an array' }, { status: 400 })
    }

    // Verify teacher exists
    const teacher = await client.fetch(
      `*[_type == "user" && _id == $teacherId && role == "teacher"][0]`,
      { teacherId }
    )
    if (!teacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 })
    }

    // Get all courses
    const allCourses = await client.fetch<Array<{ _id: string; assignedTeachers?: Array<{ _ref: string }> }>>(
      `*[_type == "course"] { _id, assignedTeachers }`
    )

    // Update each course's assignedTeachers array
    const updates = allCourses.map((course) => {
      const currentTeachers = course.assignedTeachers || []
      const hasTeacher = currentTeachers.some((t) => t._ref === teacherId)
      const shouldHaveTeacher = courseIds.includes(course._id)

      if (shouldHaveTeacher && !hasTeacher) {
        const auditEntry = {
          _type: 'object',
          _key: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          teacherId,
          action: 'assigned',
          changedByUserId: auth.user.id || '',
          changedByUsername: auth.user.username,
          changedAt: new Date().toISOString(),
        }

        return writeClient
          .patch(course._id)
          .setIfMissing({ assignedTeachers: [], assignmentAuditTrail: [] })
          .append('assignedTeachers', [{ _type: 'reference', _ref: teacherId }])
          .append('assignmentAuditTrail', [auditEntry])
          .commit()
      } else if (!shouldHaveTeacher && hasTeacher) {
        const updatedTeachers = currentTeachers.filter((t) => t._ref !== teacherId)
        const auditEntry = {
          _type: 'object',
          _key: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          teacherId,
          action: 'removed',
          changedByUserId: auth.user.id || '',
          changedByUsername: auth.user.username,
          changedAt: new Date().toISOString(),
        }

        return writeClient
          .patch(course._id)
          .set({ assignedTeachers: updatedTeachers })
          .setIfMissing({ assignmentAuditTrail: [] })
          .append('assignmentAuditTrail', [auditEntry])
          .commit()
      }
      return null
    })

    await Promise.all(updates.filter(Boolean) as Array<Promise<unknown>>)

    return NextResponse.json({ success: true, message: 'Course assignments updated' })
  } catch (error) {
    console.error('Failed to update course assignments:', error)
    return NextResponse.json({ message: 'Failed to update course assignments' }, { status: 500 })
  }
}
