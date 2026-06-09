import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { getWhatsAppLink } from '@/lib/whatsapp'

interface CourseInfo {
  _id: string
  title: string
  instructor?: string
  duration?: string
  level?: string
  mainImage?: { asset?: { url?: string } }
}

export default async function MentorshipEnrollmentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ subscription_id?: string; course_id?: string; reference?: string }>
}) {
  const { subscription_id, course_id } = await searchParams

  let course: CourseInfo | null = null

  if (course_id) {
    try {
      course = await client.fetch(
        groq`*[_type == "course" && _id == $courseId][0]{
          _id,
          title,
          instructor,
          duration,
          level,
          mainImage{asset->{url}}
        }`,
        { courseId: course_id }
      )
    } catch (error) {
      console.error('Mentorship success course fetch failed:', error)
      course = null
    }
  }

  const courseTitle = course?.title || 'your mentorship course'
  const whatsappMessage = `Hello Hexadigitall! I just completed mentorship enrollment for ${courseTitle}. Please add me to Google Classroom and share the next steps. Subscription ID: ${subscription_id || 'N/A'}.`

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-amber-200 dark:border-amber-800 bg-white/90 dark:bg-slate-900/90 p-8 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <svg className="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Mentorship Enrollment Confirmed</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your mentorship plan is active. Let&apos;s get you into Google Classroom and assign your mentor.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Next steps</h2>
                <div className="mt-4 space-y-4">
                  {[
                    'Click the WhatsApp button to notify the admin of your payment.',
                    'We will create or confirm your Google Classroom account.',
                    'Your mentor will review your Week 1 submissions and GitHub setup.',
                    'Expect a welcome message within 24 hours (business days).'
                  ].map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/25 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">WhatsApp handoff</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Our admin team uses WhatsApp to confirm payment, set up Google Classroom access, and match you with a mentor.
                </p>
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Message the mentorship admin
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mentorship summary</h3>
              <div className="mt-4 space-y-4">
                <div className="relative h-40 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                  <Image
                    src={course?.mainImage?.asset?.url || '/digitall_partner.png'}
                    alt={courseTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Course</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{courseTitle}</p>
                </div>
                {course?.instructor ? (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Lead mentor</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{course.instructor}</p>
                  </div>
                ) : null}
                {course?.duration ? (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{course.duration}</p>
                  </div>
                ) : null}
                {course?.level ? (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Level</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{course.level}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/mentorships/courses"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                >
                  Browse other mentorships
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  View full courses
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
            Need help quickly? Email support@hexadigitall.com with your course name and subscription ID.
          </div>
        </div>
      </div>
    </main>
  )
}
