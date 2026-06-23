'use client'

import { useHomepage } from '@/contexts/HomepageContext'
import { WidgetRenderer } from './widgets'

export function WidgetGrid() {
  const { widgets, isEditing, removeWidget, moveWidget } = useHomepage()

  if (widgets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No widgets yet</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
          Add widgets to build your personalized homepage.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {widgets.map((widget) => (
        <div
          key={widget.widgetId}
          className={`relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
            isEditing ? 'ring-2 ring-purple-300 dark:ring-purple-700' : ''
          }`}
        >
          {isEditing && (
            <div className="absolute top-3 right-3 flex gap-1.5 z-10">
              <button
                onClick={() => moveWidget(widget.widgetId, 'up')}
                className="p-2 sm:p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                title="Move up"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveWidget(widget.widgetId, 'down')}
                className="p-2 sm:p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                title="Move down"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => removeWidget(widget.widgetId)}
                className="p-2 sm:p-1.5 bg-red-50 dark:bg-red-950/30 rounded-lg shadow-sm border border-red-200 dark:border-red-800 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                title="Remove widget"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <WidgetRenderer widget={widget} />
        </div>
      ))}
    </div>
  )
}
