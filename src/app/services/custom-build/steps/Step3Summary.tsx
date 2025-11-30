'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';
import UnifiedServiceRequestFlow from '@/components/services/UnifiedServiceRequestFlow';
import type { CoreType, SelectedAddOn } from '../types';
import type { ServicePackageTier } from '@/types/service';

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
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
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

  // Create a tier object for the UnifiedServiceRequestFlow
  const customBuildTier: ServicePackageTier = {
    _key: `custom-build-${coreType}`,
    name: `Custom ${coreType.charAt(0).toUpperCase() + coreType.slice(1)} Development`,
    tier: 'premium',
    price: totalPrice, // Use original price - discount applied in flow
    currency: 'USD',
    billing: 'one_time',
    deliveryTime: '4-8 weeks',
    features: [
      CORE_DESCRIPTIONS[coreType],
      ...selectedAddOns.map(addon => addon.name)
    ],
    popular: false
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3 sm:mb-4 text-primary focus:outline-none">
          Your Custom Solution Summary
        </h2>
        <p className="text-sm sm:text-lg text-darkText/70">
          Review your selections and submit your request. We&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Core Solution */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary mb-4">
              Core Solution
            </h3>

            {/* Core Selection Card */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-darkText/70 mb-1">Selected:</p>
                  <h4 className="text-xl sm:text-2xl font-bold font-heading text-primary capitalize">
                    {coreType} {coreType === 'both' ? 'Development' : 'Only'}
                  </h4>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs sm:text-sm text-darkText/70 mb-1">Price:</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {currentCurrency.symbol}{Math.round(convertedCorePrice).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-darkText/70">{CORE_DESCRIPTIONS[coreType]}</p>
            </div>

            {/* Add-ons Section */}
            {selectedAddOns.length > 0 ? (
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-primary mb-4">
                  Add-ons
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {selectedAddOns.map((addon) => {
                    const discountedAddonPrice = discountActive ? addon.price * 0.5 : addon.price;
                    const convertedAddonPrice = convertPrice(discountedAddonPrice, currentCurrency.code);
                    return (
                      <div key={addon.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold text-darkText text-sm sm:text-base">{addon.name}</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-accent">
                          +{currentCurrency.symbol}{Math.round(convertedAddonPrice).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 text-xs sm:text-sm">
                  No add-ons selected. You can enhance your project with optional features if needed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary Card - Sticky on larger screens */}
        <div className="lg:col-span-1">
          <div ref={priceLiveRegionRef} aria-live="polite" className="lg:sticky lg:top-4 bg-gradient-to-br from-primary to-secondary rounded-lg p-5 sm:p-8 text-white shadow-xl">
            <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Total Investment</h3>

            {/* Breakdown */}
            <div className="space-y-2 sm:space-y-3 pb-4 sm:pb-6 border-b border-white/20 mb-4 sm:mb-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Core {coreType && coreType.charAt(0).toUpperCase() + coreType.slice(1)}</span>
                <span className="font-semibold">
                  {currentCurrency.symbol}{Math.round(convertedCorePrice).toLocaleString()}
                </span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span>{selectedAddOns.length} Add-on{selectedAddOns.length !== 1 ? 's' : ''}</span>
                  <span className="font-semibold">
                    {currentCurrency.symbol}{Math.round(convertedAddOnsPrice).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6 sm:mb-8">
              <p className="text-white/80 text-xs sm:text-sm mb-1">Total</p>
              <p className="text-3xl sm:text-4xl font-bold">
                {currentCurrency.symbol}{Math.round(convertedTotalPrice).toLocaleString()}
              </p>
              <p className="text-white/80 text-[10px] sm:text-xs mt-2">
                One-time investment ({currentCurrency.code}){discountActive ? ' • 50% launch discount applied' : ''}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowPaymentFlow(true)}
              className="w-full bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Proceed to Payment
            </button>

            <p className="text-white/70 text-xs mt-4 text-center">
              You&apos;ll enter your details in the next step.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold text-darkText hover:bg-gray-50 transition-colors min-h-[44px]"
        >
          ← Back to Add-ons
        </button>
        <button
          onClick={onReset}
          className="flex-1 px-6 py-4 border-2 border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors min-h-[44px]"
        >
          Start Over
        </button>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 sm:space-y-4">
        <div className="p-4 sm:p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-green-900 font-semibold mb-2 text-sm sm:text-base">✓ What happens next?</p>
          <ul className="text-green-800 text-xs sm:text-sm space-y-1 ml-5 list-disc">
            <li>We&apos;ll review your requirements</li>
            <li>Schedule a brief call to clarify details (if needed)</li>
            <li>Provide a detailed project timeline and scope</li>
            <li>Send a formal proposal with payment terms</li>
          </ul>
        </div>

        <div className="p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-blue-900 font-semibold mb-2 text-sm sm:text-base">ℹ️ Other options</p>
          <p className="text-blue-800 text-xs sm:text-sm mb-3">
            Not sure about the custom builder? Check out our pre-built packages:
          </p>
          <Link
            href="/services/web-and-mobile-software-development"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm min-h-[44px]"
          >
            View Package Tiers
          </Link>
        </div>
      </div>

      {/* Payment Flow Modal */}
      {showPaymentFlow && (
        <UnifiedServiceRequestFlow
          serviceId={`custom-build-${coreType}`}
          serviceName={`Custom ${coreType.charAt(0).toUpperCase() + coreType.slice(1)} Development`}
          serviceType="customizable"
          tier={customBuildTier}
          onClose={() => setShowPaymentFlow(false)}
        />
      )}
    </div>
  );
}
