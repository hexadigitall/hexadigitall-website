"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'

type Platform = 'web' | 'mobile' | 'both'
type Feature = 'auth' | 'payments' | 'chat' | 'ai' | 'notifications' | 'admin' | 'analytics' | 'multilingual'
type Budget = 'basic' | 'standard' | 'premium' | 'enterprise'

const FEATURE_OPTIONS: { key: Feature; label: string; hint: string }[] = [
  { key: 'auth', label: 'User Accounts / Authentication', hint: 'Email, phone, or social login' },
  { key: 'payments', label: 'Payments & Subscriptions', hint: 'Stripe, Paystack, Flutterwave' },
  { key: 'chat', label: 'In‑App Chat / Messaging', hint: '1:1 or group messaging' },
  { key: 'ai', label: 'AI Features', hint: 'Recommendations, summaries, assistants' },
  { key: 'notifications', label: 'Push / Email Notifications', hint: 'Transactional & marketing' },
  { key: 'admin', label: 'Admin Dashboard', hint: 'Manage users, content, reports' },
  { key: 'analytics', label: 'Analytics & Reports', hint: 'KPIs, funnels, exports' },
  { key: 'multilingual', label: 'Multi‑language', hint: 'i18n, RTL, translations' },
]

export default function CustomBuildWizard() {
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  const estimatedRange = useMemo(() => {
    // Compute a rough range based on platform + features + budget preference
    let base = 0
    if (platform === 'web') base = 999
    if (platform === 'mobile') base = 2499
    if (platform === 'both') base = 3499

    const complexity = features.length * 250
    let multiplier = 1
    if (budget === 'standard') multiplier = 1.4
    if (budget === 'premium') multiplier = 2.1
    if (budget === 'enterprise') multiplier = 3.3

    const low = Math.round((base + complexity) * multiplier)
    const high = Math.round(low * 1.6)
    return { low, high }
  }, [platform, features, budget])

  const canContinue = useMemo(() => {
    if (step === 1) return !!platform
    if (step === 2) return features.length > 0
    if (step === 3) return !!budget
    if (step === 4) return email.trim().length > 3
    return true
  }, [step, platform, features, budget, email])

  const toggleFeature = (f: Feature) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  const reset = () => {
    setStep(1)
    setPlatform(null)
    setFeatures([])
    setBudget(null)
    setEmail('')
    setCompany('')
  }

  const submit = async () => {
    const payload = {
      form: 'custom-build-request',
      platform,
      features,
      budget,
      estimate: `${estimatedRange.low} - ${estimatedRange.high} USD`,
      email,
      company,
      timestamp: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/custom-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed with ${res.status}`)
      }
      const data = await res.json()
      if (!data.success) console.warn('Email service reported issues:', data)
      setStep(5)
    } catch (e) {
      console.error('Failed to submit request', e)
      alert('Submission failed. Please try again or contact us.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="p-4 sm:p-6 border-b">
        <nav aria-label="Progress" className="flex items-center justify-center gap-2 text-sm">
          {[1,2,3,4,5].map((i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-300'}`} />
          ))}
        </nav>
      </div>

      <div className="p-4 sm:p-6">
        {step === 1 && (
          <section>
            <h2 className="text-xl font-bold mb-2">Platform</h2>
            <p className="text-slate-600 mb-4">What do you want to build?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: 'web', label: 'Web' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'both', label: 'Both' },
              ] as {key: Platform; label: string}[]).map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`p-4 rounded-xl border text-left transition ${platform === p.key ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'hover:border-slate-400'}`}
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-xs text-slate-600">{p.key === 'web' ? 'Website, web app, admin portal' : p.key === 'mobile' ? 'iOS / Android app' : 'Web + Mobile'}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-xl font-bold mb-2">Features</h2>
            <p className="text-slate-600 mb-4">Pick the core features you need.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURE_OPTIONS.map((f) => (
                <label key={f.key} className={`p-4 rounded-xl border cursor-pointer transition ${features.includes(f.key) ? 'border-green-600 ring-2 ring-green-200 bg-green-50' : 'hover:border-slate-400'}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={features.includes(f.key)}
                    onChange={() => toggleFeature(f.key)}
                  />
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-slate-600">{f.hint}</div>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-xl font-bold mb-2">Budget</h2>
            <p className="text-slate-600 mb-4">What range best fits your project?</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {([
                { key: 'basic', label: 'Basic', desc: '$' },
                { key: 'standard', label: 'Standard', desc: '$$' },
                { key: 'premium', label: 'Premium', desc: '$$$' },
                { key: 'enterprise', label: 'Enterprise', desc: '$$$$' },
              ] as {key: Budget; label: string; desc: string}[]).map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBudget(b.key)}
                  className={`p-4 rounded-xl border text-left transition ${budget === b.key ? 'border-purple-600 ring-2 ring-purple-200 bg-purple-50' : 'hover:border-slate-400'}`}
                >
                  <div className="font-semibold">{b.label}</div>
                  <div className="text-xs text-slate-600">{b.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-slate-50 border text-slate-700">
              Estimated Range (USD): <span className="font-semibold">{estimatedRange.low.toLocaleString()} — {estimatedRange.high.toLocaleString()}</span>
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p className="text-slate-600 mb-4">Where should we send your tailored plan?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-3"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company (optional)</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-slate-50 border text-slate-700">
              <div className="font-semibold mb-1">Summary</div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Platform: {platform || '—'}</li>
                <li>Features: {features.length ? features.join(', ') : '—'}</li>
                <li>Budget Tier: {budget || '—'}</li>
                <li>Estimate: {estimatedRange.low.toLocaleString()} — {estimatedRange.high.toLocaleString()} USD</li>
              </ul>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="text-center">
            <h2 className="text-xl font-bold mb-2">Request Received</h2>
            <p className="text-slate-600 mb-4">We’ll email your tailored plan shortly. Want to keep exploring?</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/services/web-and-mobile-software-development" className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Explore Web & Mobile</Link>
              <Link href="/services/custom-build" className="px-5 py-3 rounded-lg bg-slate-100 border hover:bg-white">Start Over</Link>
            </div>
          </section>
        )}
      </div>

      {/* Footer actions */}
      {step < 5 && (
        <div className="p-4 sm:p-6 border-t flex items-center justify-between gap-3">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-slate-50"
            onClick={() => (step > 1 ? setStep(step - 1) : reset())}
          >
            {step > 1 ? 'Back' : 'Reset'}
          </button>

          <div className="flex items-center gap-3">
            {step < 4 && (
              <button
                className={`px-5 py-2.5 rounded-lg text-white ${canContinue ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'}`}
                disabled={!canContinue}
                onClick={() => setStep(step + 1)}
              >
                Continue
              </button>
            )}
            {step === 4 && (
              <button
                className={`px-5 py-2.5 rounded-lg text-white ${canContinue ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-400 cursor-not-allowed'}`}
                disabled={!canContinue}
                onClick={submit}
              >
                Get My Plan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
