import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { findCurriculumForCourseSlug } from '@/lib/curriculum-utils'
import CurriculumEmbed from '@/app/courses/[slug]/curriculum/CurriculumEmbed'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

type Props = {
  params: Promise<{ slug: string }>
}

interface CourseLite {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
  description?: string
}

async function getCourseBySlug(slug: string): Promise<CourseLite | null> {
  try {
    return await client.fetch<CourseLite | null>(
      groq`*[_type == "course" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        summary,
        description
      }`,
      { slug }
    )
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return { title: 'Curriculum Not Found | Hexadigitall' }
  }

  return {
    title: `${course.title} Curriculum | Hexadigitall`,
    description: course.summary || course.description || `Curriculum outline for ${course.title}.`,
    alternates: { canonical: `${BASE_URL}/courses/${slug}/curriculum` },
    openGraph: {
      title: `${course.title} Curriculum`,
      description: course.summary || course.description || `Curriculum outline for ${course.title}.`,
      url: `${BASE_URL}/courses/${slug}/curriculum`,
      siteName: 'Hexadigitall',
      locale: 'en_NG',
      type: 'website',
    },
  }
}

export default async function CourseCurriculumPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) notFound()

  const match = await findCurriculumForCourseSlug(slug)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
        <span className="mx-2">/</span>
        <Link href={`/courses/${slug}`} className="hover:text-primary transition-colors">{course.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-primary font-medium">Curriculum</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">{course.title} Curriculum</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Public curriculum preview for visitors and enrolled students. Use this page to evaluate module scope, outcomes, and learning path.
        </p>
      </header>

      {match ? (
        <>
          <CurriculumEmbed title={course.title} htmlUrl={match.asset.htmlPath} />
          <div>
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
            >
              Back to Course
            </Link>
          </div>
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-lg font-semibold text-gray-800">Curriculum file not mapped yet for this course.</p>
          <p className="text-sm text-gray-600 mt-2">
            We are standardizing curriculum URLs. Check back soon, or contact support for the latest syllabus copy.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href={`/courses/${slug}`}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Back to Course
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
            >
              Contact Support
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
