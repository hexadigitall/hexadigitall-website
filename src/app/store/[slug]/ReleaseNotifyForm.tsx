'use client'

import { useState } from 'react'

interface ReleaseNotifyFormProps {
  slug: string
  title: string
}

export default function ReleaseNotifyForm({ slug, title }: ReleaseNotifyFormProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('loading')
    setMessage('')

    try {
      const response = await fetch('/api/release-notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error ?? 'Failed to subscribe')
      }

      setState('success')
      setMessage(payload.message ?? 'You are on the release list.')
      setEmail('')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Unable to subscribe at the moment.')
    }
  }

  return (
    <div id="notify" className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <p className="font-semibold text-amber-800 mb-1">This book is coming soon</p>
      <p className="text-sm text-amber-700 mb-3">
        Join the release list for <strong>{title}</strong> and we&apos;ll email you when it becomes available.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-amber-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          aria-label="Email for release notification"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="rounded-lg bg-amber-600 text-white px-4 py-2 text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60"
        >
          {state === 'loading' ? 'Subscribing...' : 'Notify Me'}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-xs ${state === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
