'use client';

import { useState } from 'react';
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
  const { currentCurrency, convertPrice } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!coreType) return null;

  const corePrice = CORE_PRICING[coreType];
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = corePrice + addOnsPrice;

  const convertedCorePrice = convertPrice(corePrice, currentCurrency.code);
  const convertedAddOnsPrice = convertPrice(addOnsPrice, currentCurrency.code);
  const convertedTotalPrice = convertPrice(totalPrice, currentCurrency.code);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Handle form submission to contact form or payment flow
    console.log('Submitting custom build request:', {
      coreType,
      selectedAddOns,
      totalPrice: convertedTotalPrice
    });
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary">
          Your Custom Solution Summary
        </h2>
        <p className="text-lg text-darkText/70">
          Review your selections and submit your request. We'll get back to you within 24 hours.
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
                    const convertedAddonPrice = convertPrice(addon.price, currentCurrency.code);
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
          <div className="sticky top-4 bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-white shadow-xl">
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
                One-time investment ({currentCurrency.code})
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
              We'll contact you within 24 hours with next steps.
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
            <li>We'll review your requirements</li>
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
