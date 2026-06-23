'use client'

import { useHomepage } from '@/contexts/HomepageContext'
import { OnboardingFlow } from './OnboardingFlow'
import { WidgetGrid } from './WidgetGrid'
import { EditToolbar } from './EditToolbar'
import { HeroBanner } from './HeroBanner'
import { DecidingView } from './DecidingView'

export function PersonalHomepage() {
  const { isLoading, showOnboarding, isDeciding, template, config } = useHomepage()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <HeroBanner />

      {showOnboarding || !config ? (
        <OnboardingFlow />
      ) : isDeciding ? (
        <DecidingView />
      ) : (
        <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
          {template
            ? TemplatesLabel[template] || 'My Homepage'
            : 'My Homepage'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          Your personalized dashboard. Edit to add or remove widgets.
        </p>
      </div>

      <EditToolbar />

      <div className="mt-4 sm:mt-6">
        <WidgetGrid />
      </div>
        </>
      )}
    </div>
  )
}

const TemplatesLabel: Record<string, string> = {
  learner: "I'm Here to Learn",
  builder: 'I Want to Build Something',
  grow: 'Grow My Business',
  planner: 'Planning a Business',
  reader: "I'm Here to Read",
  mentee: 'I Need Guidance',
  designer: 'Design & Branding',
  shopper: 'Shop & Download',
  student: 'Track My Journey',
  educator: "I'm an Educator",
  explorer: 'Just Exploring',
  custom: 'Mix & Match',
}
