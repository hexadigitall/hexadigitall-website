'use client'

import { useState } from 'react'
import { useHomepage } from '@/contexts/HomepageContext'
import { PersonalHomepage } from './PersonalHomepage'

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const session = localStorage.getItem('admin_session')
    if (!session) return false
    const data = JSON.parse(session)
    return ['admin', 'teacher', 'student'].includes(data.role)
  } catch {
    return false
  }
}

export function AuthDashboardGate({ children }: { children: React.ReactNode }) {
  const [authed] = useState(isAuthenticated)

  if (!authed) return <>{children}</>

  return <AuthedGate>{children}</AuthedGate>
}

function AuthedGate({ children }: { children: React.ReactNode }) {
  const { showClassicHomepage, toggleClassicHomepage } = useHomepage()

  if (showClassicHomepage) {
    return (
      <>
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Browsing the storefront
            </p>
            <button
              onClick={toggleClassicHomepage}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Back to Dashboard →
            </button>
          </div>
        </div>
        {children}
      </>
    )
  }

  return <PersonalHomepage />
}
