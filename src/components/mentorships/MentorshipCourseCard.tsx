"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from '@/contexts/CurrencyContext'
import { resolveMentorshipRates } from '@/lib/mentorship-pricing'

export interface MentorshipCourse {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: string | null
  summary?: string
  description?: string
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
}

export default function MentorshipCourseCard({ course }: { course: MentorshipCourse }) {
  const { convertPrice, currentCurrency } = useCurrency()
  const safeImage = course.mainImage || '/digitall_partner.png'
  const safeSlug = course.slug?.current || ''
  const safeTitle = course.title || 'Untitled Course'
  const safeDescription = course.summary || course.description || 'Mentorship support for textbook learners.'

  const mentorshipRates = resolveMentorshipRates(course)
  const isLiveCourse = course.courseType === 'live' && mentorshipRates.hourlyRateUSD && mentorshipRates.hourlyRateNGN

  const getMonthlyPrice = () => {
    if (!isLiveCourse) return null
    const monthlyUsd = mentorshipRates.hourlyRateUSD! * 4
    const monthlyNgn = mentorshipRates.hourlyRateNGN! * 4
    const currency = currentCurrency.code
    const monthlyPrice = currency === 'NGN' ? monthlyNgn : convertPrice(monthlyUsd, currency)
    return {
      currency,
      amount: monthlyPrice
    }
  }

  const monthlyPrice = getMonthlyPrice()

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/mentorships/courses/${safeSlug}`} className="relative block aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Image
          src={safeImage}
          alt={`${safeTitle} mentorship cover`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {course.level || 'Mentorship'}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/mentorships/courses/${safeSlug}`} className="block">
          <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-teal-700">
            {safeTitle}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{safeDescription}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
          {course.duration ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              {course.duration}
            </span>
          ) : null}
          {course.instructor ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              Mentor: {course.instructor}
            </span>
          ) : null}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {monthlyPrice ? (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                Monthly Mentorship
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: monthlyPrice.currency,
                  maximumFractionDigits: 0
                }).format(monthlyPrice.amount)}
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </div>
              <div className="text-xs text-slate-500">Personalized schedule and feedback loop.</div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Mentorship Pricing
              </div>
              <div className="text-base font-semibold text-slate-800">Contact for availability</div>
              <div className="text-xs text-slate-500">We will confirm the best plan for this course.</div>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/mentorships/courses/${safeSlug}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            View Mentorship
          </Link>
          <Link
            href={`/courses/${safeSlug}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
          >
            Course Details
          </Link>
        </div>
      </div>
    </article>
  )
}
