"use client"

import React from 'react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Log to your error reporting service here
    // For example: Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.handleReset} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  reset: () => void
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  React.useEffect(() => {
    // Log error to analytics/monitoring service
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div 
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
      role="alert"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
            />
          </svg>
        </div>
        
        <h1 id="error-title" className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        
        <p id="error-description" className="text-gray-600 mb-6">
          We encountered an unexpected error. Our team has been notified and is working to fix this issue.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-mono text-red-800 break-words">
                {error.message}
              </p>
              {error.stack && (
                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-32">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Try again"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            Go Home
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link
              href="/contact"
              className="text-primary hover:text-primary/80 underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook version for use in functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)
  
  const resetError = React.useCallback(() => {
    setError(null)
  }, [])
  
  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])
  
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
  
  return { captureError, resetError }
}

export default ErrorBoundary
