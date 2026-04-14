import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { getCourseAssessments } from '@/lib/assessment-registry'

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

    const courses = await client.fetch<Array<{ _id: string; title: string; slug?: string }>>(
      user.role === 'admin'
        ? `*[_type == "course"]{ _id, title, "slug": slug.current }`
        : `*[_type == "course" && ($userId in assignedTeachers[]._ref || references($userId))]{ _id, title, "slug": slug.current }`,
      { userId }
    )

    const slugToTitle = new Map<string, string>()
    const quickCopyPanels = courses
      .filter((course) => Boolean(course.slug))
      .map((course) => {
        const courseSlug = course.slug as string
        slugToTitle.set(courseSlug, course.title)

        const assessments = getCourseAssessments(courseSlug).map((assessment) => ({
          slug: assessment.slug,
          title: assessment.title,
          phaseLabel: assessment.phaseLabel,
          relativeUrl: `/courses/${courseSlug}/assessments/${assessment.slug}`,
        }))

        return {
          courseTitle: course.title,
          courseSlug,
          assessments,
        }
      })
      .filter((panel) => panel.assessments.length > 0)

    const courseSlugs = quickCopyPanels.map((panel) => panel.courseSlug)

    const attempts = courseSlugs.length
      ? await client.fetch<
          Array<{
            _id: string
            courseSlug: string
            assessmentSlug: string
            assessmentTitle: string
            phaseLabel: string
            status: string
            scorePercent?: number
            passed?: boolean
            startedAt: string
            submittedAt?: string
            studentNameSnapshot?: string
            studentEmailSnapshot?: string
            resultCode?: string
          }>
        >(
          `*[_type == "assessmentAttempt" && courseSlug in $courseSlugs] | order(coalesce(submittedAt, _updatedAt) desc)[0...300] {
            _id,
            courseSlug,
            assessmentSlug,
            assessmentTitle,
            phaseLabel,
            status,
            scorePercent,
            passed,
            startedAt,
            submittedAt,
            studentNameSnapshot,
            studentEmailSnapshot,
            resultCode
          }`,
          { courseSlugs }
        )
      : []

    const attemptsWithCourseTitle = attempts.map((attempt) => ({
      ...attempt,
      courseTitle: slugToTitle.get(attempt.courseSlug) || attempt.courseSlug,
    }))

    return NextResponse.json({
      success: true,
      quickCopyPanels,
      attempts: attemptsWithCourseTitle,
    })
  } catch (error) {
    console.error('Failed to fetch teacher assessment data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch teacher assessment data' },
      { status: 500 }
    )
  }
}
