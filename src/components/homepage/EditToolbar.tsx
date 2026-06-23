'use client'

import { useState } from 'react'
import { useHomepage } from '@/contexts/HomepageContext'
import { TEMPLATES } from '@/data/homepageTemplates'

const WIDGET_OPTIONS = [
  { type: 'tracked-courses', label: 'Tracked Courses' },
  { type: 'services', label: 'Services' },
  { type: 'mentorships', label: 'Mentorships' },
  { type: 'textbooks', label: 'Textbooks' },
  { type: 'custom-build', label: 'Custom Build' },
  { type: 'payments', label: 'Payments' },
  { type: 'enrollments', label: 'Enrollments' },
  { type: 'recent-activity', label: 'Recent Activity' },
  { type: 'quick-actions', label: 'Quick Actions' },
  { type: 'labs', label: 'Labs' },
  { type: 'portfolio', label: 'Portfolio' },
  { type: 'blog', label: 'Blog' },
  { type: 'plans-proposals', label: 'Plans & Proposals' },
]

export function EditToolbar() {
  const { isEditing, setIsEditing, addWidget, clearConfig, resetToTemplate, template, save, isSaving, widgets } = useHomepage()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (!isEditing) {
    return (
      <div className="flex justify-center pt-6">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-800 dark:hover:text-slate-200 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Customize Homepage
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Floating action bar */}
      <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Editing
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {widgets.length} widget{widgets.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Widget
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        {/* Add widget dropdown */}
        {showAddMenu && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {WIDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => {
                    addWidget(opt.type)
                    setShowAddMenu(false)
                  }}
                  className="px-3 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-700 dark:hover:text-purple-300 border border-gray-200 dark:border-slate-700 transition-colors text-left"
                >
                  + {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1">Reset homepage?</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
            This will replace your current widgets with a template default.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500 self-center">Pick a template:</span>
            {TEMPLATES.filter((t) => t.id !== 'custom').map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  resetToTemplate(t.id)
                  setShowResetConfirm(false)
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                  template === t.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
