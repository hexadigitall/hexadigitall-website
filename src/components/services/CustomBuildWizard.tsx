"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'

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
  const { currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency()
  const [step, setStep] = useState(1)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [wantsToProceedToPayment, setWantsToProceedToPayment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

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

    const baseTotal = base + complexity
    const lowUSD = Math.round(baseTotal * multiplier)
    const highUSD = Math.round(lowUSD * 1.6)
    
    // Apply Nigerian launch special discount (50% off) if applicable
    const discountActive = isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive()
    const discountMultiplier = discountActive ? 0.5 : 1
    
    // Convert to user's currency
    const low = Math.round(convertPrice(lowUSD * discountMultiplier, currentCurrency.code))
    const high = Math.round(convertPrice(highUSD * discountMultiplier, currentCurrency.code))
    
    return { low, high, lowUSD, highUSD, discountActive }
  }, [platform, features, budget, currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive])

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

  const submit = async (proceedToPayment: boolean = false) => {
    const payload = {
      form: 'custom-build-request',
      platform,
      features,
      budget,
      estimate: `${currentCurrency.symbol}${estimatedRange.low.toLocaleString()} - ${currentCurrency.symbol}${estimatedRange.high.toLocaleString()} (${estimatedRange.lowUSD} - ${estimatedRange.highUSD} USD)`,
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
      
      if (proceedToPayment) {
        setWantsToProceedToPayment(true)
      }
      setStep(5)
    } catch (e) {
      console.error('Failed to submit request', e)
      alert('Submission failed. Please try again or contact us.')
    }
  }

  // Build a synthetic package & add-ons pricing for payment initialization
  const proceedToPayment = async () => {
    if (!platform || !budget || !email) return
    setPaymentError(null)
    setIsSubmitting(true)
    try {
      // Choose charge amount: use low end of converted range as initial payment (could be refined later)
      const totalAmount = estimatedRange.low
      const requestBody = {
        serviceCategory: { title: 'Custom Build', _id: 'custom-build' },
        selectedPackage: {
          name: `Custom ${platform === 'both' ? 'Web + Mobile' : platform.charAt(0).toUpperCase() + platform.slice(1)} Build (${budget})`,
          tier: budget,
          price: estimatedRange.lowUSD, // base USD for record
          currency: 'USD'
        },
        selectedAddOns: features.map(f => ({ _key: f, name: f, price: 250 })),
        clientInfo: { email, company },
        projectDetails: {
          title: 'Custom Build Wizard Submission',
          description: `Platform: ${platform}; Features: ${features.join(', ') || 'None'}; Budget: ${budget}; Range (${currentCurrency.code}): ${currentCurrency.symbol}${estimatedRange.low.toLocaleString()} - ${currentCurrency.symbol}${estimatedRange.high.toLocaleString()}`
        },
        currency: currentCurrency.code,
        totalAmount
      }

      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Payment init failed (${res.status})`)
      }
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('No authorization URL returned')
      }
    } catch (err) {
      console.error('Payment init error', err)
      setPaymentError(err instanceof Error ? err.message : 'Unknown payment error')
    } finally {
      setIsSubmitting(false)
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
              <div className="font-semibold mb-2">Estimated Range:</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentCurrency.symbol}{estimatedRange.low.toLocaleString()} — {currentCurrency.symbol}{estimatedRange.high.toLocaleString()}
              </div>
              {estimatedRange.discountActive && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <span>🇳🇬</span>
                  <span>50% Nigerian Launch Special Applied!</span>
                </div>
              )}
              {currentCurrency.code !== 'USD' && (
                <div className="mt-1 text-sm text-slate-500">
                  ≈ ${estimatedRange.lowUSD.toLocaleString()} — ${estimatedRange.highUSD.toLocaleString()} USD
                </div>
              )}
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
              <div className="font-semibold mb-2">Summary</div>
              <ul className="text-sm list-disc pl-5 space-y-1 mb-3">
                <li>Platform: <span className="font-medium">{platform || '—'}</span></li>
                <li>Features: <span className="font-medium">{features.length ? features.join(', ') : '—'}</span></li>
                <li>Budget Tier: <span className="font-medium capitalize">{budget || '—'}</span></li>
              </ul>
              <div className="pt-3 border-t">
                <div className="font-semibold mb-1">Estimated Range:</div>
                <div className="text-xl font-bold text-blue-600">
                  {currentCurrency.symbol}{estimatedRange.low.toLocaleString()} — {currentCurrency.symbol}{estimatedRange.high.toLocaleString()}
                </div>
                {estimatedRange.discountActive && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <span>🇳🇬</span>
                    <span>50% Nigerian Launch Special!</span>
                  </div>
                )}
                {currentCurrency.code !== 'USD' && (
                  <div className="mt-1 text-xs text-slate-500">
                    ≈ ${estimatedRange.lowUSD.toLocaleString()} — ${estimatedRange.highUSD.toLocaleString()} USD
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {step === 5 && !wantsToProceedToPayment && (
          <section className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
              <p className="text-slate-600 mb-4">We&apos;ve sent a confirmation to <strong>{email}</strong>. Our team will email your tailored plan within 4-6 hours.</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Want to start immediately?</h3>
              <p className="text-sm text-blue-800 mb-3">
                If you&apos;re ready to move forward, you can proceed to payment now and we&apos;ll begin work within 24 hours.
              </p>
              <button
                onClick={() => setWantsToProceedToPayment(true)}
                className="w-full px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/services/web-and-mobile-software-development" className="w-full sm:w-auto px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Explore Web & Mobile</Link>
              <Link href="/services/custom-build" className="w-full sm:w-auto px-5 py-3 rounded-lg bg-slate-100 border hover:bg-white">Start Over</Link>
            </div>
          </section>
        )}

        {step === 5 && wantsToProceedToPayment && (
          <section className="text-center">
            <h2 className="text-xl font-bold mb-2">Payment Integration</h2>
            <p className="text-slate-600 mb-4">
              Payment flow coming soon. For now, please contact us at{' '}
              <a href="mailto:hexadigitztech@gmail.com" className="text-blue-600 hover:underline">
                hexadigitztech@gmail.com
              </a>
              {' '}or call{' '}
              <a href="tel:+2348125802140" className="text-blue-600 hover:underline">
                +234 812 580 2140
              </a>
              {' '}to arrange payment.
            </p>
            <div className="mt-6 p-4 rounded-lg bg-slate-50 border text-left">
              <div className="font-semibold mb-2">Your Quote:</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {currentCurrency.symbol}{estimatedRange.low.toLocaleString()} — {currentCurrency.symbol}{estimatedRange.high.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">
                <div>Platform: <span className="font-medium">{platform}</span></div>
                <div>Features: <span className="font-medium">{features.join(', ')}</span></div>
                <div>Budget: <span className="font-medium capitalize">{budget}</span></div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={proceedToPayment}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isSubmitting ? 'Initializing Payment...' : 'Pay Now (Start Project)'}
              </button>
            </div>
            {paymentError && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm">
                Payment error: {paymentError}
              </div>
            )}
            <button
              onClick={() => setWantsToProceedToPayment(false)}
              className="mt-4 px-5 py-2 rounded-lg border hover:bg-slate-50"
            >
              Back to Confirmation
            </button>
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
              <>
                <button
                  className={`px-5 py-2.5 rounded-lg text-white ${canContinue ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'}`}
                  disabled={!canContinue}
                  onClick={() => submit(false)}
                  title="Get a quote via email"
                >
                  Get Quote via Email
                </button>
                <button
                  className={`px-5 py-2.5 rounded-lg text-white ${canContinue ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-400 cursor-not-allowed'}`}
                  disabled={!canContinue}
                  onClick={() => submit(true)}
                  title="Submit and proceed to payment"
                >
                  Submit & Pay Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
