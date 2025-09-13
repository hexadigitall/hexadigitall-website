'use client';

import React, { useState, useEffect } from 'react';
import { CheckIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { type PricingTier, SERVICE_PRICING } from '@/lib/currency';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PriceDisplay } from './PriceDisplay';

interface PricingTiersProps {
  service: string;
  title?: string;
  description?: string;
  className?: string;
  onSelectPlan?: (tier: PricingTier) => void;
  showPopularBadge?: boolean;
  showLocalDiscount?: boolean;
}

export default function PricingTiers({
  service,
  title,
  description,
  className = '',
  onSelectPlan,
  showPopularBadge = true,
  showLocalDiscount = true
}: PricingTiersProps) {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const { getLocalDiscountMessage } = useCurrency();
  const localDiscountMessage = showLocalDiscount ? getLocalDiscountMessage() : null;

  useEffect(() => {
    // Get pricing tiers for the service
    const serviceTiers = SERVICE_PRICING[service] || [];
    setTiers(serviceTiers);
  }, [service]);

  const handleSelectPlan = (tier: PricingTier) => {
    if (onSelectPlan) {
      onSelectPlan(tier);
    } else {
      // Default behavior: scroll to contact form or open modal
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // You could also pre-fill the form with the selected tier
        const event = new CustomEvent('planSelected', { detail: { tier } });
        window.dispatchEvent(event);
      }
    }
  };

  if (tiers.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No pricing tiers available for this service.</p>
      </div>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
            {localDiscountMessage && (
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">{localDiscountMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                tier.popular 
                  ? 'border-blue-500 scale-105 lg:scale-110' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && showPopularBadge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Tier Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {tier.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <PriceDisplay 
                      price={tier.basePrice}
                      size="lg"
                      showDiscount={true}
                      showUrgency={true}
                      className=""
                    />
                    <p className="text-sm text-gray-600 mt-2">{tier.billing || 'One-time payment'}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(tier)}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group ${
                    tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent hover:border-blue-200'
                  }`}
                >
                  {tier.cta}
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">
              Need something custom?
            </h4>
            <p className="text-gray-600 mb-4">
              All our packages can be customized to fit your specific needs. 
              Contact us for a personalized quote.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ 100% Satisfaction Guarantee</span>
              <span>✓ Fast Turnaround</span>
              <span>✓ Professional Quality</span>
              <span>✓ Ongoing Support</span>
            </div>
          </div>
        </div>

        {/* Testimonial or Trust Indicators */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Trusted by 200+ businesses worldwide • 4.9/5 average rating
          </p>
        </div>
      </div>
    </section>
  );
}
