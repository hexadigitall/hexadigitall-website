"use client"

import { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { EXCHANGE_RATES } from '@/lib/currency'

interface ProposalTier {
  key: string
  name: string
  subtitle: string
  priceNGN: number
  delivery: string
  features: string[]
  popular?: boolean
}

const tiers: ProposalTier[] = [
  {
    key: 'basic',
    name: 'Basic Package',
    subtitle: 'Launch-ready store for a small catalog',
    priceNGN: 199_000,
    delivery: '3-4 weeks',
    features: [
      '10-page store (Home, Shop, Cart, Checkout, About, Blog, Contact)',
      'Up to 50 products with variants',
      'Paystack checkout (cards, transfer, USSD)',
      'One shipping provider, tracking-ready',
      'Sanity CMS for fast product updates',
      'Mobile-first, fast load times',
      'Basic SEO + social meta tags',
    ],
  },
  {
    key: 'starter',
    name: 'Starter Package',
    subtitle: 'Growth-ready with marketing and retention',
    priceNGN: 350_000,
    delivery: '4-6 weeks',
    popular: true,
    features: [
      'Everything in Basic',
      'Up to 150 products',
      'Paystack + Flutterwave checkout',
      'Advanced filters (size, color, price)',
      'Reviews, ratings, related products',
      'Email marketing + abandoned cart nudges',
      'Discount codes and coupons',
      '3-month post-launch support',
    ],
  },
  {
    key: 'growth',
    name: 'Growth Package',
    subtitle: 'Scale operations, analytics, loyalty',
    priceNGN: 600_000,
    delivery: '6-8 weeks',
    features: [
      'Everything in Starter',
      'Unlimited products + bulk import/export',
      'Loyalty points, gift cards, pre-orders',
      'Multi-currency display (NGN, USD, GBP)',
      'Advanced analytics + A/B testing',
      'Live chat + social auto-posting',
      '6-month premium support',
    ],
  },
]

// removed unused proposalPath


export default function JhemaProposalClient({ companyName = 'Your Business' }: { companyName?: string }) {
  const { currentCurrency, convertPrice, formatPrice } = useCurrency()
  // const shareUrl = useShareUrl()
  const [selectedTier, setSelectedTier] = useState<ProposalTier | null>(tiers[1])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toSlug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

  const handleCheckout = async () => {
    if (!selectedTier) return
    if (!email) {
      setError('Email is required to receive your receipt and checkout link.')
      return
    }

    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      // Prices are stored in NGN; convert once using USD as the pivot to avoid double conversion when NGN is selected.
      const priceInUsd = selectedTier.priceNGN / EXCHANGE_RATES.NGN
      const priceForCurrency = currentCurrency.code === 'NGN'
        ? selectedTier.priceNGN
        : convertPrice(priceInUsd, currentCurrency.code)
      const body = {
        serviceCategory: {
          _id: `proposal-${toSlug(companyName)}`,
          title: `${companyName} E-Commerce Proposal`,
          slug: { current: toSlug(companyName) },
          description: 'Tailored e-commerce build with Paystack-ready checkout.',
          serviceType: 'web',
          icon: '🛍️',
          featured: true,
          packages: [],
        },
        selectedPackage: {
          _key: `jhema-${selectedTier.key}`,
          name: selectedTier.name,
          tier: selectedTier.key === 'basic' ? 'basic' : selectedTier.key === 'starter' ? 'standard' : 'premium',
          price: selectedTier.priceNGN,
          currency: 'NGN',
          billing: 'one_time',
          deliveryTime: selectedTier.delivery,
          features: selectedTier.features,
          popular: selectedTier.popular,
        },
        selectedAddOns: [],
        clientInfo: {
          name: name || 'Prospect',
          email,
          phone,
          company: companyName,
        },
        projectDetails: {
          title: `${selectedTier.name} for ${companyName}`,
          description: 'E-commerce launch with tiered package selected from proposal page.',
          timeline: selectedTier.delivery,
        },
        totalAmount: priceForCurrency,
        currency: currentCurrency.code,
      }

      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      const redirectUrl = data.url || data.checkoutUrl
      if (!redirectUrl) throw new Error('No checkout URL returned')
      setMessage('Redirecting to Paystack checkout…')
      window.location.href = redirectUrl
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">E-commerce proposal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{companyName} — Online Store Launch</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Tiered packages with Paystack checkout, tailored for fashion retail. Choose a plan below to get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {tiers.map(tier => {
            const isSelected = selectedTier?.key === tier.key
            const displayPrice = `₦${tier.priceNGN.toLocaleString()}`
            const priceInUsd = tier.priceNGN / EXCHANGE_RATES.NGN
            const convertedLabel = currentCurrency.code !== 'NGN'
              ? formatPrice(priceInUsd, { currency: currentCurrency.code as 'NGN', applyNigerianDiscount: false })
              : null

            return (
              <button
                key={tier.key}
                onClick={() => setSelectedTier(tier)}
                className={`text-left rounded-2xl border-2 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  isSelected ? 'border-primary shadow-xl bg-white' : 'border-slate-200 bg-white'
                } ${tier.popular ? 'relative ring-2 ring-secondary/60' : ''}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-6 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <span className="text-sm font-medium text-primary">{tier.delivery}</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{tier.subtitle}</p>
                <div className="text-3xl font-bold text-primary mb-2">{displayPrice}</div>
                {convertedLabel && (
                  <div className="text-xs text-slate-500 mb-4">≈ {convertedLabel}</div>
                )}
                <ul className="space-y-2 text-sm text-slate-700">
                  {tier.features.map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                    isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {isSelected ? 'Selected' : 'Choose plan'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="grid gap-8 md:grid-cols-5 items-start">
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">What this includes</h2>
            <p className="text-slate-600 mb-6">Full e-commerce build with payments, logistics, and marketing automation baked in.</p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-2"><span className="text-primary">•</span><span>Product catalog with variants, inventory tracking, order management</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span>Paystack-first checkout (cards, transfers, USSD) with Flutterwave backup</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span>Shipping integrations (GIGL, DHL, Aramex) and customer notifications</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span>SEO + OG tags powered by SiteSEO, social share previews ready</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span>Marketing: abandoned cart, coupons, email capture, analytics</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span>Admin CMS via Sanity for fast updates (no dev needed)</span></li>
            </ul>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Start with your details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Ada Lovelace"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (for receipt)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="+234"
                />
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">
                <div className="flex justify-between items-center">
                  <span>Selected plan</span>
                  <span className="font-semibold text-slate-900">{selectedTier?.name}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-slate-600">
                  <span>Price</span>
                    <span className="font-semibold text-primary">{selectedTier ? `₦${selectedTier.priceNGN.toLocaleString()}` : '—'}</span>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
              <button
                onClick={handleCheckout}
                disabled={submitting || !selectedTier}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-4 py-3 font-semibold shadow hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? 'Processing…' : 'Pay with Paystack'}
              </button>
              <p className="text-xs text-slate-500 text-center">Secure checkout via Paystack. You will be redirected to complete payment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
