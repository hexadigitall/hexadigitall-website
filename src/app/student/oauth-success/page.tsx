'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StudentOAuthSuccessPage() {
  const [error, setError] = useState('')
  const [intent, setIntent] = useState<'signup' | 'signin'>('signin')
  const [signupCompleted, setSignupCompleted] = useState(false)

  useEffect(() => {
    let mounted = true

    const completeOauthLogin = async () => {
      try {
        document.cookie = 'student_oauth_intent=; Path=/; Max-Age=0; SameSite=Lax'
        const params = new URLSearchParams(window.location.search)
        const intentParam = params.get('intent')
        const errorParam = params.get('error')

        if (intentParam === 'signup') {
          setIntent('signup')
        }

        if (errorParam === 'account-exists') {
          if (mounted) {
            setError('An account with this email already exists. Please sign in instead, or sign up with a different Google or GitHub account.')
          }
          return
        }

        if (errorParam === 'not-student') {
          if (mounted) {
            setError('This account exists but is not a student account. Please use the correct login page, or use a different account.')
          }
          return
        }

        if (errorParam === 'no-account') {
          if (mounted) {
            setError('No student account exists for this email. Please sign up first.')
          }
          return
        }

        // Strict intent separation: signup creates account only, never logs in.
        if (intentParam === 'signup') {
          if (mounted) setSignupCompleted(true)
          return
        }

        const res = await fetch('/api/auth/oauth/session-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          if (mounted) setError(data.message || 'Unable to complete OAuth sign in.')
          return
        }

        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_session', JSON.stringify({
          username: data.username,
          name: data.name,
          role: data.role,
          userId: data.userId,
        }))

        document.cookie = `admin_token=${encodeURIComponent(data.token)}; Path=/; Max-Age=86400; SameSite=Lax`
        window.location.assign('/student/dashboard')
      } catch {
        if (mounted) setError('Unable to complete OAuth sign in.')
      }
    }

    void completeOauthLogin()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        {!error && signupCompleted ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign Up Successful</h1>
            <p className="text-gray-600 mb-6">
              Your student account has been created successfully. Continue to sign in when you are ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/student/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/student/signup"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Use Different Account
              </Link>
            </div>
          </>
        ) : !error ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {intent === 'signup' ? 'Completing Sign Up...' : 'Completing Sign In...'}
            </h1>
            <p className="text-gray-600">
              {intent === 'signup'
                ? 'Please wait while we create your student account.'
                : 'Please wait while we prepare your student dashboard.'}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {intent === 'signup' ? 'Sign Up Could Not Be Completed' : 'Sign In Could Not Be Completed'}
            </h1>
            <p className="text-sm text-red-700 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/student/login"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
              >
                Go to Student Login
              </Link>
              <Link
                href="/student/signup"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Use Different Account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
