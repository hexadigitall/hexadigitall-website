"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Variant = 'guide' | 'playful'

const ACTIVE_VARIANT: Variant = 'guide'

const ICONS = {
  idea: (
    <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 7.5C6 9 6 11.5 7.2 13.4 8.4 15.3 10.8 16 12 16s3.6-.7 4.8-2.6C18 11.5 18 9 16.5 7.5 15 6 13 5.5 12 7c-1-1.5-3-1-4.5.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  build: (
    <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7l5-4 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11h10v10H7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  growth: (
    <svg className="w-10 h-10 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13l4-4 4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  learn: (
    <svg className="w-10 h-10 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 6.5A2.5 2.5 0 016.5 9H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const COPY_VARIANTS: Record<Variant, Record<string, { title: string; description: string; cta: string }>> = {
  guide: {
    'have-an-idea': {
      title: 'Have an idea?',
      description: 'We’ll turn your idea into a clear plan and brand you can be proud of.',
      cta: 'Let’s plan'
    },
    'ready-to-build': {
      title: 'Ready to build?',
      description: 'Ship your website or mobile app with a steady, experienced team.',
      cta: 'Start building'
    },
    'need-customers': {
      title: 'Need customers?',
      description: 'Growth strategies, ads and social campaigns that actually bring customers.',
      cta: 'Grow now'
    },
    'want-to-learn': {
      title: 'Want to learn?',
      description: 'Practical courses to help you master marketing, product and growth.',
      cta: 'Browse courses'
    }
  },
  playful: {
    'have-an-idea': {
      title: 'Got a spark?',
      description: 'We’ll sketch it, shape it, and give it a voice — fast.',
      cta: 'Spark it'
    },
    'ready-to-build': {
      title: 'Let’s build!',
      description: 'From prototypes to product — we make it real and reliable.',
      cta: 'Build it'
    },
    'need-customers': {
      title: 'Get noticed',
      description: 'Campaigns that turn searchers into buyers.',
      cta: 'Boost reach'
    },
    'want-to-learn': {
      title: 'Level up',
      description: 'Courses and hands-on guides to sharpen your skills.',
      cta: 'Learn now'
    }
  }
}

const SITES = [
  { id: 'have-an-idea', href: '/services/business-plan-and-logo-design?funnel=have-an-idea', icon: ICONS.idea, key: 'have-an-idea' },
  { id: 'ready-to-build', href: '/services/web-and-mobile-software-development?funnel=ready-to-build', icon: ICONS.build, key: 'ready-to-build' },
  { id: 'need-customers', href: '/services/social-media-advertising-and-marketing?funnel=need-customers', icon: ICONS.growth, key: 'need-customers' },
  { id: 'want-to-learn', href: '/courses?funnel=want-to-learn', icon: ICONS.learn, key: 'want-to-learn' }
]

export default function StartupFunnel({ className, variant: propVariant }: { className?: string; variant?: Variant }) {
  const [variant, setVariant] = useState<Variant>(propVariant || ACTIVE_VARIANT)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const param = params.get('funnelVariant')
      if (param === 'playful' || param === 'guide') {
        setVariant(param)
        // persist in cookie for 7 days
        document.cookie = `funnel_variant=${param}; max-age=${60 * 60 * 24 * 7}; path=/`;
        return
      }

      // fallback to cookie
      const match = document.cookie.match(/(?:^|; )funnel_variant=([^;]+)/)
      if (match && (match[1] === 'playful' || match[1] === 'guide')) {
        setVariant(match[1] as Variant)
      }
    } catch {
      // ignore
    }
  }, [propVariant])

  const copy = COPY_VARIANTS[variant]

  return (
    <section className={className} aria-labelledby="startup-funnel-heading" data-variant={variant}>
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 id="startup-funnel-heading" className="text-3xl font-bold">Choose your next step</h2>
          <p className="text-gray-600 mt-2">We’ll guide you to the right service for your stage — a friendly, experienced tour.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {SITES.map(site => (
            <Link
              key={site.id}
              href={site.href}
              data-funnel={site.id}
              className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              aria-label={copy[site.key].title}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">{site.icon}</div>
                    <h3 className="text-lg font-semibold">{copy[site.key].title}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6 flex-1">{copy[site.key].description}</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">{copy[site.key].cta}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
