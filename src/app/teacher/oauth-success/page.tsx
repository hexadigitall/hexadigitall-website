'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

type Phase = 'loading' | 'pending' | 'approved' | 'error'

export default function TeacherOAuthSuccessPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [isSigninIntent, setIsSigninIntent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  useEffect(() => {
    let mounted = true

    const complete = async () => {
      try {
        document.cookie = 'teacher_oauth_intent=; Path=/; Max-Age=0; SameSite=Lax'
        const params = new URLSearchParams(window.location.search)
        const intent = params.get('intent')
        const status = params.get('status')
        const error = params.get('error')
        const isSignup = intent === 'signup'
        if (!isSignup) setIsSigninIntent(true)

        if (isSignup && status === 'pending') {
          setInfoMsg('Your application has already been submitted and is pending administrator approval. You will receive an email when your account is approved.')
          setPhase('pending')
          return
        }

        if (isSignup && error === 'teacher-exists') {
          setErrorMsg('A teacher account with this email already exists. Sign in instead or use a different Google or GitHub account.')
          setPhase('error')
          return
        }

        if (isSignup && error === 'account-exists') {
          setErrorMsg('An account with this email already exists. Sign in instead or use a different Google or GitHub account to apply as a teacher.')
          setPhase('error')
          return
        }

        if (error === 'not-teacher') {
          setErrorMsg('This account already exists, but it is not a teacher account. Use the correct login page or sign in with a different account.')
          setPhase('error')
          return
        }

        if (error === 'no-account') {
          setErrorMsg('No teacher account exists for this email yet. Apply to teach first, then sign in after approval.')
          setPhase('error')
          return
        }

        if (error === 'suspended') {
          setErrorMsg('This account is suspended. Please contact support for help.')
          setPhase('error')
          return
        }

        if (isSignup) {
          const res = await fetch('/api/auth/teacher-oauth-claim', { method: 'POST' })
          const data = await res.json()

          if (!res.ok || !data.success) {
            if (mounted) {
              setErrorMsg(data.message || 'Could not complete your application.')
              setPhase('error')
            }
            return
          }
          if (mounted) {
            setInfoMsg(
              data.message ||
              'Your application has been submitted and is now pending administrator approval. You will receive an email when your account is approved.'
            )
            setPhase('pending')
          }
          return
        }

        // Sign-in attempt — try to log in as an approved teacher
        const res = await fetch('/api/auth/teacher-oauth-session-login', { method: 'POST' })
        const data = await res.json()

        if (!mounted) return

        if (!res.ok || !data.success) {
          if (data.pending) {
            setInfoMsg(data.message || 'Your teacher account is still pending administrator approval. You will receive an email when your account is approved.')
            setPhase('pending')
            return
          }

          // Recovery path: older OAuth redirects may lose intent.
          // If this looks like a new student OAuth account, try claim flow.
          if (!isSignup && typeof data.message === 'string' && data.message.includes('registered as a student')) {
            const claimRes = await fetch('/api/auth/teacher-oauth-claim', { method: 'POST' })
            const claimData = await claimRes.json()
            if (claimRes.ok && claimData.success) {
              setInfoMsg(
                claimData.message ||
                'Your application has been submitted and is now pending administrator approval. You will receive an email when your account is approved.'
              )
              setPhase('pending')
              return
            }
          }

          setErrorMsg(data.message || 'Sign in failed.')
          setPhase('error')
          return
        }

        // Active teacher — store session and redirect
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_session', JSON.stringify({
          username: data.username,
          name: data.name,
          role: data.role,
          userId: data.userId,
        }))
        document.cookie = `admin_token=${encodeURIComponent(data.token)}; Path=/; Max-Age=86400; SameSite=Lax`
        window.location.assign('/teacher/dashboard')
      } catch {
        if (mounted) {
          setErrorMsg('Something went wrong. Please try again.')
          setPhase('error')
        }
      }
    }

    void complete()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 text-center">

        {phase === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              {isSigninIntent ? 'Signing you in…' : 'Processing your application…'}
            </h1>
            <p className="text-sm text-gray-500">Please wait a moment.</p>
          </>
        )}

        {phase === 'pending' && (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">Application Submitted!</h1>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              {infoMsg || 'Your teacher account has been registered and is awaiting administrator approval. You will be able to sign in once your account is activated.'}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
              <p className="text-sm font-semibold text-amber-800 mb-2">What happens next?</p>
              <ul className="space-y-1 text-sm text-amber-700 list-disc list-inside">
                <li>Admin reviews your application</li>
                <li>Your account is activated upon approval</li>
                <li>You will receive an approval email at your account email address</li>
                <li>Sign in with the same Google / GitHub account once approved</li>
              </ul>
            </div>
            <Link
              href="/teacher/login"
              className="block w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all"
            >
              Back to Teacher Login
            </Link>
          </>
        )}

        {phase === 'approved' && (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-9 w-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Signing you in…</h1>
            <p className="text-sm text-gray-500">Redirecting to your dashboard.</p>
          </>
        )}

        {phase === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✕</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Something went wrong</h1>
            <p className="text-sm text-red-700 mb-6">{errorMsg}</p>
            <div className="space-y-3">
              <Link
                href="/teacher/signup"
                className="block w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                Apply to Teach
              </Link>
              <Link
                href="/teacher/login"
                className="block w-full py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Teacher Login
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
