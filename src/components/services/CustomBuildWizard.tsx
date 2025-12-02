"use client"

import { useMemo, useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { 
  PLATFORM_BASES, 
  TECH_FEATURES, 
  SERVICE_ADDONS, 
  calculateCustomBuildPrice,
  type CustomBuildSelection 
} from '@/lib/customBuildPricing'

export default function CustomBuildWizard() {
  const { currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency()
  const [step, setStep] = useState(1)
  
  // User selections
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  
  // Payment flow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Calculate exact price (no ranges!)
  const priceBreakdown = useMemo(() => {
    const selection: CustomBuildSelection = {
      platform: selectedPlatform,
      techFeatures: selectedFeatures,
      serviceAddons: selectedAddons
    }
    const calc = calculateCustomBuildPrice(selection)
    
    // Apply Nigerian launch special discount (50% off) if applicable
    const discountActive = isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive()
    const discountMultiplier = discountActive ? 0.5 : 1
    
    // Convert to user's currency
    const convertedPlatform = Math.round(convertPrice(calc.platformCost * discountMultiplier, currentCurrency.code))
    const convertedFeatures = Math.round(convertPrice(calc.featuresCost * discountMultiplier, currentCurrency.code))
    const convertedAddons = Math.round(convertPrice(calc.addonsCost * discountMultiplier, currentCurrency.code))
    const convertedTotal = Math.round(convertPrice(calc.total * discountMultiplier, currentCurrency.code))
    
    return {
      ...calc,
      convertedPlatform,
      convertedFeatures,
      convertedAddons,
      convertedTotal,
      discountActive,
      totalUSD: calc.total
    }
  }, [selectedPlatform, selectedFeatures, selectedAddons, currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive])

  const canContinue = useMemo(() => {
    if (step === 1) return !!selectedPlatform
    if (step === 2) return true // Features optional
    if (step === 3) return true // Addons optional
    if (step === 4) return email.trim().length > 3
    return true
  }, [step, selectedPlatform, email])

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const reset = () => {
    setStep(1)
    setSelectedPlatform('')
    setSelectedFeatures([])
    setSelectedAddons([])
    setEmail('')
    setCompany('')
    setPhone('')
    setSubmitted(false)
  }

  const submitRequest = async () => {
    setIsSubmitting(true)
    setPaymentError(null)
    
    const payload = {
      form: 'custom-build-request',
      platform: priceBreakdown.breakdown.platform?.name || selectedPlatform,
      features: priceBreakdown.breakdown.features.map(f => f.name),
      addons: priceBreakdown.breakdown.addons.map(a => a.name),
      pricing: {
        platform: `${currentCurrency.symbol}${priceBreakdown.convertedPlatform.toLocaleString()}`,
        features: `${currentCurrency.symbol}${priceBreakdown.convertedFeatures.toLocaleString()}`,
        addons: `${currentCurrency.symbol}${priceBreakdown.convertedAddons.toLocaleString()}`,
        total: `${currentCurrency.symbol}${priceBreakdown.convertedTotal.toLocaleString()}`,
        totalUSD: `$${priceBreakdown.totalUSD.toLocaleString()}`
      },
      email,
      company,
      phone,
      timestamp: new Date().toISOString()
    }

    try {
      const res = await fetch('/api/custom-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed with ${res.status}`)
      }
      
      const data = await res.json()
      if (!data.success) console.warn('Email service reported issues:', data)
      
      setSubmitted(true)
      setStep(5)
    } catch (e) {
      console.error('Failed to submit request', e)
      setPaymentError('Submission failed. Please try again or contact us.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const proceedToPayment = async () => {
    setPaymentError(null)
    setIsSubmitting(true)
    
    try {
      const requestBody = {
        serviceCategory: { title: 'Custom Build', _id: 'custom-build' },
        selectedPackage: {
          name: priceBreakdown.breakdown.platform?.name || 'Custom Build',
          tier: 'custom',
          price: priceBreakdown.totalUSD,
          currency: 'USD'
        },
        selectedAddOns: [
          ...priceBreakdown.breakdown.features.map(f => ({ _key: f.id, name: f.name, price: f.price })),
          ...priceBreakdown.breakdown.addons.map(a => ({ _key: a.id, name: a.name, price: a.price }))
        ],
        clientInfo: { email, company, phone },
        projectDetails: {
          title: 'Custom Build Wizard',
          description: `Platform: ${priceBreakdown.breakdown.platform?.name}; Features: ${priceBreakdown.breakdown.features.map(f => f.name).join(', ') || 'None'}; Add-ons: ${priceBreakdown.breakdown.addons.map(a => a.name).join(', ') || 'None'}`
        },
        currency: currentCurrency.code,
        totalAmount: priceBreakdown.convertedTotal
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
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                step >= i ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 sm:p-8">
        {/* STEP 1: Choose Platform ("The Bread") */}
        {step === 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Choose Your Foundation</h2>
            <p className="text-slate-600 mb-6">Select the platform type — each comes with a complete engineering foundation.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {PLATFORM_BASES.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-6 rounded-xl border-2 text-left transition ${
                    selectedPlatform === platform.id
                      ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xl font-bold">{platform.name}</div>
                      <div className="text-sm text-slate-600">{platform.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${platform.basePrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">{platform.deliveryTime}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-semibold text-slate-700 mb-2">What&apos;s Included in the Core:</div>
                  <ul className="space-y-1">
                    {platform.coreFeatures.map((feature, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 2: Add Tech Features ("The Fillings") */}
        {step === 2 && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Power It Up with Features</h2>
            <p className="text-slate-600 mb-6">Select the technical features you need — each has a clear price.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TECH_FEATURES.map((feature) => (
                <label
                  key={feature.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{feature.icon}</span>
                        <span className="font-semibold">{feature.name}</span>
                        <span className="ml-auto text-blue-600 font-bold">+${feature.price}</span>
                      </div>
                      <div className="text-sm text-slate-600">{feature.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: Add Service Add-ons ("The Sides") */}
        {step === 3 && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Enhance with Services</h2>
            <p className="text-slate-600 mb-6">Optional services to complete your project.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_ADDONS.map((addon) => (
                <label
                  key={addon.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    selectedAddons.includes(addon.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{addon.name}</span>
                        <span className="ml-auto text-blue-600 font-bold">
                          +${addon.price}{addon.billing === 'monthly' ? '/mo' : ''}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">{addon.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* STEP 4: Contact Info */}
        {step === 4 && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Your Contact Information</h2>
            <p className="text-slate-600 mb-6">We&apos;ll send you a detailed quote and next steps.</p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company / Project Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
          </section>
        )}

        {/* STEP 5: Confirmation & Payment */}
        {step === 5 && (
          <section>
            <h2 className="text-2xl font-bold mb-2">Your Custom Build Summary</h2>
            <p className="text-slate-600 mb-6">Review your selections and proceed to payment.</p>
            
            {/* Itemized Breakdown */}
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="space-y-3">
                {/* Platform */}
                <div className="flex justify-between items-start pb-3 border-b">
                  <div>
                    <div className="font-semibold">{priceBreakdown.breakdown.platform?.name}</div>
                    <div className="text-sm text-slate-600">Foundation</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{currentCurrency.symbol}{priceBreakdown.convertedPlatform.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">${priceBreakdown.platformCost}</div>
                  </div>
                </div>

                {/* Features */}
                {priceBreakdown.breakdown.features.map((feature) => (
                  <div key={feature.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-slate-600">{feature.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{currentCurrency.symbol}{Math.round(convertPrice(feature.price * (priceBreakdown.discountActive ? 0.5 : 1), currentCurrency.code)).toLocaleString()}</div>
                      <div className="text-xs text-slate-500">${feature.price}</div>
                    </div>
                  </div>
                ))}

                {/* Add-ons */}
                {priceBreakdown.breakdown.addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{addon.name}</div>
                      <div className="text-sm text-slate-600">{addon.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{currentCurrency.symbol}{Math.round(convertPrice(addon.price * (priceBreakdown.discountActive ? 0.5 : 1), currentCurrency.code)).toLocaleString()}</div>
                      <div className="text-xs text-slate-500">${addon.price}</div>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-300">
                  <div className="text-xl font-bold">Total</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{currentCurrency.symbol}{priceBreakdown.convertedTotal.toLocaleString()}</div>
                    <div className="text-sm text-slate-500">≈ ${priceBreakdown.totalUSD.toLocaleString()} USD</div>
                  </div>
                </div>

                {priceBreakdown.discountActive && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold text-center">
                    🎉 Nigerian Launch Special: 50% OFF Applied!
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!submitted ? (
              <div className="space-y-3">
                <button
                  onClick={submitRequest}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request (Email Me Quote)'}
                </button>
                <button
                  onClick={proceedToPayment}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Submit & Pay Now'}
                </button>
                {paymentError && (
                  <div className="text-red-600 text-sm text-center">{paymentError}</div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-lg font-semibold">✓ Request Submitted!</div>
                <p className="text-slate-600">Check your email for a detailed quote and next steps.</p>
                <button onClick={reset} className="text-blue-600 hover:underline">
                  Start a New Build
                </button>
              </div>
            )}
          </section>
        )}

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canContinue}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 4 ? 'Review & Pay' : 'Continue'}
            </button>
          </div>
        )}

        {/* Live Price Display (Sticky) */}
        {step < 5 && selectedPlatform && (
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-slate-700">Your Build Total:</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {currentCurrency.symbol}{priceBreakdown.convertedTotal.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">≈ ${priceBreakdown.totalUSD.toLocaleString()} USD</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
