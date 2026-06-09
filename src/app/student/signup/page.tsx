'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpenIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { signIn, getProviders } from 'next-auth/react'

export default function StudentSignupPage() {
  const router = useRouter()
  const [source, setSource] = useState('')
  const [safeNext, setSafeNext] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sourceParam = params.get('source') || ''
    const nextParam = params.get('next') || ''
    setSource(sourceParam)
    setSafeNext(nextParam.startsWith('/') ? nextParam : '')
  }, [])

  const loginParams = new URLSearchParams({ registered: '1' })
  if (source) loginParams.set('source', source)
  if (safeNext) loginParams.set('next', safeNext)
  const loginHref = `/student/login?${loginParams.toString()}`
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [oauthProviders, setOauthProviders] = useState<{ google: boolean; github: boolean }>({
    google: false,
    github: false,
  })

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders()
      setOauthProviders({
        google: Boolean(providers?.google),
        github: Boolean(providers?.github),
      })
    }

    void loadProviders()
  }, [])

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setError('')
    localStorage.setItem('student_oauth_intent', 'signup')
    document.cookie = 'student_oauth_intent=signup; Path=/; Max-Age=600; SameSite=Lax'
    await signIn(provider, { callbackUrl: '/student/oauth-success?intent=signup' })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, role: 'student' }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const loginUrl = new URL(loginHref, window.location.origin)
        loginUrl.searchParams.set('registered', '1')
        router.push(`${loginUrl.pathname}?${loginUrl.searchParams.toString()}`)
      } else {
        setError(data.message || 'Registration failed. Please try again.')
      }
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <BookOpenIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create Student Account</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Start your learning journey today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Choose a username"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">3–30 characters, letters, numbers, and underscores only.</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-slate-300"
                >
                  {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-700 focus:ring-4 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">or sign up with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={!oauthProviders.google}
                onClick={() => void handleOAuthSignup('google')}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 dark:text-slate-200 font-medium rounded-lg hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-slate-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue with Google
              </button>
              <button
                type="button"
                disabled={!oauthProviders.github}
                onClick={() => void handleOAuthSignup('github')}
                className="w-full py-3 border border-gray-300 dark:border-gray-600 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 dark:text-slate-200 font-medium rounded-lg hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-slate-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue with GitHub
              </button>
            </div>

            {(!oauthProviders.google || !oauthProviders.github) && (
              <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg px-3 py-2">
                One or more social providers are temporarily unavailable. If this persists, check Auth.js and OAuth provider credentials in deployment settings.
              </p>
            )}
          </>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href={loginHref} className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} Hexadigitall. All rights reserved.
        </p>
      </div>
    </div>
  )
}
