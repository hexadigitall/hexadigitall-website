"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { EXCHANGE_RATES } from '@/lib/currency'

interface ProposalTier {
  key: string
  name: string
  tagline: string
  priceNGN: number
  billingType: string
  delivery: string
  features: string[]
  highlights: string[]
  popular?: boolean
}

const tiers: ProposalTier[] = [
  {
    key: 'kickstarter',
    name: 'The "Kickstarter" Package',
    tagline: 'Consistency, Polish & Professionalism',
    priceNGN: 300_000,
    billingType: 'Monthly Retainer',
    delivery: 'Start within 3 days',
    features: [
      'Profile Optimization: One-time Instagram overhaul',
      'Content Pillars: 3 key themes per month',
      'Hashtag Strategy: 3 distinct sets to avoid shadowban',
      '5 Posts Per Week (20 posts/month)',
      '3x High-End Graphic Flyers/Carousels',
      '2x Reels Per Week with pro editing & trending audio',
      '3x Story Designs per week',
      'Professional captions with strong CTAs',
      'Engagement Monitoring: 1 hour daily (Mon-Fri)',
      'Spam Control: Bot comment deletion',
      'Monthly PDF Report: Growth metrics & recommendations',
    ],
    highlights: [
      'Senior Editor and Content Strategist (no interns)',
      'Custom, high-fashion visuals—not generic Canva templates',
      'Content Drop workflow system',
      'Profile optimization within 3 days of signing',
      'Reel expertise optimized for algorithm growth',
    ],
  },
  {
    key: 'takeover',
    name: 'The "Diva Takeover" Package',
    tagline: 'Aggressive Growth, Visibility & Sales Conversion',
    priceNGN: 650_000,
    billingType: 'Monthly Retainer',
    delivery: 'Full strategy within 5 days',
    popular: true,
    features: [
      'The "Detty December" Blueprint: Phase 1-4 execution',
      'Weekly Competitor Analysis',
      'Virtual Creative Direction: Storyboards & filming instructions',
      '7 Posts Per Week (Daily Posting)',
      '4x Reels Per Week designed for virality',
      '3x Static/Carousel Posts',
      'Daily Active Story Management (Polls, Q&A, Countdowns)',
      'Custom Graphic Design Suite for Flash Sales',
      'Influencer Squad Management: 3-5 micro-influencers',
      'Influencer Logistics: "Slay Kits" delivery coordination',
      'Meta Ads Management: 2 distinct campaigns',
      'A/B Testing: Headlines, images, cost optimization',
      'Community Support: 2 hours daily (including weekends)',
      '"Soft" Sales Closing: Direct item links in comments',
    ],
    highlights: [
      'RECOMMENDED: Replaces full-time Marketing Manager + Ad Specialist',
      'Influencer management handles 15 hours/month coordination',
      'Ad expertise prevents ₦100k daily waste',
      'Multiplier Effect: Content + Influencers + Ads',
      'Weekly strategy calls',
      'Ad budget (₦5k-₦10k/day) paid separately by client',
    ],
  },
  {
    key: 'empire',
    name: 'The "Empire" Package',
    tagline: 'Total Brand Automation & Concierge Service',
    priceNGN: 1_200_000,
    billingType: 'Monthly Retainer',
    delivery: 'Production day in week 1',
    features: [
      '1x Full Production Day per month (6-hour shoot)',
      'Professional lighting, gimbals, and model direction',
      'Month\'s worth of high-quality Reels and TikToks',
      'Concierge Sales Closing: DM management 9 AM – 6 PM (Mon-Sat)',
      'Customer inquiry handling, size confirmation, payment processing',
      '4x Broadcast messages per month (Email/WhatsApp)',
      'Cross-platform posting (Instagram, TikTok, YouTube Shorts)',
      'Trend jacking (ride viral trends within 24 hours)',
      'Priority crisis management support',
      'Bi-weekly strategy meetings analyzing sales data',
    ],
    highlights: [
      'Replaces: Content Creator + Social Media Manager + Sales Assistant',
      'Staff Cost Replacement: Saves ₦600k+ monthly vs. in-house',
      'Limited to 2 clients only due to intensive nature',
    ],
  },
  {
    key: 'blueprint',
    name: 'The "Diva Blueprint" Package',
    tagline: 'Strategy, Setup & Staff Training',
    priceNGN: 250_000,
    billingType: 'One-Time Project Fee',
    delivery: 'Complete in 14 days',
    features: [
      '30-Day Content Calendar (daily posting guide)',
      '20 Pre-written "Fill-in-the-blank" captions',
      '5 custom, editable Canva templates',
      'Instagram Bio & Highlights professional revamp',
      'WhatsApp tracking link setup',
      'Facebook Ads Manager account audit',
      '3 distinct saved audiences',
      '2 high-converting Ad Graphics',
      '2-Hour Live Training Session (Zoom or In-Person)',
      'Training: Filming Reels, CapCut editing, running ads, DM sales scripts',
    ],
    highlights: [
      'Completed in 14 days (Audit → Design → Ad Setup → Training)',
      'Professional assets usable for years',
      'Empower your team to run independently',
    ],
  },
]

