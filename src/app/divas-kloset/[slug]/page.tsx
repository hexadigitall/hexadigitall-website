'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { divasKlosetTiers } from '@/data/divasKlosetTiers'
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
}

export default function DivasTierPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const tier = useMemo(() => divasKlosetTiers.find((t) => t.slug === slug), [slug])
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!tier) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="text-lg font-semibold text-gray-800">Tier not found.</p>
        <Link href="/" className="mt-3 text-primary hover:text-primary/80">Back home</Link>
      </div>
    )
  }

  const handlePay = async () => {
    setError(null)
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in your name, email, and phone.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: `divas-kloset-${tier.slug}`,
          serviceName: `Diva\'s Kloset - ${tier.name}`,
          serviceType: 'tiered',
          tier: { _key: tier.slug, name: tier.name, price: tier.price },
          basePrice: tier.price,
          addOns: [],
          total: tier.price,
          customerInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            details: tier.headline,
          },
          currency: tier.currency,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.url) {
        throw new Error(data.message || 'Failed to initialize payment')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <p className="text-sm text-gray-500">Diva&apos;s Kloset · {tier.name}</p>
        </div>

        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white px-6 py-8">
            <p className="text-sm uppercase tracking-wide text-white/80">{tier.tagline}</p>
            <h1 className="text-3xl font-bold mt-2">{tier.name}</h1>
            <p className="mt-2 text-lg text-white/90 max-w-3xl">{tier.headline}</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-4xl font-bold">{tier.currency === 'NGN' ? '₦' : '$'}{tier.price.toLocaleString()}</span>
              <span className="text-white/80">{tier.billingType}</span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">What you get</h2>
              <p className="text-gray-600">{tier.summary}</p>
              <ul className="space-y-3">
                {tier.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              {tier.highlights && tier.highlights.length > 0 && (
                <div className="mt-6 bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4">
                  <h3 className="font-semibold text-fuchsia-900 mb-2">Key Highlights</h3>
                  <ul className="space-y-1">
                    {tier.highlights.map((item) => (
                      <li key={item} className="text-sm text-fuchsia-800 flex items-start gap-2">
                        <span className="text-fuchsia-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 text-sm text-gray-500">Need adjustments? Reply to this link—we can tweak scope or add-ons.</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Checkout</h3>
              <p className="text-sm text-gray-600 mb-4">Enter your details to pay securely via Paystack.</p>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +234..."
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Company (optional)</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Diva&apos;s Kloset"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-3 font-semibold shadow hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? 'Initializing…' : `Pay ${tier.currency === 'NGN' ? '₦' : '$'}${tier.price.toLocaleString()}`}
              </button>
              <p className="mt-2 text-xs text-gray-500">Powered by Paystack. You can use card, transfer, USSD, or bank payments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
