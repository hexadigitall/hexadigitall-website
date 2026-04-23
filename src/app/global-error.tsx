'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg p-8 text-center border border-transparent dark:border-slate-800">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Application Error
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Something went wrong. The application encountered an unexpected error.
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-100 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
            {error.digest && (
              <p className="mt-4 text-xs text-gray-400 dark:text-slate-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