const proposalPath = '/proposals/divas-kloset'

function useShareUrl() {
  return useMemo(() => {
    if (typeof window !== 'undefined') return window.location.href
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'}${proposalPath}`
  }, [])
}

export default function DivasProposalClient({ companyName = 'Your Business' }: { companyName?: string }) {
  const { currentCurrency, convertPrice, formatPrice } = useCurrency()
  const shareUrl = useShareUrl()
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
          title: `${companyName} Social Media Marketing Proposal`,
          slug: { current: toSlug(companyName) },
          description: 'Tailored social media marketing and content management.',
          serviceType: 'marketing',
          icon: '📱',
          featured: true,
          packages: [],
        },
        selectedPackage: {
          _key: `divas-${selectedTier.key}`,
          name: selectedTier.name,
          tier: selectedTier.key === 'blueprint' ? 'basic' : selectedTier.key === 'kickstarter' ? 'standard' : 'premium',
          price: selectedTier.priceNGN,
          currency: 'NGN',
          billing: selectedTier.billingType.includes('One-Time') ? 'one_time' : 'monthly',
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
          description: 'Social media marketing package selected from proposal page.',
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
    <div className="bg-gradient-to-b from-pink-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-pink-600 font-semibold mb-2">Social Media Marketing Proposal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{companyName} — Marketing & Growth</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive social media management packages designed for fashion retailers. Choose a plan below to get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
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
                className={`text-left rounded-2xl border-2 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${
                  isSelected ? 'border-pink-600 shadow-xl bg-white' : 'border-slate-200 bg-white'
                } ${tier.popular ? 'relative ring-2 ring-purple-500/60' : ''}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-6 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-pink-600 font-medium mt-1">{tier.tagline}</p>
                </div>
                <div className="text-2xl font-bold text-pink-600 mb-1">{displayPrice}</div>
                <p className="text-xs text-slate-500 mb-3">{tier.billingType}</p>
                {convertedLabel && (
                  <div className="text-xs text-slate-500 mb-4">≈ {convertedLabel}</div>
                )}
                <div className="text-xs text-slate-600 mb-3">
                  <span className="font-semibold">Delivery:</span> {tier.delivery}
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isSelected ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {isSelected ? 'Selected' : 'Choose plan'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {selectedTier && (
          <div className="grid gap-8 md:grid-cols-5 items-start mb-10">
            <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedTier.name}</h2>
              <p className="text-slate-600 mb-4 italic">{selectedTier.tagline}</p>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-3">What's Included:</h3>
              <ul className="space-y-2 text-sm text-slate-700 mb-6">
                {selectedTier.features.map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-pink-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Highlights:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {selectedTier.highlights.map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-purple-600">✓</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email (for receipt)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30"
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-pink-600 focus:ring-2 focus:ring-pink-600/30"
                    placeholder="+234"
                  />
                </div>
                <div className="rounded-lg bg-pink-50 border border-pink-200 p-3 text-sm text-slate-700">
                  <div className="flex justify-between items-center">
                    <span>Selected plan</span>
                    <span className="font-semibold text-slate-900">{selectedTier?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-slate-600">
                    <span>Price</span>
                    <span className="font-semibold text-pink-600">{selectedTier ? `₦${selectedTier.priceNGN.toLocaleString()}` : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                    <span>Billing</span>
                    <span>{selectedTier?.billingType}</span>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-green-600">{message}</p>}
                <button
                  onClick={handleCheckout}
                  disabled={submitting || !selectedTier}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-3 font-semibold shadow hover:from-pink-700 hover:to-purple-700 disabled:opacity-60"
                >
                  {submitting ? 'Processing…' : 'Pay with Paystack'}
                </button>
                <p className="text-xs text-slate-500 text-center">Secure checkout via Paystack. You will be redirected to complete payment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
