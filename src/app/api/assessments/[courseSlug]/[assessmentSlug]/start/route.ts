import { NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client, writeClient } from '@/sanity/client'
import { getCourseAssessment, getPublicAssessmentDefinition } from '@/lib/assessment-registry'
import { getSessionUserFromAuthHeader } from '@/lib/session-auth'
import { verifyAssessmentAccess } from '@/lib/assessment-access'

interface StartRouteParams {
  params: Promise<{ courseSlug: string; assessmentSlug: string }>
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

function generateResultCode(courseSlug: string, assessmentSlug: string) {
  const compactCourse = courseSlug.replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase()
  const compactAssessment = assessmentSlug.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()
  const stamp = Date.now().toString(36).toUpperCase()
  return `HX-${compactCourse}-${compactAssessment}-${stamp}`
}

export async function POST(request: NextRequest, { params }: StartRouteParams) {
  try {
    const { courseSlug, assessmentSlug } = await params
    const user = await getSessionUserFromAuthHeader(request.headers.get('authorization'))

    if (!user || (user.role !== 'student' && user.role !== 'admin' && user.role !== 'teacher')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const assessment = getCourseAssessment(courseSlug, assessmentSlug)
    const publicDefinition = getPublicAssessmentDefinition(courseSlug, assessmentSlug)

    if (!assessment || !publicDefinition) {
      return NextResponse.json({ success: false, message: 'Assessment not found' }, { status: 404 })
    }

    const access = await verifyAssessmentAccess(user, courseSlug)
    if (!access.allowed) {
      return NextResponse.json({ success: false, message: access.reason || 'Access denied' }, { status: 403 })
    }

    type PreviousAttempt = {
      _id: string
      status: string
      startedAt: string
      expiresAt: string
      submittedAt?: string
      answers?: Array<{ questionId?: string; selectedOptionId?: string }>
      scoreRaw?: number
      scorePercent?: number
      passed?: boolean
      passPercentage?: number
      totalQuestions?: number
      timeSpentSeconds?: number
      resultCode?: string
      attemptNumber?: number
    } | null

    // Only look up previous attempts when we have a real Sanity user _id.
    // Legacy admin tokens can have _id = '' which makes the GROQ filter match nothing anyway,
    // but we skip the round-trip entirely to avoid potential issues.
    const latestAttempt: PreviousAttempt = user._id
      ? await client.fetch<PreviousAttempt>(
          groq`*[_type == "assessmentAttempt" && studentId._ref == $studentId && courseSlug == $courseSlug && assessmentSlug == $assessmentSlug] | order(_createdAt desc)[0] {
            _id,
            status,
            startedAt,
            expiresAt,
            submittedAt,
            answers,
            scoreRaw,
            scorePercent,
            passed,
            passPercentage,
            totalQuestions,
            timeSpentSeconds,
            resultCode,
            attemptNumber
          }`,
          { studentId: user._id, courseSlug, assessmentSlug },
        )
      : null

    const now = Date.now()

    if (latestAttempt && latestAttempt.status === 'in_progress' && new Date(latestAttempt.expiresAt).getTime() > now) {
      return NextResponse.json({
        success: true,
        assessment: publicDefinition,
        attempt: {
          attemptId: latestAttempt._id,
          startedAt: latestAttempt.startedAt,
          expiresAt: latestAttempt.expiresAt,
          status: latestAttempt.status,
          answers: answersArrayToMap(latestAttempt.answers),
          attemptNumber: latestAttempt.attemptNumber || 1,
          resultCode: latestAttempt.resultCode,
        },
      })
    }

    if (latestAttempt && latestAttempt.status === 'submitted') {
      return NextResponse.json({
        success: true,
        assessment: publicDefinition,
        attempt: {
          attemptId: latestAttempt._id,
          startedAt: latestAttempt.startedAt,
          expiresAt: latestAttempt.expiresAt,
          submittedAt: latestAttempt.submittedAt,
          status: latestAttempt.status,
          answers: answersArrayToMap(latestAttempt.answers),
          attemptNumber: latestAttempt.attemptNumber || 1,
          resultCode: latestAttempt.resultCode,
          result: {
            scoreRaw: latestAttempt.scoreRaw ?? 0,
            scorePercent: latestAttempt.scorePercent ?? 0,
            passed: Boolean(latestAttempt.passed),
            passPercentage: latestAttempt.passPercentage ?? assessment.passPercentage,
            totalQuestions: latestAttempt.totalQuestions ?? assessment.totalQuestions,
            timeSpentSeconds: latestAttempt.timeSpentSeconds ?? 0,
          },
        },
      })
    }

    const startedAtIso = new Date().toISOString()
    const expiresAtIso = new Date(now + assessment.durationMinutes * 60 * 1000).toISOString()
    const attemptNumber = (latestAttempt?.attemptNumber || 0) + 1

    const createdAttempt = await writeClient.create({
      _type: 'assessmentAttempt',
      courseSlug,
      assessmentSlug,
      assessmentTitle: assessment.title,
      phaseLabel: assessment.phaseLabel,
      // Only write studentId reference when we have a valid Sanity document _id.
      // Legacy admin tokens decoded without a userId yield _id = '' which Sanity rejects.
      ...(user._id ? { studentId: { _type: 'reference', _ref: user._id } } : {}),
      enrollmentId: access.enrollmentId
        ? {
            _type: 'reference',
            _ref: access.enrollmentId,
          }
        : undefined,
      studentNameSnapshot: access.studentName || user.name || user.username,
      studentEmailSnapshot: access.studentEmail || user.email,
      startedAt: startedAtIso,
      expiresAt: expiresAtIso,
      status: 'in_progress',
      durationMinutes: assessment.durationMinutes,
      passPercentage: assessment.passPercentage,
      totalQuestions: assessment.totalQuestions,
      answers: [],
      attemptNumber,
      resultCode: generateResultCode(courseSlug, assessmentSlug),
    })

    return NextResponse.json({
      success: true,
      assessment: publicDefinition,
      attempt: {
        attemptId: createdAttempt._id,
        startedAt: startedAtIso,
        expiresAt: expiresAtIso,
        status: 'in_progress',
        answers: {},
        attemptNumber,
        resultCode: createdAttempt.resultCode,
      },
    })
  } catch (error) {
    console.error('Failed to start assessment attempt:', error)
    return NextResponse.json({ success: false, message: 'Failed to start assessment attempt' }, { status: 500 })
  }
}
