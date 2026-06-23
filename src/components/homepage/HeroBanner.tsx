'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useHomepage } from '@/contexts/HomepageContext'
import type { UserRole } from '@/contexts/HomepageContext'

interface HeroVariant {
  id: string
  roles: Exclude<UserRole, null>[]
  label: string
  heading: string
  description: string
  cta: string
  href: string
  image: string
}

const VARIANTS: HeroVariant[] = [
  {
    id: 'welcome',
    roles: ['anonymous', 'student', 'teacher', 'admin'],
    label: 'Welcome',
    heading: 'Your Hub for Growth',
    description:
      'Everything you need to learn, build, and grow — all in one place.',
    cta: 'Explore Services',
    href: '/services',
    image: '/assets/images/heroes/hero-tech-team.jpg',
  },
  {
    id: 'courses',
    roles: ['anonymous', 'student'],
    label: 'Online Courses',
    heading: 'Level Up Your Skills',
    description:
      'Industry-relevant courses designed to take you from beginner to pro.',
    cta: 'Browse Courses',
    href: '/courses',
    image: '/assets/images/heroes/hero-students-learning.jpg',
  },
  {
    id: 'mentorships',
    roles: ['anonymous', 'student', 'teacher'],
    label: 'Mentorship',
    heading: 'Learn from the Best',
    description:
      'Get one-on-one guidance from experienced industry mentors.',
    cta: 'Find a Mentor',
    href: '/mentorships',
    image: '/assets/images/heroes/hero-tech-team.jpg',
  },
  {
    id: 'store',
    roles: ['anonymous', 'student'],
    label: 'Bookstore',
    heading: 'Expand Your Library',
    description:
      'Browse textbooks, publications, and digital resources.',
    cta: 'Visit Store',
    href: '/store',
    image: '/assets/images/heroes/hero-students-learning.jpg',
  },
  {
    id: 'discounts',
    roles: ['anonymous', 'student', 'teacher', 'admin'],
    label: 'Special Offer',
    heading: 'Save on Premium Services',
    description:
      'Limited-time discounts on courses, mentorships, and more.',
    cta: 'View Deals',
    href: '/services',
    image: '/assets/images/heroes/hero-success-celebration.jpg',
  },
  {
    id: 'blog',
    roles: ['anonymous', 'student', 'teacher', 'admin'],
    label: 'From Our Blog',
    heading: 'Insights & Inspiration',
    description:
      'Tips, guides, and stories to help you on your journey.',
    cta: 'Read Articles',
    href: '/blog',
    image: '/assets/images/heroes/hero-success-celebration.jpg',
  },
]

export function HeroBanner() {
  const { userRole } = useHomepage()
  const eligible = userRole ? VARIANTS.filter((v) => v.roles.includes(userRole)) : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(0)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % eligible.length)
  }, [eligible.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + eligible.length) % eligible.length)
  }, [eligible.length])

  useEffect(() => {
    if (paused || eligible.length < 2) return
    const interval = setInterval(goNext, 6000)
    return () => clearInterval(interval)
  }, [paused, eligible.length, goNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  if (!userRole || eligible.length === 0) return null

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gray-900 h-[220px] sm:h-[240px] mb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {eligible.map((variant, i) => (
        <div
          key={variant.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
          aria-hidden={i !== currentIndex}
        >
          <Image
            src={variant.image}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />

          <div className="relative z-[1] h-full flex flex-col justify-center px-5 sm:px-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-purple-300 mb-1.5 sm:mb-2">
              {variant.label}
            </span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-1.5 sm:mb-2">
              {variant.heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3 sm:mb-4 line-clamp-2">
              {variant.description}
            </p>
            <Link
              href={variant.href}
              className="inline-flex items-center gap-1.5 self-start px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-lg shadow-purple-900/20"
            >
              {variant.cta}
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}

      {/* Arrow navigation — always visible on mobile, hover on desktop */}
      {eligible.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all sm:opacity-0 sm:hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all sm:opacity-0 sm:hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots — bigger touch targets on mobile */}
      {eligible.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:gap-1.5">
          {eligible.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-8 sm:w-5 h-2.5 sm:h-2 bg-white'
                  : 'w-2.5 sm:w-2 h-2.5 sm:h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
