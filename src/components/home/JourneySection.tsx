"use client"

import React from 'react'
import Link from 'next/link'
import { JOURNEY_STAGE_META } from '@/data/serviceGroups'

interface JourneyCard {
  id: keyof typeof JOURNEY_STAGE_META
  title: string
  description: string
  href: string
  icon: React.ReactNode
  cta: string
  color: string
}

const JOURNEY_CARDS: JourneyCard[] = [
  {
    id: 'idea',
    title: JOURNEY_STAGE_META.idea.label,
    description: "We'll turn your idea into a clear plan and brand you can be proud of.",
    href: JOURNEY_STAGE_META.idea.href,
    color: 'text-green-500',
    icon: (
      <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 7.5C6 9 6 11.5 7.2 13.4 8.4 15.3 10.8 16 12 16s3.6-.7 4.8-2.6C18 11.5 18 9 16.5 7.5 15 6 13 5.5 12 7c-1-1.5-3-1-4.5.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cta: 'Start Planning'
  },
  {
    id: 'build',
    title: JOURNEY_STAGE_META.build.label,
    description: 'Ship your website or mobile app with a steady, experienced team.',
    href: JOURNEY_STAGE_META.build.href,
    color: 'text-blue-500',
    icon: (
      <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7l5-4 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11h10v10H7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cta: 'Start Building'
  },
  {
    id: 'grow',
    title: JOURNEY_STAGE_META.grow.label,
    description: 'Growth strategies, ads and social campaigns that bring results.',
    href: JOURNEY_STAGE_META.grow.href,
    color: 'text-pink-500',
    icon: (
      <svg className="w-12 h-12 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 13l4-4 4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cta: 'Grow Now'
  },
  {
    id: 'learn',
    title: JOURNEY_STAGE_META.learn.label,
    description: 'Practical courses to help you master marketing, product and growth.',
    href: JOURNEY_STAGE_META.learn.href,
    color: 'text-purple-500',
    icon: (
      <svg className="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6.5A2.5 2.5 0 016.5 9H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    cta: 'Browse Courses'
  }
]

export default function JourneySection({ className = "" }: { className?: string }) {
  return (
    <section className={`py-16 md:py-24 ${className}`} aria-labelledby="journey-heading">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 
            id="journey-heading"
            className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4"
          >
            Choose Your Next Step
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;ll guide you to the right service for your stage — a friendly, experienced journey from idea to growth.
          </p>
        </div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {JOURNEY_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group card-enhanced rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              data-testid={`journey-card-${card.id}`}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6 flex-grow">
                {card.description}
              </p>

              {/* CTA Button */}
              <div className="flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full text-sm font-semibold group-hover:from-primary/90 group-hover:to-primary/70 transition-colors">
                  {card.cta}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Optional: Additional CTA for Custom Solutions */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Don&apos;t fit into these boxes?
          </p>
          <Link
            href="/services/custom-build"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Build a Custom Solution
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
