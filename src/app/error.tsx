'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-slate-100 mb-2">
          Page Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This page encountered an error. Please try refreshing.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 dark:text-slate-100 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
