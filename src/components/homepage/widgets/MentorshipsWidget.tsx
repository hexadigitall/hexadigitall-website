'use client'

import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'

export function MentorshipsWidget({ widget }: { widget: WidgetItem }) {
  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Mentorships'}
      </h3>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">
        Get one-on-one guidance from experienced mentors to accelerate your learning and career growth.
      </p>
      <div className="space-y-2 mb-4">
        <Link
          href="/mentorships"
          className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
        >
          <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            Browse Mentorship Programs
          </p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Find the right mentor for your goals</p>
        </Link>
        <Link
          href="/mentorships/courses"
          className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
        >
          <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            Mentorship-enabled Courses
          </p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Courses with built-in mentor support</p>
        </Link>
      </div>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
      >
        Talk to Us
      </Link>
    </div>
  )
}
