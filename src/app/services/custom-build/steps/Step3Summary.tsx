'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { CoreType, SelectedAddOn } from '../types';

interface Step3SummaryProps {
  coreType: CoreType;
  selectedAddOns: SelectedAddOn[];
  onBack: () => void;
  onReset: () => void;
}

// Core pricing
const CORE_PRICING: Record<NonNullable<CoreType>, number> = {
  web: 1999,
  mobile: 2999,
  both: 4499
};

const CORE_DESCRIPTIONS: Record<NonNullable<CoreType>, string> = {
  web: 'Professional web application with full backend, database, and responsive design.',
  mobile: 'Native mobile app(s) optimized for iOS and/or Android platforms with app store distribution.',
  both: 'Complete digital presence with web platform and mobile apps sharing a unified backend.'
};

export default function Step3Summary({
  coreType,
  selectedAddOns,
  onBack,
  onReset
}: Step3SummaryProps) {
  const { currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const priceLiveRegionRef = useRef<HTMLDivElement>(null);

  // Focus heading on mount for accessibility
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!coreType) return null;

  const corePrice = CORE_PRICING[coreType];
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = corePrice + addOnsPrice;

  // Apply Nigerian launch special discount (50% off) if applicable using shared currency context logic
  const discountActive = isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive();
  const discountedCorePrice = discountActive ? corePrice * 0.5 : corePrice;
  const discountedAddOnsPrice = discountActive ? addOnsPrice * 0.5 : addOnsPrice;
  const discountedTotalPrice = discountActive ? totalPrice * 0.5 : totalPrice;

  const convertedCorePrice = convertPrice(discountedCorePrice, currentCurrency.code);
  const convertedAddOnsPrice = convertPrice(discountedAddOnsPrice, currentCurrency.code);
  const convertedTotalPrice = convertPrice(discountedTotalPrice, currentCurrency.code);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Recompute discounted total price with shared logic
      const discountActive = isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive();
      const finalDiscountedTotal = discountActive ? totalPrice * 0.5 : totalPrice;
      const finalConvertedPrice = convertPrice(finalDiscountedTotal, currentCurrency.code);
      
      const response = await fetch('/api/service-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: `custom-build-${coreType}`,
          serviceName: `Custom ${coreType.charAt(0).toUpperCase() + coreType.slice(1)} Development`,
          serviceType: 'customizable',
          basePrice: finalConvertedPrice,
          total: finalConvertedPrice,
          currency: currentCurrency.code,
          customBuildDetails: {
            coreType,
            corePrice: convertPrice(discountActive ? corePrice * 0.5 : corePrice, currentCurrency.code),
            selectedAddOns: selectedAddOns.map(addon => ({
              ...addon,
              price: convertPrice(discountActive ? addon.price * 0.5 : addon.price, currentCurrency.code)
            }))
          },
          customerInfo: {
            name: '',
            email: '',
            phone: '',
            company: '',
            details: `Custom build request: ${coreType} with ${selectedAddOns.length} add-ons`
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Checkout failed');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment initialization failed. Please try again or contact support.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 ref={headingRef} tabIndex={-1} className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary focus:outline-none">
          Your Custom Solution Summary
        </h2>
        <p className="text-lg text-darkText/70">
          Review your selections and submit your request. We&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Core Solution */}
        <div className="md:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6">
            <h3 className="text-2xl font-bold font-heading text-primary mb-4">
              Core Solution
            </h3>

            {/* Core Selection Card */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-darkText/70 mb-1">Selected:</p>
                  <h4 className="text-2xl font-bold font-heading text-primary capitalize">
                    {coreType} {coreType === 'both' ? 'Development' : 'Only'}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-sm text-darkText/70 mb-1">Price:</p>
                  <p className="text-3xl font-bold text-primary">
                    {currentCurrency.symbol}{Math.round(convertedCorePrice).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-darkText/70">{CORE_DESCRIPTIONS[coreType]}</p>
            </div>

            {/* Add-ons Section */}
            {selectedAddOns.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold font-heading text-primary mb-4">
                  Add-ons
                </h3>
                <div className="space-y-3">
                  {selectedAddOns.map((addon) => {
                    const discountedAddonPrice = discountActive ? addon.price * 0.5 : addon.price;
                    const convertedAddonPrice = convertPrice(discountedAddonPrice, currentCurrency.code);
                    return (
                      <div key={addon.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold text-darkText">{addon.name}</span>
                        </div>
                        <span className="text-lg font-bold text-accent">
                          +{currentCurrency.symbol}{Math.round(convertedAddonPrice).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 text-sm">
                  No add-ons selected. You can enhance your project with optional features if needed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary Card - Sticky */}
        <div className="md:col-span-1">
          <div ref={priceLiveRegionRef} aria-live="polite" className="sticky top-4 bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-6">Total Investment</h3>

            {/* Breakdown */}
            <div className="space-y-3 pb-6 border-b border-white/20 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span>Core {coreType && coreType.charAt(0).toUpperCase() + coreType.slice(1)}</span>
                <span className="font-semibold">
                  {currentCurrency.symbol}{Math.round(convertedCorePrice).toLocaleString()}
                </span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span>{selectedAddOns.length} Add-on{selectedAddOns.length !== 1 ? 's' : ''}</span>
                  <span className="font-semibold">
                    {currentCurrency.symbol}{Math.round(convertedAddOnsPrice).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-8">
              <p className="text-white/80 text-sm mb-1">Total</p>
              <p className="text-4xl font-bold">
                {currentCurrency.symbol}{Math.round(convertedTotalPrice).toLocaleString()}
              </p>
              <p className="text-white/80 text-xs mt-2">
                One-time investment ({currentCurrency.code}){discountActive ? ' • 50% launch discount applied' : ''}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-75"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>

            <p className="text-white/70 text-xs mt-4 text-center">
              We&apos;ll contact you within 24 hours with next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold text-darkText hover:bg-gray-50 transition-colors"
        >
          ← Back to Add-ons
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-6 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
        >
          Start Over
        </button>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold mb-2">✓ What happens next?</p>
          <ul className="text-green-800 text-sm space-y-1 ml-5 list-disc">
            <li>We&apos;ll review your requirements</li>
            <li>Schedule a brief call to clarify details (if needed)</li>
            <li>Provide a detailed project timeline and scope</li>
            <li>Send a formal proposal with payment terms</li>
          </ul>
        </div>

        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-blue-900 font-semibold mb-2">ℹ️ Other options</p>
          <p className="text-blue-800 text-sm mb-3">
            Not sure about the custom builder? Check out our pre-built packages:
          </p>
          <Link
            href="/services/web-and-mobile-software-development"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            View Package Tiers
          </Link>
        </div>
      </div>
    </div>
  );
}
