import type {
  AssessmentResult,
  CourseAssessmentDefinition,
  CourseAssessmentPublicDefinition,
  CourseAssessmentPublicQuestion,
} from '@/lib/assessment-types'
import { architectingLandingZonesAssessments } from '@/lib/course-assessments/architecting-landing-zones'

const registry: Record<string, CourseAssessmentDefinition[]> = {
  'architecting-landing-zones': architectingLandingZonesAssessments,
}

export function getCourseAssessments(courseSlug: string): CourseAssessmentDefinition[] {
  return registry[courseSlug] || []
}

export function getCourseAssessment(courseSlug: string, assessmentSlug: string): CourseAssessmentDefinition | null {
  const assessments = getCourseAssessments(courseSlug)
  return assessments.find((item) => item.slug === assessmentSlug) || null
}

export function getPublicAssessmentDefinition(
  courseSlug: string,
  assessmentSlug: string,
): CourseAssessmentPublicDefinition | null {
  const assessment = getCourseAssessment(courseSlug, assessmentSlug)
  if (!assessment) return null

  const questions: CourseAssessmentPublicQuestion[] = assessment.questions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    options: question.options,
  }))

  return {
    courseSlug: assessment.courseSlug,
    slug: assessment.slug,
    title: assessment.title,
    phase: assessment.phase,
    phaseLabel: assessment.phaseLabel,
    description: assessment.description,
    instructions: assessment.instructions,
    durationMinutes: assessment.durationMinutes,
    passPercentage: assessment.passPercentage,
    totalQuestions: assessment.totalQuestions,
    questions,
  }
}

export function gradeAssessment(
  courseSlug: string,
  assessmentSlug: string,
  answers: Record<string, string>,
): AssessmentResult {
  const assessment = getCourseAssessment(courseSlug, assessmentSlug)
  if (!assessment) {
    throw new Error('Assessment definition not found')
  }

  let scoreRaw = 0
  const questions = assessment.questions.map((question) => {
    const selectedOptionId = answers[question.id] || null
    const isCorrect = selectedOptionId === question.correctOptionId
    if (isCorrect) scoreRaw += 1

    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect,
      explanation: question.explanation,
    }
  })

  const totalQuestions = assessment.questions.length
  const scorePercent = totalQuestions > 0 ? Math.round((scoreRaw / totalQuestions) * 100) : 0
  const passed = scorePercent >= assessment.passPercentage

  return {
    scoreRaw,
    scorePercent,
    passed,
    passPercentage: assessment.passPercentage,
    totalQuestions,
    questions,
  }
}
