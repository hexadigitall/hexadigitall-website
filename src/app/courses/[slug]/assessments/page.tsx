import type { Metadata } from 'next'
import Link from 'next/link'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { getCourseAssessments } from '@/lib/assessment-registry'

interface CourseLite {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
}

type Props = {
  params: Promise<{ slug: string }>
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
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    return {
      title: 'Assessments Not Found | Hexadigitall',
    }
  }

  return {
    title: `${course.title} Assessments | Hexadigitall`,
    description: `Timed phase and certification assessments for ${course.title}.`,
  }
}

export default async function CourseAssessmentsPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) notFound()

  const assessments = getCourseAssessments(slug)

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-slate-500">
        <Link href="/courses" className="hover:text-slate-700">Courses</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${slug}`} className="hover:text-slate-700">{course.title}</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-700">Assessments</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-800 p-6 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">Assessment Center</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{course.title} Professional Assessments</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600">
          Study from the textbook first, then take the timed assessment when ready. Each assessment is auto-graded and includes a printable result record for submission.
        </p>
      </header>

      {assessments.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          Assessments are not configured for this course yet.
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {assessments.map((assessment) => (
            <article key={assessment.slug} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-800 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{assessment.phaseLabel}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{assessment.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{assessment.description}</p>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-800">Questions</dt>
                  <dd>{assessment.totalQuestions}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Duration</dt>
                  <dd>{assessment.durationMinutes} minutes</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Pass Mark</dt>
                  <dd>{assessment.passPercentage}%</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Mode</dt>
                  <dd>Timed and graded</dd>
                </div>
              </dl>

              <Link
                href={`/courses/${slug}/assessments/${assessment.slug}`}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open Assessment
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
