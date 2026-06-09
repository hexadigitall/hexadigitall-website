import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { getCourseAssessment } from '@/lib/assessment-registry'
import { getSessionUserFromAuthHeader } from '@/lib/session-auth'

interface SaveRouteParams {
  params: Promise<{ courseSlug: string; assessmentSlug: string }>
}

interface SaveBody {
  attemptId: string
  answers: Record<string, string>
}

function toAnswerArray(answers: Record<string, string>) {
  return Object.entries(answers)
    .filter(([questionId, selectedOptionId]) => Boolean(questionId) && Boolean(selectedOptionId))
    .map(([questionId, selectedOptionId]) => ({
      _key: `${questionId}-${selectedOptionId}`,
      questionId,
      selectedOptionId,
    }))
}

export async function POST(request: NextRequest, { params }: SaveRouteParams) {
  try {
    const { courseSlug, assessmentSlug } = await params
    const user = await getSessionUserFromAuthHeader(request.headers.get('authorization'))

    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const assessment = getCourseAssessment(courseSlug, assessmentSlug)
    if (!assessment) {
      return NextResponse.json({ success: false, message: 'Assessment not found' }, { status: 404 })
    }

    const body = (await request.json()) as SaveBody
    if (!body.attemptId || typeof body.answers !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
    }

    const attempt = await client.fetch<{
      _id: string
      studentId?: { _ref?: string }
      status: string
      expiresAt: string
      assessmentSlug: string
      courseSlug: string
    } | null>(
      `*[_type == "assessmentAttempt" && _id == $attemptId][0]{
        _id,
        studentId,
        status,
        expiresAt,
        assessmentSlug,
        courseSlug
      }`,
      { attemptId: body.attemptId },
    )

    if (!attempt) {
      return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 })
    }

    if (attempt.studentId?._ref !== user._id && user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json({ success: false, message: 'Attempt is not in progress' }, { status: 409 })
    }

    if (attempt.courseSlug !== courseSlug || attempt.assessmentSlug !== assessmentSlug) {
      return NextResponse.json({ success: false, message: 'Attempt does not match assessment' }, { status: 409 })
    }

    if (new Date(attempt.expiresAt).getTime() <= Date.now()) {
      await writeClient.patch(attempt._id).set({ status: 'expired' }).commit()
      return NextResponse.json({ success: false, message: 'Assessment timer has expired' }, { status: 409 })
    }

    await writeClient.patch(attempt._id).set({ answers: toAnswerArray(body.answers) }).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save assessment attempt:', error)
    return NextResponse.json({ success: false, message: 'Failed to save assessment attempt' }, { status: 500 })
  }
}
