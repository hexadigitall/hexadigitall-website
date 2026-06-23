'use client'

import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'

export function CustomBuildWidget({ widget }: { widget: WidgetItem }) {
  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Custom Build'}
      </h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">
        Configure your platform, features, and services with live pricing.
      </p>
      <Link
        href="/services/custom-build"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Start Building
      </Link>
    </div>
  )
}
