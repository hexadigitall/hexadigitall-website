import type { Metadata } from 'next'
import Link from 'next/link'
import { groq } from 'next-sanity'
import Banner from '@/components/common/Banner'
import { client } from '@/sanity/client'
import { getFallbackCourseCategories } from '@/lib/fallback-data'
import { findCurriculumForCourseSlug, getCurriculumAssets } from '@/lib/curriculum-utils'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

interface CourseItem {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
}

export const metadata: Metadata = {
  title: 'Course Curriculums | Hexadigitall',
  description: 'Browse official course curriculums before enrollment. Compare module breakdowns, outcomes, and study scope across courses.',
  alternates: { canonical: `${BASE_URL}/curriculums` },
  openGraph: {
    title: 'Hexadigitall Course Curriculums',
    description: 'Explore detailed curriculum outlines for Hexadigitall courses.',
    url: `${BASE_URL}/curriculums`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
  },
}

async function getAllCourses(): Promise<CourseItem[]> {
  try {
    const courses = await client.fetch<CourseItem[]>(groq`
      *[_type == "course" && defined(slug.current)] | order(title asc) {
        _id,
        title,
        slug,
        summary
      }
    `)
    if (courses?.length) return courses
  } catch {
    // fall through to fallback data
  }

  const fallback = await getFallbackCourseCategories() as Array<{ courses: CourseItem[] }>
  return fallback.flatMap((school) => school.courses ?? [])
}

export default async function CurriculumsIndexPage() {
  const [courses, assets] = await Promise.all([
    getAllCourses(),
    getCurriculumAssets(),
  ])

  const rows = await Promise.all(
    courses.map(async (course) => {
      const match = await findCurriculumForCourseSlug(course.slug.current)
      return { course, match }
    })
  )

  const matched = rows.filter((row) => !!row.match)
  const unmatched = rows.filter((row) => !row.match)

  return (
    <>
      <Banner
        title="Course Curriculums"
        description="Preview curriculum scope before you enroll. Students and visitors can review modules for every course."
        overlayClassName="bg-primary/80"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Curriculums</span>
        </nav>

        <section className="mb-10 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm text-gray-700">
            <strong>{matched.length}</strong> of <strong>{courses.length}</strong> courses currently have mapped curriculum pages.
            We also detected <strong>{assets.length}</strong> HTML curriculum files in the public curriculum library.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-4">Available Curriculums</h2>
          {matched.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matched.map(({ course, match }) => (
                <article key={course._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-darkText">{course.title}</p>
                  {course.summary && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.summary}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/courses/${course.slug.current}/curriculum`}
                      className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                    >
                      View Curriculum
                    </Link>
                    <Link
                      href={`/courses/${course.slug.current}`}
                      className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-gray-300"
                    >
                      View Course
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No curriculum mappings found yet.</p>
          )}
        </section>

        {unmatched.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Courses Awaiting Curriculum Mapping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unmatched.map(({ course }) => (
                <article key={course._id} className="rounded-xl border border-dashed border-gray-200 bg-white p-4">
                  <p className="font-medium text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Slug: {course.slug.current}</p>
                  <Link href={`/courses/${course.slug.current}`} className="mt-2 inline-block text-xs text-primary hover:underline">
                    Open course page
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
