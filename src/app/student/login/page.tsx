'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { BookOpenIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { signIn } from 'next-auth/react'

const GOOGLE_OAUTH_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true'
const GITHUB_OAUTH_ENABLED = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === 'true'

export default function StudentLoginPage() {
  const [source, setSource] = useState('')
  const [safeNext, setSafeNext] = useState('/student/dashboard')
  const [justRegistered, setJustRegistered] = useState(false)
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState<'none' | 'success' | 'error'>('none')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get('next') || ''
    const sourceParam = params.get('source') || ''
    setSource(sourceParam)
    setSafeNext(nextParam.startsWith('/') ? nextParam : '/student/dashboard')
    setJustRegistered(params.get('registered') === '1')
    const verifiedParam = params.get('verified')
    if (verifiedParam === '1') setEmailVerifiedStatus('success')
    if (verifiedParam === '0') setEmailVerifiedStatus('error')
  }, [])

  const signupParams = new URLSearchParams()
  if (source) signupParams.set('source', source)
  if (safeNext.startsWith('/')) signupParams.set('next', safeNext)
  const signupHref = signupParams.toString() ? `/student/signup?${signupParams.toString()}` : '/student/signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError('')
    await signIn(provider, { callbackUrl: '/student/oauth-success' })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, requiredRole: 'student' }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Store session
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_session', JSON.stringify({
          username: data.username,
          role: data.role,
          userId: data.userId,
        }))
        // Cookie is also set by the server response. Keep client set as a fallback.
        document.cookie = `admin_token=${encodeURIComponent(data.token)}; Path=/; Max-Age=86400; SameSite=Lax`
        window.location.assign(safeNext)
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Student Login</h1>
            <p className="text-sm text-gray-600 mt-1">Access your learning dashboard</p>
          </div>

          {justRegistered && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Account created. Please verify your email before signing in.</p>
            </div>
          )}

          {emailVerifiedStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Email verified successfully. You can now sign in.</p>
            </div>
          )}

          {emailVerifiedStatus === 'error' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700">Verification link is invalid or expired. Please request support to resend verification.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {(GOOGLE_OAUTH_ENABLED || GITHUB_OAUTH_ENABLED) && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">or continue with</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-3">
                {GOOGLE_OAUTH_ENABLED && (
                  <button
                    type="button"
                    onClick={() => void handleOAuth('google')}
                    className="w-full py-3 border border-gray-300 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue with Google
                  </button>
                )}
                {GITHUB_OAUTH_ENABLED && (
                  <button
                    type="button"
                    onClick={() => void handleOAuth('github')}
                    className="w-full py-3 border border-gray-300 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue with GitHub
                  </button>
                )}
              </div>
            </>
          )}

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href={signupHref} className="text-purple-600 hover:text-purple-700 font-medium">
                Sign up
              </Link>
            </p>
            <Link
              href="/courses"
              className="block text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/teacher/login"
              className="block text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Teacher? Sign in here
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Hexadigitall. All rights reserved.
        </p>
      </div>
    </div>
  )
}
