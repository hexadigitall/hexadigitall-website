export type AssessmentPhase = 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'final'

export interface AssessmentOption {
  id: string
  text: string
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  options: AssessmentOption[]
  correctOptionId: string
  explanation: string
}

export interface CourseAssessmentDefinition {
  courseSlug: string
  slug: string
  title: string
  phase: AssessmentPhase
  phaseLabel: string
  description: string
  instructions: string[]
  durationMinutes: number
  passPercentage: number
  totalQuestions: number
  questions: AssessmentQuestion[]
}

export interface CourseAssessmentPublicQuestion {
  id: string
  prompt: string
  options: AssessmentOption[]
}

export interface CourseAssessmentPublicDefinition {
  courseSlug: string
  slug: string
  title: string
  phase: AssessmentPhase
  phaseLabel: string
  description: string
  instructions: string[]
  durationMinutes: number
  passPercentage: number
  totalQuestions: number
  questions: CourseAssessmentPublicQuestion[]
}

export interface AssessmentResultQuestion {
  questionId: string
  selectedOptionId: string | null
  correctOptionId: string
  isCorrect: boolean
  explanation: string
}

export interface AssessmentResult {
  scoreRaw: number
  scorePercent: number
  passed: boolean
  passPercentage: number
  totalQuestions: number
  questions: AssessmentResultQuestion[]
}
