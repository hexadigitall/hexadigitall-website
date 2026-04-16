import { NextResponse } from 'next/server'
import { getCourseAssessments } from '@/lib/assessment-registry'

interface TextbookAssessmentRouteParams {
  params: Promise<{ courseSlug: string }>
}

export async function GET(_request: Request, { params }: TextbookAssessmentRouteParams) {
  const { courseSlug } = await params
  const assessments = getCourseAssessments(courseSlug)

  return NextResponse.json({
    success: true,
    courseSlug,
    assessments,
  })
}