import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { getPublicAssessmentDefinition } from '@/lib/assessment-registry'
import { getSessionUserFromToken } from '@/lib/session-auth'
import { verifyAssessmentAccess } from '@/lib/assessment-access'
import AssessmentExamClient from '@/app/courses/[slug]/assessments/[assessmentSlug]/AssessmentExamClient'

interface CourseLite {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
}

type Props = {
  params: Promise<{ slug: string; assessmentSlug: string }>
}

async function getCourse(slug: string): Promise<CourseLite | null> {
  return client.fetch<CourseLite | null>(
    groq`*[_type == "course" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      summary
    }`,
    { slug },
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, assessmentSlug } = await params
  const course = await getCourse(slug)
  const assessment = getPublicAssessmentDefinition(slug, assessmentSlug)

  if (!course || !assessment) {
    return { title: 'Assessment Not Found | Hexadigitall' }
  }

  return {
    title: `${assessment.title} | ${course.title} | Hexadigitall`,
    description: assessment.description,
  }
}

export default async function AssessmentExamPage({ params }: Props) {
  const { slug, assessmentSlug } = await params

  const course = await getCourse(slug)
  const assessment = getPublicAssessmentDefinition(slug, assessmentSlug)

  if (!course || !assessment) notFound()

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_token')?.value || null

  let viewerRole: 'guest' | 'student' | 'teacher' | 'admin' = 'guest'
  let viewerName = 'Candidate'
  let canAttempt = false
  let accessMessage = 'Sign in with your student account to begin this assessment.'

  if (sessionToken) {
    const user = await getSessionUserFromToken(sessionToken)
    if (user) {
      viewerRole = user.role
      viewerName = user.name || user.username || 'Candidate'

      const access = await verifyAssessmentAccess(user, slug)
      if (access.allowed) {
        if (user.role === 'student' || user.role === 'admin') {
          canAttempt = true
          accessMessage = 'You are cleared to take this timed assessment.'
        } else {
          canAttempt = false
          accessMessage = 'Teacher preview mode is available. Timed attempt submission is restricted to students and admins.'
        }
      } else {
        canAttempt = false
        accessMessage = access.reason || 'Access to this course assessment is currently restricted.'
      }
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-slate-500">
        <Link href="/courses" className="hover:text-slate-700">Courses</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${slug}`} className="hover:text-slate-700">{course.title}</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${slug}/assessments`} className="hover:text-slate-700">Assessments</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-700">{assessment.phaseLabel}</span>
      </nav>

      <AssessmentExamClient
        courseTitle={course.title}
        courseSlug={slug}
        assessment={assessment}
        viewerName={viewerName}
        viewerRole={viewerRole}
        canAttempt={canAttempt}
        accessMessage={accessMessage}
      />
    </main>
  )
}
