'use client'

import { useState } from 'react'
import { useHomepage } from '@/contexts/HomepageContext'
import { TEMPLATES } from '@/data/homepageTemplates'

const ROLE_RECOMMENDATIONS: Record<string, string> = {
  student: 'student',
  teacher: 'educator',
  admin: 'educator',
}

function getRecommended(userRole: string | null): string | undefined {
  return userRole ? ROLE_RECOMMENDATIONS[userRole] : undefined
}

export function OnboardingFlow() {
  const { setTemplate, setIsDeciding, isLoading, userRole } = useHomepage()
  const [selected, setSelected] = useState<string | null>(
    () => getRecommended(userRole) ?? null
  )
  const recommended = getRecommended(userRole)

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 sm:mb-3">
            What brings you here today?
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
            Pick a starting point and we&apos;ll set up your homepage. You can always change it later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {TEMPLATES.map((t) => {
            const isSelected = selected === t.id
            const isCustom = t.id === 'custom'
            const isRecommended = t.id === recommended
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 relative ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-md'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm'
                } ${isCustom ? 'opacity-60' : ''}`}
              >
                {isRecommended && (
                  <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[9px] sm:text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/50 px-1.5 sm:px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
                <span className="text-xl sm:text-2xl block mb-1.5 sm:mb-2">{t.icon}</span>
                <h3 className={`text-xs sm:text-sm font-bold mb-0.5 ${
                  isSelected
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-gray-900 dark:text-slate-100'
                }`}>
                  {t.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  {t.description}
                </p>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setTemplate(recommended || 'explorer')
              setIsDeciding(true)
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
          >
            I&apos;ll decide later
          </button>
          <button
            onClick={() => {
              if (selected) setTemplate(selected)
            }}
            disabled={!selected}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              selected
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            Let&apos;s Go →
          </button>
        </div>
      </div>
    </div>
  )
}
