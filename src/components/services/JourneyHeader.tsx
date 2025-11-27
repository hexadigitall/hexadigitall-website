'use client'

import React from 'react'
import Link from 'next/link'

type JourneyStage = 'idea' | 'build' | 'grow'

interface JourneyHeaderProps {
  currentStage: JourneyStage
  hideNavigation?: boolean
}

/**
 * JourneyHeader
 * 
 * Displays the Startup Journey breadcrumb:
 * Idea (Business Planning) → Build (Web/App Development) → Grow (Marketing/Growth)
 * 
 * Allows users to navigate between stages and see where they are in the journey.
 */
export default function JourneyHeader({ currentStage, hideNavigation = false }: JourneyHeaderProps) {
  const stages: { id: JourneyStage; label: string; description: string; href: string; icon: string }[] = [
    {
      id: 'idea',
      label: 'Idea',
      description: 'Business Planning & Strategy',
      href: '/services/business-plan-and-logo-design',
      icon: '💡'
    },
    {
      id: 'build',
      label: 'Build',
      description: 'Web & App Development',
      href: '/services/web-and-mobile-software-development',
      icon: '🏗️'
    },
    {
      id: 'grow',
      label: 'Grow',
      description: 'Marketing & Growth Strategy',
      href: '/services',
      icon: '📈'
    }
  ]

  const currentIndex = stages.findIndex(s => s.id === currentStage)

  return (
    <div className="sticky top-[80px] z-30 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        {/* Journey visualization */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Stage button */}
              <Link
                href={hideNavigation ? '#' : stage.href}
                className={`relative group flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-white shadow-md border-2 border-primary'
                    : 'hover:bg-white/50 border-2 border-transparent'
                } ${hideNavigation ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={hideNavigation ? (e) => e.preventDefault() : undefined}
              >
                {/* Icon */}
                <span className="text-2xl md:text-3xl">{stage.icon}</span>

                {/* Label */}
                <span
                  className={`text-xs md:text-sm font-bold transition-colors ${
                    currentIndex === index ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {stage.label}
                </span>

                {/* Current indicator dot */}
                {currentIndex === index && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-[-12px] w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {stage.description}
                </div>
              </Link>

              {/* Connector arrow (except after last stage) */}
              {index < stages.length - 1 && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-0.5 transition-all duration-300 ${
                      currentIndex > index ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                  <span
                    className={`text-lg font-bold transition-colors ${
                      currentIndex > index ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    ↔
                  </span>
                  <div
                    className={`w-8 h-0.5 transition-all duration-300 ${
                      currentIndex > index ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress description */}
        {!hideNavigation && (
          <p className="text-center text-xs text-gray-600 mt-4">
            {currentIndex === 0 && '✨ Start here: Plan your business with a solid strategy'}
            {currentIndex === 1 && '🚀 Build your digital presence with a professional website'}
            {currentIndex === 2 && '📣 Scale your business with strategic marketing'}
          </p>
        )}
      </div>
    </div>
  )
}
