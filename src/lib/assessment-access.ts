import { client } from '@/sanity/client'
import type { SessionUser } from '@/lib/session-auth'

export interface AssessmentAccessResult {
  allowed: boolean
  reason?: string
  enrollmentId?: string
  studentName?: string
  studentEmail?: string
}

export async function verifyAssessmentAccess(
  user: SessionUser,
  courseSlug: string,
): Promise<AssessmentAccessResult> {
  if (user.role === 'admin') {
    return { allowed: true, studentName: user.name, studentEmail: user.email }
  }

  if (user.role === 'teacher') {
    const assigned = await client.fetch<number>(
      `count(*[_type == "course" && slug.current == $courseSlug && ($userId in assignedTeachers[]._ref || references($userId))])`,
      { courseSlug, userId: user._id },
    )

    if (!assigned) {
      return { allowed: false, reason: 'Teacher is not assigned to this course.' }
    }

    return { allowed: true, studentName: user.name, studentEmail: user.email }
  }

  type EnrollmentResult = { _id: string; studentName?: string; studentEmail?: string } | null

  // Primary path: match by linked studentId reference (fast and precise)
  let enrollment: EnrollmentResult = null

  if (user._id) {
    enrollment = await client.fetch<EnrollmentResult>(
      `*[_type == "enrollment" && studentId._ref == $studentId && courseId->slug.current == $courseSlug && courseAccessGranted == true][0]{
        _id,
        studentName,
        studentEmail
      }`,
      { studentId: user._id, courseSlug },
    )
  }

  // Fallback: match by email — covers enrollments created before account linking
  // (e.g. admin-created or payment-webhook enrollments without a studentId ref)
  if (!enrollment && user.email) {
    enrollment = await client.fetch<EnrollmentResult>(
      `*[_type == "enrollment" && lower(studentEmail) == lower($email) && courseId->slug.current == $courseSlug && courseAccessGranted == true][0]{
        _id,
        studentName,
        studentEmail
      }`,
      { email: user.email, courseSlug },
    )
  }

  if (!enrollment) {
    return {
      allowed: false,
      reason: 'No active enrollment found for this course. Please contact your teacher or administrator.',
    }
  }

  return {
    allowed: true,
    enrollmentId: enrollment._id,
    studentName: enrollment.studentName || user.name,
    studentEmail: enrollment.studentEmail || user.email,
  }
}
