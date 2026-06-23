'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { useHomepage } from '@/contexts/HomepageContext'
import { headline } from './headlines'

interface SlotItem {
  id: string
  heading: string
  description: string
  cta: string
  href: string
  thumbUrl?: string
}

const GRADIENTS = [
  'from-violet-600 via-indigo-600 to-purple-700',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-orange-500 via-pink-500 to-rose-600',
  'from-blue-600 via-cyan-500 to-teal-500',
  'from-fuchsia-500 via-purple-600 to-violet-700',
  'from-rose-500 via-red-500 to-orange-600',
  'from-sky-500 via-indigo-500 to-blue-600',
  'from-green-500 via-emerald-500 to-teal-600',
]

const MENTORSHIP_ITEM: SlotItem = {
  id: 'mentorship',
  heading: 'Stop Going It Alone',
  description:
    'One conversation with the right mentor can save you six months of trial and error. Get paired with someone who has already solved the problems you are facing right now.',
  cta: 'Find Your Mentor →',
  href: '/mentorships',
}

const TOUR_INTERVAL = 20000

function Carousel({
  items,
  label,
  icon,
}: {
  items: SlotItem[]
  label: string
  icon: string
}) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    if (paused || items.length < 2) return
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1000
        if (next >= TOUR_INTERVAL) {
          setCurrent((i) => (i + 1) % items.length)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [paused, items.length])

  const goNext = useCallback(() => {
    setCurrent((i) => (i + 1) % items.length)
    setElapsed(0)
  }, [items.length])

  const goPrev = useCallback(() => {
    setCurrent((i) => (i - 1 + items.length) % items.length)
    setElapsed(0)
  }, [items.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const item = items[current]

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <span className="text-base">{icon}</span> {label}
      </h3>
      <div
        className="relative overflow-hidden rounded-2xl w-full h-[280px] sm:h-[240px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            GRADIENTS[current % GRADIENTS.length]
          }`}
        />
        <div className="absolute inset-0 bg-black/10" />

        {/* Prev arrow — always visible on mobile, hover on desktop */}
        {items.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all sm:opacity-0 sm:hover:opacity-100"
            aria-label="Previous item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className="relative z-[1] h-full flex items-center gap-3 sm:gap-5 px-4 sm:px-10">
          {/* Thumbnail */}
          {item.thumbUrl ? (
            <div className="shrink-0 w-10 h-14 sm:w-[72px] sm:h-[96px] md:w-[88px] md:h-[118px] rounded-lg sm:rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
              <Image
                src={item.thumbUrl}
                alt=""
                width={88}
                height={118}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="shrink-0 w-10 h-14 sm:w-[72px] sm:h-[96px] md:w-[88px] md:h-[118px] rounded-lg sm:rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-lg sm:text-3xl">
              {icon}
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-lg md:text-xl font-bold text-white leading-tight mb-1.5 line-clamp-2 sm:line-clamp-2">
              {item.heading}
            </h4>
            <p className="text-[11px] sm:text-sm text-white/70 leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-2">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-sm font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg sm:rounded-xl transition-all"
            >
              {item.cta}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Next arrow */}
        {items.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all sm:opacity-0 sm:hover:opacity-100"
            aria-label="Next item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Navigation dots */}
        {items.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i)
                  setElapsed(0)
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 sm:w-6 h-2.5 sm:h-2 bg-white'
                    : 'w-2.5 sm:w-2 h-2.5 sm:h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {items.length > 1 && (
        <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 mt-1.5 sm:mt-1">
          Next in {Math.max(0, Math.ceil((TOUR_INTERVAL - elapsed) / 1000))}s
        </p>
      )}
    </div>
  )
}

function courseCopy(title: string): string {
  return `Stop watching tutorials. Start building. ${title} is hands-on, project-based, and built by people who've hired devs like you. You'll finish with a portfolio — not just a certificate.`
}

function bookCopy(title: string): string {
  return `You don't need more information. You need the right information. ${title} distills hard-won insights into pages you'll tab, highlight, and reference for years.`
}

function serviceCopy(title: string): string {
  return `You have a vision. We have the blueprint. ${title} without the agency markup, the endless meetings, or the jargon — just strategy that works and execution that delivers.`
}

function imprintCopy(title: string): string {
  return `Read this, and you'll never see the game the same way again. ${title} packs years of expertise into a document you can't afford to skim.`
}

export function DecidingView() {
  const { setShowOnboarding, setIsDeciding } = useHomepage()
  const [learnItems, setLearnItems] = useState<SlotItem[]>([MENTORSHIP_ITEM])
  const [serviceItems, setServiceItems] = useState<SlotItem[]>([])
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    async function load() {
      try {
        const [courses, books, services, imprints] = await Promise.all([
          client.fetch(
            `*[_type == "course" && featured == true] | order(_createdAt desc)[0...6] {
              _id, title, "slug": slug.current,
              "thumbUrl": mainImage.asset->url
            }`
          ),
          client.fetch(
            `*[_type == "book"] | order(_createdAt desc) {
              _id, title, "slug": slug.current,
              "thumbUrl": coverImage.asset->url
            }`
          ),
          client.fetch(
            `*[_type == "serviceCategory"] | order(featured desc, title asc) {
              _id, title, "slug": slug.current
            }`
          ),
          client.fetch(
            `*[_type == "imprint"] | order(_createdAt desc) {
              _id, title, "slug": slug.current,
              "thumbUrl": coverImage.asset->url
            }`
          ),
        ])

        const learn: SlotItem[] = [MENTORSHIP_ITEM]

        if (Array.isArray(courses)) {
          for (const c of courses) {
            learn.push({
              id: `course-${c._id}`,
              heading: headline(c.title || 'Featured Course', 'course'),
              description: courseCopy(c.title || 'this course'),
              cta: 'Enroll Now →',
              href: `/courses/${c.slug}`,
              thumbUrl: c.thumbUrl || undefined,
            })
          }
        }

        if (Array.isArray(books)) {
          for (const b of books) {
            learn.push({
              id: `book-${b._id}`,
              heading: headline(b.title || 'Featured Book', 'book'),
              description: bookCopy(b.title || 'this book'),
              cta: 'Buy Now →',
              href: `/store/${b.slug}`,
              thumbUrl: b.thumbUrl || undefined,
            })
          }
        }

        setLearnItems(learn)

        const svc: SlotItem[] = []

        if (Array.isArray(services)) {
          for (const s of services) {
            svc.push({
              id: `service-${s._id}`,
              heading: headline(s.title || 'Featured Service', 'service'),
              description: serviceCopy(s.title || 'this service'),
              cta: 'Explore →',
              href: `/services/${s.slug}`,
            })
          }
        }

        if (Array.isArray(imprints)) {
          for (const p of imprints) {
            svc.push({
              id: `imprint-${p._id}`,
              heading: headline(p.title || 'Featured Publication', 'imprint'),
              description: imprintCopy(p.title || 'this publication'),
              cta: 'Read Now →',
              href: `/store/${p.slug}`,
              thumbUrl: p.thumbUrl || undefined,
            })
          }
        }

        setServiceItems(svc)
      } catch {
        /* keep defaults */
      }
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            While You&apos;re Deciding...
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Loading our offerings...
          </p>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
          While You&apos;re Deciding...
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Two quick tours of what we offer.
        </p>
      </div>

      <Carousel items={learnItems} label="Learn & Read" icon="📚" />
      <Carousel items={serviceItems} label="Services & Publications" icon="💼" />

      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={() => setIsDeciding(false)}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          Show my dashboard
        </button>
        <button
          onClick={() => {
            setIsDeciding(false)
            setShowOnboarding(true)
          }}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
        >
          Pick a template
        </button>
      </div>
    </div>
  )
}
