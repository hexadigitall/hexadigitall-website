import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'
import { getCourseAssessment, gradeAssessment } from '@/lib/assessment-registry'
import { getSessionUserFromAuthHeader } from '@/lib/session-auth'

interface SubmitRouteParams {
  params: Promise<{ courseSlug: string; assessmentSlug: string }>
}

interface SubmitBody {
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

function answersArrayToMap(answers: Array<{ questionId?: string; selectedOptionId?: string }> | undefined) {
  const map: Record<string, string> = {}
  if (!answers) return map
  for (const item of answers) {
    if (item.questionId && item.selectedOptionId) {
      map[item.questionId] = item.selectedOptionId
    }
  }
  return map
}

export async function POST(request: NextRequest, { params }: SubmitRouteParams) {
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

    const body = (await request.json()) as SubmitBody
    if (!body.attemptId || typeof body.answers !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
    }

    const attempt = await client.fetch<{
      _id: string
      studentId?: { _ref?: string }
      status: string
      startedAt: string
      expiresAt: string
      assessmentSlug: string
      courseSlug: string
      answers?: Array<{ questionId?: string; selectedOptionId?: string }>
      scoreRaw?: number
      scorePercent?: number
      passPercentage?: number
      totalQuestions?: number
      passed?: boolean
      resultCode?: string
      submittedAt?: string
      timeSpentSeconds?: number
    } | null>(
      `*[_type == "assessmentAttempt" && _id == $attemptId][0]{
        _id,
        studentId,
        status,
        startedAt,
        expiresAt,
        assessmentSlug,
        courseSlug,
        answers,
        scoreRaw,
        scorePercent,
        passPercentage,
        totalQuestions,
        passed,
        resultCode,
        submittedAt,
        timeSpentSeconds
      }`,
      { attemptId: body.attemptId },
    )

    if (!attempt) {
      return NextResponse.json({ success: false, message: 'Attempt not found' }, { status: 404 })
    }

    if (attempt.studentId?._ref !== user._id && user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    if (attempt.courseSlug !== courseSlug || attempt.assessmentSlug !== assessmentSlug) {
      return NextResponse.json({ success: false, message: 'Attempt does not match assessment' }, { status: 409 })
    }

    if (attempt.status === 'submitted') {
      return NextResponse.json({
        success: true,
        attempt: {
          attemptId: attempt._id,
          status: attempt.status,
          submittedAt: attempt.submittedAt,
          resultCode: attempt.resultCode,
          result: {
            scoreRaw: attempt.scoreRaw ?? 0,
            scorePercent: attempt.scorePercent ?? 0,
            passPercentage: attempt.passPercentage ?? assessment.passPercentage,
            totalQuestions: attempt.totalQuestions ?? assessment.totalQuestions,
            passed: Boolean(attempt.passed),
            timeSpentSeconds: attempt.timeSpentSeconds ?? 0,
          },
        },
      })
    }

    const now = Date.now()
    const expiresAt = new Date(attempt.expiresAt).getTime()
    const timedOut = now > expiresAt
    const finalAnswers = timedOut ? answersArrayToMap(attempt.answers) : body.answers

    const result = gradeAssessment(courseSlug, assessmentSlug, finalAnswers)
    const startedAt = new Date(attempt.startedAt).getTime()
    const finalEndedAt = timedOut ? expiresAt : now
    const timeSpentSeconds = Math.max(0, Math.round((finalEndedAt - startedAt) / 1000))

    await writeClient
      .patch(attempt._id)
      .set({
        answers: toAnswerArray(finalAnswers),
        submittedAt: new Date(finalEndedAt).toISOString(),
        status: timedOut ? 'expired' : 'submitted',
        scoreRaw: result.scoreRaw,
        scorePercent: result.scorePercent,
        passed: result.passed,
        passPercentage: result.passPercentage,
        totalQuestions: result.totalQuestions,
        timeSpentSeconds,
      })
      .commit()

    return NextResponse.json({
      success: true,
      timedOut,
      attempt: {
        attemptId: attempt._id,
        status: timedOut ? 'expired' : 'submitted',
        submittedAt: new Date(finalEndedAt).toISOString(),
        resultCode: attempt.resultCode,
        result: {
          ...result,
          timeSpentSeconds,
        },
      },
    })
  } catch (error) {
    console.error('Failed to submit assessment attempt:', error)
    return NextResponse.json({ success: false, message: 'Failed to submit assessment attempt' }, { status: 500 })
  }
}
