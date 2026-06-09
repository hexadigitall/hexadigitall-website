import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

type UserDoc = {
  _id: string
  username: string
  email: string
  name?: string
  role: 'admin' | 'teacher' | 'student'
  status?: 'active' | 'suspended' | 'pending'
}

type CourseDoc = {
  _id: string
  title: string
  slug?: string
  courseType?: 'live' | 'self-paced'
  assignedTeachers?: Array<{ _ref?: string }>
}

type EnrollmentDoc = {
  _id: string
  courseId?: { _ref?: string }
  studentId?: { _ref?: string }
  teacherId?: { _ref?: string }
  studentName?: string
  studentEmail?: string
  paymentStatus?: string
  courseAccessGranted?: boolean
  enrolledAt?: string
}

type AttemptDoc = {
  _id: string
  courseSlug: string
  assessmentTitle?: string
  phaseLabel?: string
  status?: 'in_progress' | 'submitted' | 'expired'
  scorePercent?: number
  passed?: boolean
  submittedAt?: string
  startedAt?: string
  studentNameSnapshot?: string
  studentEmailSnapshot?: string
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  try {
    const [users, courses, enrollments, attempts] = await Promise.all([
      client.fetch<UserDoc[]>(
        '*[_type == "user"]{ _id, username, email, name, role, status }'
      ),
      client.fetch<CourseDoc[]>(
        '*[_type == "course"]{ _id, title, "slug": slug.current, courseType, assignedTeachers }'
      ),
      client.fetch<EnrollmentDoc[]>(
        '*[_type == "enrollment"]{ _id, courseId, studentId, teacherId, studentName, studentEmail, paymentStatus, courseAccessGranted, enrolledAt }'
      ),
      client.fetch<AttemptDoc[]>(
        '*[_type == "assessmentAttempt"] | order(coalesce(submittedAt, _updatedAt) desc)[0...300]{ _id, courseSlug, assessmentTitle, phaseLabel, status, scorePercent, passed, submittedAt, startedAt, studentNameSnapshot, studentEmailSnapshot }'
      ),
    ])

    const usersById = new Map(users.map((user) => [user._id, user]))
    const coursesById = new Map(courses.map((course) => [course._id, course]))
    const coursesBySlug = new Map(courses.filter((c) => c.slug).map((course) => [course.slug as string, course]))

    const teacherUsers = users.filter((user) => user.role === 'teacher')
    const studentUsers = users.filter((user) => user.role === 'student')

    const teacherCourseIds = new Map<string, Set<string>>()
    for (const course of courses) {
      for (const teacherRef of course.assignedTeachers || []) {
        if (!teacherRef?._ref) continue
        if (!teacherCourseIds.has(teacherRef._ref)) teacherCourseIds.set(teacherRef._ref, new Set())
        teacherCourseIds.get(teacherRef._ref)?.add(course._id)
      }
    }

    const studentCourseIdsByUserId = new Map<string, Set<string>>()
    const studentCourseIdsByEmail = new Map<string, Set<string>>()
    const teacherStudentIds = new Map<string, Set<string>>()
    const teacherStudentEmails = new Map<string, Set<string>>()

    let orphanEmailEnrollments = 0
    const duplicateTracker = new Map<string, number>()

    for (const enrollment of enrollments) {
      const courseId = enrollment.courseId?._ref
      const studentId = enrollment.studentId?._ref
      const teacherId = enrollment.teacherId?._ref
      const email = enrollment.studentEmail?.toLowerCase().trim()
      const granted = enrollment.courseAccessGranted === true

      if (granted && courseId && studentId) {
        if (!studentCourseIdsByUserId.has(studentId)) studentCourseIdsByUserId.set(studentId, new Set())
        studentCourseIdsByUserId.get(studentId)?.add(courseId)

        const duplicateKey = `${studentId}::${courseId}`
        duplicateTracker.set(duplicateKey, (duplicateTracker.get(duplicateKey) || 0) + 1)
      }

      if (granted && courseId && email) {
        if (!studentCourseIdsByEmail.has(email)) studentCourseIdsByEmail.set(email, new Set())
        studentCourseIdsByEmail.get(email)?.add(courseId)
      }

      if (granted && !studentId && email) {
        orphanEmailEnrollments += 1
      }

      if (granted && teacherId) {
        if (studentId) {
          if (!teacherStudentIds.has(teacherId)) teacherStudentIds.set(teacherId, new Set())
          teacherStudentIds.get(teacherId)?.add(studentId)
        } else if (email) {
          if (!teacherStudentEmails.has(teacherId)) teacherStudentEmails.set(teacherId, new Set())
          teacherStudentEmails.get(teacherId)?.add(email)
        }
      }
    }

    const teachers = teacherUsers.map((teacher) => {
      const assignedCourseIdSet = teacherCourseIds.get(teacher._id) || new Set<string>()
      const assignedCourseTitles = Array.from(assignedCourseIdSet)
        .map((courseId) => coursesById.get(courseId)?.title)
        .filter((title): title is string => Boolean(title))

      const studentIdSet = teacherStudentIds.get(teacher._id) || new Set<string>()
      const studentEmailSet = teacherStudentEmails.get(teacher._id) || new Set<string>()
      const activeStudentCount = studentIdSet.size + studentEmailSet.size

      return {
        _id: teacher._id,
        name: teacher.name || teacher.username,
        username: teacher.username,
        email: teacher.email,
        status: teacher.status || 'active',
        assignedCourseCount: assignedCourseTitles.length,
        assignedCourses: assignedCourseTitles,
        activeStudentCount,
      }
    })

    const students = studentUsers.map((student) => {
      const byId = studentCourseIdsByUserId.get(student._id) || new Set<string>()
      const byEmail = studentCourseIdsByEmail.get(student.email.toLowerCase().trim()) || new Set<string>()
      const mergedCourseIds = new Set<string>([...Array.from(byId), ...Array.from(byEmail)])
      const courseTitles = Array.from(mergedCourseIds)
        .map((courseId) => coursesById.get(courseId)?.title)
        .filter((title): title is string => Boolean(title))

      return {
        _id: student._id,
        name: student.name || student.username,
        username: student.username,
        email: student.email,
        status: student.status || 'active',
        assignedCourseCount: courseTitles.length,
        courses: courseTitles,
      }
    })

    const courseRows = courses.map((course) => {
      const assignedTeacherIds = (course.assignedTeachers || [])
        .map((item) => item._ref)
        .filter((id): id is string => Boolean(id))

      const assignedTeacherNames = assignedTeacherIds
        .map((teacherId) => {
          const teacher = usersById.get(teacherId)
          return teacher ? teacher.name || teacher.username : null
        })
        .filter((name): name is string => Boolean(name))

      const grantedEnrollments = enrollments.filter(
        (enrollment) => enrollment.courseId?._ref === course._id && enrollment.courseAccessGranted === true
      )

      return {
        _id: course._id,
        title: course.title,
        slug: course.slug || '',
        courseType: course.courseType || 'self-paced',
        assignedTeacherCount: assignedTeacherNames.length,
        assignedTeachers: assignedTeacherNames,
        activeStudentCount: grantedEnrollments.length,
      }
    })

    const attemptRows = attempts.map((attempt) => ({
      _id: attempt._id,
      courseTitle: coursesBySlug.get(attempt.courseSlug)?.title || attempt.courseSlug,
      assessmentTitle: attempt.assessmentTitle || 'Untitled Assessment',
      phaseLabel: attempt.phaseLabel || 'Unknown Phase',
      studentName: attempt.studentNameSnapshot || 'Unknown Student',
      studentEmail: attempt.studentEmailSnapshot || '',
      status: attempt.status || 'in_progress',
      scorePercent: typeof attempt.scorePercent === 'number' ? attempt.scorePercent : null,
      passed: typeof attempt.passed === 'boolean' ? attempt.passed : null,
      submittedAt: attempt.submittedAt || null,
      startedAt: attempt.startedAt || null,
    }))

    const duplicateActiveEnrollmentCount = Array.from(duplicateTracker.values()).filter((count) => count > 1).length

    const unassignedLiveCourses = courseRows.filter(
      (course) => course.courseType === 'live' && course.assignedTeacherCount === 0
    ).length

    const studentsWithoutCourses = students.filter(
      (student) => student.status === 'active' && student.assignedCourseCount === 0
    ).length

    const suspendedTeachersAssigned = teachers.filter(
      (teacher) => teacher.status === 'suspended' && teacher.assignedCourseCount > 0
    ).length

    const metrics = {
      totalStudents: students.length,
      activeStudents: students.filter((student) => student.status === 'active').length,
      totalTeachers: teachers.length,
      activeTeachers: teachers.filter((teacher) => teacher.status === 'active').length,
      totalCourses: courseRows.length,
      coursesWithNoTeacher: unassignedLiveCourses,
      activeEnrollments: enrollments.filter((enrollment) => enrollment.courseAccessGranted === true).length,
      assessmentAttemptsTracked: attemptRows.length,
    }

    const alerts = [
      {
        key: 'unassigned-live-courses',
        label: 'Live Courses Without Teacher',
        severity: unassignedLiveCourses > 0 ? 'warning' : 'ok',
        count: unassignedLiveCourses,
      },
      {
        key: 'students-without-courses',
        label: 'Active Students Without Course Access',
        severity: studentsWithoutCourses > 0 ? 'warning' : 'ok',
        count: studentsWithoutCourses,
      },
      {
        key: 'orphan-email-enrollments',
        label: 'Email-only Active Enrollments',
        severity: orphanEmailEnrollments > 0 ? 'warning' : 'ok',
        count: orphanEmailEnrollments,
      },
      {
        key: 'duplicate-active-enrollments',
        label: 'Duplicate Active Enrollment Keys',
        severity: duplicateActiveEnrollmentCount > 0 ? 'warning' : 'ok',
        count: duplicateActiveEnrollmentCount,
      },
      {
        key: 'suspended-teachers-assigned',
        label: 'Suspended Teachers Still Assigned',
        severity: suspendedTeachersAssigned > 0 ? 'critical' : 'ok',
        count: suspendedTeachersAssigned,
      },
    ]

    return NextResponse.json({
      success: true,
      metrics,
      teachers,
      students,
      courses: courseRows,
      attempts: attemptRows,
      alerts,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Admin operations fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch operations data' },
      { status: 500 }
    )
  }
}
