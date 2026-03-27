'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StudentOAuthSuccessPage() {
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const completeOauthLogin = async () => {
      try {
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
        {!error ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Completing Sign In...</h1>
            <p className="text-gray-600">Please wait while we prepare your student dashboard.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign In Could Not Be Completed</h1>
            <p className="text-sm text-red-700 mb-6">{error}</p>
            <Link
              href="/student/login"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Back to Student Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
