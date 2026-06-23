'use client'

import { useState } from 'react'
import { useConsent } from '@/lib/consent'

export function CookieConsentBanner() {
  const { consent, acceptAll, acceptEssential, acceptCustom } = useConsent()
  const [showCustomize, setShowCustomize] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [personalization, setPersonalization] = useState(false)

  if (typeof window === 'undefined') return null
  if (consent) return null

  if (showCustomize) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="mx-auto max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
            Customize Consent
          </h3>
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl opacity-60 cursor-not-allowed">
              <input type="checkbox" checked={true} disabled className="mt-1 h-4 w-4" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Essential</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Auth, homepage config, basic session. Always on.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Analytics</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Page views, usage patterns to improve the site.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={personalization}
                onChange={(e) => setPersonalization(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Personalization</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Activity tracking, resume feature, recently viewed.</p>
              </div>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              onClick={() => setShowCustomize(false)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => acceptCustom(analytics, personalization)}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              This site personalizes your experience
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              We use cookies and local storage to remember your preferences and improve our services.
              <a href="/privacy-policy" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowCustomize(true)}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Customize
            </button>
            <button
              onClick={acceptEssential}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
