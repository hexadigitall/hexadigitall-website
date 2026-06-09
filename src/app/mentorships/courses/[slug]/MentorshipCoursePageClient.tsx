"use client"

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MentorshipEnrollmentModal from '@/components/mentorships/MentorshipEnrollmentModal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { resolveMentorshipRates } from '@/lib/mentorship-pricing'

interface MentorshipCourse {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
  description?: string
  mainImage?: string | null
  duration?: string
  level?: string
  instructor?: string
  courseType?: 'self-paced' | 'live' | string
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  mentorshipHourlyRateUSD?: number
  mentorshipHourlyRateNGN?: number
  nairaPrice?: number
  dollarPrice?: number
  price?: number
  includes?: string[]
  prerequisites?: string[]
  durationWeeks?: number
  hoursPerWeek?: number
  modules?: number
  lessons?: number
}

export default function MentorshipCoursePageClient({ course }: { course: MentorshipCourse }) {
  const { convertPrice, currentCurrency } = useCurrency()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mentorshipRates = useMemo(() => resolveMentorshipRates(course), [course])
  const isLiveMentorship = course.courseType === 'live' && mentorshipRates.hourlyRateUSD && mentorshipRates.hourlyRateNGN

  const monthlyPrice = useMemo(() => {
    if (!isLiveMentorship) return null
    const monthlyUsd = mentorshipRates.hourlyRateUSD! * 4
    const monthlyNgn = mentorshipRates.hourlyRateNGN! * 4
    const currency = currentCurrency.code
    const amount = currency === 'NGN' ? monthlyNgn : convertPrice(monthlyUsd, currency)
    return { currency, amount }
  }, [currentCurrency.code, convertPrice, isLiveMentorship, mentorshipRates.hourlyRateNGN, mentorshipRates.hourlyRateUSD])

  const handleWhatsApp = () => {
    const message = `Hello Hexadigitall! I would like to enroll in mentorship for the ${course.title} textbook. Please share the next steps for Google Classroom and mentor onboarding.`
    window.open(getWhatsAppLink(message), '_blank')
  }

  const description = course.description || course.summary || 'Mentorship support for your textbook learning journey.'

  const mentorshipIncludes = [
    'Weekly grading of quizzes, tests, and assignments',
    'Portfolio review checkpoints tied to weekly outputs',
    'Mentor feedback on GitHub structure and documentation',
    'Google Classroom access with rubrics and submission tracking'
  ]

  const combinedIncludes = Array.from(new Set([...(course.includes || []), ...mentorshipIncludes]))

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-amber-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-amber-400 blur-[140px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-72 w-72 rounded-full bg-teal-400 blur-[140px]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Mentorship-only enrollment
            </div>
            <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">{course.title}</h1>
            <p className="mt-4 text-lg text-white/80">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/80">
              {course.level ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                  Level: {course.level}
                </span>
              ) : null}
              {course.duration ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                  Duration: {course.duration}
                </span>
              ) : null}
              {course.instructor ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                  Lead Mentor: {course.instructor}
                </span>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={!isLiveMentorship}
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                  isLiveMentorship
                    ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                    : 'cursor-not-allowed bg-white/20 text-white/60'
                }`}
              >
                Start Mentorship Subscription
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Chat on WhatsApp
              </button>
              <Link
                href={`/courses/${course.slug.current}`}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                View Course Details
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white shadow-xl">
            <div className="relative h-52 overflow-hidden rounded-2xl border border-white/20">
              <Image
                src={course.mainImage || '/digitall_partner.png'}
                alt={`${course.title} mentorship cover`}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Monthly mentorship</div>
              {monthlyPrice ? (
                <div className="mt-2 text-3xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: monthlyPrice.currency,
                    maximumFractionDigits: 0
                  }).format(monthlyPrice.amount)}
                  <span className="text-base font-medium text-white/70">/mo</span>
                </div>
              ) : (
                <div className="mt-2 text-xl font-semibold text-white/80">Contact for pricing</div>
              )}
              <p className="mt-3 text-sm text-white/70">
                Mentorship subscriptions are billed monthly and include structured assessments, portfolio reviews, and
                direct mentor access.
              </p>

              <div className="mt-5 space-y-3 text-sm text-white/75">
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                  Google Classroom enrollment and grading rubrics
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                  Weekly GitHub portfolio checkpoints
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                  Mentor feedback within 48 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">What you receive each month</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Mentorship follows the official Hexadigitall textbook structure. We grade the same assessments used in our
            live cohorts and guide you through portfolio deliverables.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {combinedIncludes.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Mentorship setup flow</h3>
          <div className="mt-5 space-y-4">
            {[
              'Complete mentorship enrollment and payment.',
              'Receive WhatsApp confirmation and onboarding instructions.',
              'Get your Google Classroom invite within 24 hours.',
              'Submit weekly assessments and GitHub deliverables.'
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Built for portfolio outcomes</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              We track every assignment against a portfolio milestone so your GitHub grows into a job-ready proof of
              work. Your mentor reviews README clarity, project structure, and deployment readiness.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Need the textbook?</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              If you have not purchased the textbook yet, explore the full course details first and get the official
              materials from the Hexadigitall store.
            </p>
            <Link
              href={`/courses/${course.slug.current}`}
              className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              Explore the full course
            </Link>
          </div>
        </div>
      </section>

      {isLiveMentorship ? (
        <MentorshipEnrollmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          successPath="/mentorships/enrollment-success"
          course={{
            _id: course._id,
            title: course.title,
            slug: course.slug,
            mainImage: course.mainImage || null,
            description,
            duration: course.duration || 'Flexible schedule',
            level: course.level || 'All Levels',
            instructor: course.instructor || 'Hexadigitall Mentor',
            courseType: 'live',
            nairaPrice: course.nairaPrice,
            dollarPrice: course.dollarPrice,
            price: course.price,
            hourlyRateUSD: mentorshipRates.hourlyRateUSD,
            hourlyRateNGN: mentorshipRates.hourlyRateNGN,
            includes: combinedIncludes,
            curriculum: course.modules && course.lessons && course.duration
              ? { modules: course.modules, lessons: course.lessons, duration: course.duration }
              : undefined
          }}
        />
      ) : null}
    </main>
  )
}
