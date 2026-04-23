import type { Metadata } from 'next'
import Link from 'next/link'
import { groq } from 'next-sanity'
import Banner from '@/components/common/Banner'
import { client } from '@/sanity/client'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

interface CourseItem {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
}

interface CurriculumHubItem {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
  level?: string
  duration?: string
  course?: {
    _id: string
    title: string
    slug: { current: string }
    summary?: string
  }
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
    return await client.fetch<CourseItem[]>(groq`
      *[_type == "course" && defined(slug.current)] | order(title asc) {
        _id,
        title,
        slug,
        summary
      }
    `)
  } catch {
    return []
  }
}

async function getCurriculums(): Promise<CurriculumHubItem[]> {
  try {
    return await client.fetch<CurriculumHubItem[]>(groq`
      *[_type == "curriculum" && defined(slug.current)] | order(coalesce(course->title, title) asc) {
        _id,
        title,
        slug,
        summary,
        level,
        duration,
        "course": course->{
          _id,
          title,
          slug,
          summary
        }
      }
    `)
  } catch {
    return []
  }
}

export default async function CurriculumsIndexPage() {
  const [courses, curriculums] = await Promise.all([
    getAllCourses(),
    getCurriculums(),
  ])

  const courseSlugsWithCurriculum = new Set(
    curriculums
      .map((curriculum) => curriculum.course?.slug?.current)
      .filter((slug): slug is string => !!slug)
  )

  const unmatched = courses.filter((course) => !courseSlugsWithCurriculum.has(course.slug.current))

  return (
    <>
      <Banner
        title="Course Curriculums"
        description="Preview curriculum scope before you enroll. Students and visitors can review modules for every course."
        overlayClassName="bg-primary/80"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="text-sm text-gray-500 dark:text-slate-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Curriculums</span>
        </nav>

          <section className="mb-10 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 dark:bg-slate-800 p-5">
          <p className="text-sm text-gray-700 dark:text-slate-300">
            <strong>{curriculums.length}</strong> curriculum documents are currently available in Sanity for direct rendering.
            <span className="hidden sm:inline"> </span>
            <strong>{Math.max(courses.length - unmatched.length, 0)}</strong> of <strong>{courses.length}</strong> courses are currently mapped.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-primary mb-4">Available Curriculums</h2>
          {curriculums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {curriculums.map((curriculum) => {
                const course = curriculum.course
                const courseSlug = course?.slug?.current
                const heading = course?.title || curriculum.title
                const description = curriculum.summary || course?.summary

                return (
                  <article key={curriculum._id} className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-800 p-4 shadow-sm">
                    <p className="font-semibold text-darkText dark:text-slate-200">{heading}</p>
                  {description && <p className="text-sm text-gray-500 dark:text-slate-500 mt-1 line-clamp-2">{description}</p>}
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-gray-500 dark:text-slate-500">
                      {curriculum.level && <span className="rounded-full bg-gray-100 dark:bg-slate-800 dark:bg-slate-700 dark:text-slate-300 px-2 py-1">{curriculum.level}</span>}
                      {curriculum.duration && <span className="rounded-full bg-gray-100 dark:bg-slate-800 dark:bg-slate-700 dark:text-slate-300 px-2 py-1">{curriculum.duration}</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={courseSlug ? `/courses/${courseSlug}/curriculum` : '/curriculums'}
                      className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                    >
                      View Curriculum
                    </Link>
                    {courseSlug && (
                      <Link
                        href={`/courses/${courseSlug}`}
                          className="inline-flex items-center rounded-lg border border-gray-200 dark:border-slate-700 dark:border-slate-600 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 hover:border-gray-300 dark:border-slate-600 dark:hover:border-slate-500"
                      >
                        View Course
                      </Link>
                    )}
                  </div>
                </article>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-slate-500">No curriculum documents found in Sanity yet.</p>
          )}
        </section>

        {unmatched.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Courses Awaiting Curriculum Mapping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unmatched.map((course) => (
                  <article key={course._id} className="rounded-xl border border-dashed border-gray-200 dark:border-slate-700 dark:border-slate-600 bg-white dark:bg-slate-900 dark:bg-slate-800 p-4">
                    <p className="font-medium text-gray-800 dark:text-slate-200 dark:text-slate-200">{course.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Slug: {course.slug.current}</p>
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
