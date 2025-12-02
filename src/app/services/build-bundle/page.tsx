'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  ALL_INDIVIDUAL_SERVICES, 
  IndividualService 
} from '@/data/individualServices';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { DiscountBanner } from '@/components/ui/DiscountBanner';

// Category configuration with icons
const CATEGORIES = [
  { id: 'all', label: 'All Services', icon: '🎯', description: 'Browse everything' },
  { id: 'web-dev', label: 'Web & Tech', icon: '💻', description: 'Development & optimization' },
  { id: 'business', label: 'Business Strategy', icon: '📊', description: 'Plans & research' },
  { id: 'branding', label: 'Design & Branding', icon: '🎨', description: 'Logos & visual identity' },
  { id: 'marketing', label: 'Marketing', icon: '📱', description: 'Social media & ads' },
  { id: 'portfolio', label: 'Career & Portfolio', icon: '💼', description: 'Resumes & profiles' },
  { id: 'mentoring', label: 'Mentoring', icon: '🎓', description: '1-on-1 coaching' },
];

function BundleBuilderContent() {
  const searchParams = useSearchParams();
  const { currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<IndividualService[]>([]);

  // Set initial category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    if (categoryParam && CATEGORIES.some(cat => cat.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [searchParams]);

  const discountActive = isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive();
  const discountMultiplier = discountActive ? 0.5 : 1;

  // Filter services based on active tab
  const displayedServices = useMemo(() => {
    if (activeCategory === 'all') return ALL_INDIVIDUAL_SERVICES;
    return ALL_INDIVIDUAL_SERVICES.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  // Toggle item selection
  const toggleItem = (service: IndividualService) => {
    if (selectedItems.find(i => i.id === service.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== service.id));
    } else {
      setSelectedItems([...selectedItems, service]);
    }
  };

  // Calculate Total
  const totalUSD = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const convertedTotal = Math.round(convertPrice(totalUSD * discountMultiplier, currentCurrency.code));

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  const openCheckoutModal = () => {
    if (selectedItems.length === 0) return;
    setShowEmailModal(true);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0 || !email.trim()) return;
    
    setIsProcessing(true);
    setCheckoutError(null);

    try {
      // Build the request payload
      const requestBody = {
        serviceCategory: { 
          title: 'À La Carte Bundle', 
          _id: 'bundle-builder' 
        },
        selectedPackage: {
          name: 'Custom Bundle',
          tier: 'bundle',
          price: totalUSD,
          currency: 'USD'
        },
        selectedAddOns: selectedItems.map(item => ({
          _key: item.id,
          name: item.name,
          price: item.price,
          deliveryTime: item.deliveryTime
        })),
        clientInfo: {
          email: email.trim(),
          company: company.trim() || 'À La Carte Bundle'
        },
        projectDetails: {
          title: 'À La Carte Bundle',
          description: `Selected Services: ${selectedItems.map(i => i.name).join(', ')}`
        },
        currency: currentCurrency.code,
        totalAmount: convertedTotal
      };

      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Checkout failed (${res.status})`);
      }

      const data = await res.json();
      if (data?.url) {
        // Redirect to Paystack
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-6">
        <div className="container mx-auto">
          <Breadcrumb 
            items={[
              { label: 'Services', href: '/services' },
              { label: 'Build Your Bundle' }
            ]} 
            className="mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Build Your Custom Bundle</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Mix and match individual services from any category to create a package that fits your exact needs. 
            <span className="block mt-2 text-lg font-semibold">No rigid packages—just the tasks you need.</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Discount Banner */}
          {discountActive && (
            <div className="border-b border-gray-200">
              <DiscountBanner size="sm" showCountdown={false} showSpots={false} />
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Category Description */}
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {CATEGORIES.find(c => c.id === activeCategory)?.description}
              <span className="ml-2 font-semibold text-gray-800">
                ({displayedServices.length} service{displayedServices.length !== 1 ? 's' : ''} available)
              </span>
            </p>
          </div>

          {/* Service Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service) => {
              const isSelected = selectedItems.some(i => i.id === service.id);
              const basePrice = Math.round(convertPrice(service.price, currentCurrency.code));
              const discountedPrice = Math.round(convertPrice(service.price * discountMultiplier, currentCurrency.code));

              return (
                <div 
                  key={service.id}
                  onClick={() => toggleItem(service)}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 relative group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-blue-500 border-blue-500 scale-110' : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  <div className="pr-8">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-400 mb-4">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.deliveryTime}
                    </div>

                    {/* Pricing */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">${service.price}</div>
                      {discountActive ? (
                        <div className="space-y-0.5">
                          <div className="text-sm text-gray-400 line-through">
                            {currentCurrency.symbol}{basePrice.toLocaleString()}
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {currentCurrency.symbol}{discountedPrice.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-blue-600">
                          {currentCurrency.symbol}{basePrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {displayedServices.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg mb-2">No services in this category yet.</p>
              <p className="text-sm">Check back soon or browse other categories.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary Bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50 animate-slide-up">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Selected List Preview (Mobile Hidden) */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto max-w-2xl scrollbar-hide">
              {selectedItems.map(item => (
                <span 
                  key={item.id} 
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-xs font-medium text-blue-800 whitespace-nowrap"
                >
                  {item.name}
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleItem(item); 
                    }} 
                    className="ml-2 text-blue-600 hover:text-red-500 font-bold transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Total & CTA */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Bundle Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {currentCurrency.symbol}{convertedTotal.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    ≈ ${totalUSD.toLocaleString()} USD
                  </span>
                </div>
                {discountActive && (
                  <p className="text-xs text-green-600 font-semibold">🎉 50% Launch Discount Applied</p>
                )}
              </div>
              <button 
                onClick={openCheckoutModal}
                disabled={selectedItems.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Proceed to Checkout ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explainer Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Use the Bundle Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Pay for What You Need</h3>
              <p className="text-sm text-gray-600">
                No rigid packages. Pick individual tasks from any category and create your perfect bundle.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 mb-1">Transparent Pricing</h3>
              <p className="text-sm text-gray-600">
                Every service has a fixed price. Your total updates live—no surprises, no ranges.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-1">Fast & Focused</h3>
              <p className="text-sm text-gray-600">
                Perfect for specific needs: an audit, a logo, monthly support, or any combination.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Order</h3>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-gray-700 mb-2">Your Bundle:</div>
              <ul className="space-y-1 text-sm text-gray-600 mb-3">
                {selectedItems.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-semibold">${item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">
                    {currentCurrency.symbol}{convertedTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">≈ ${totalUSD.toLocaleString()} USD</div>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company / Project Name (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Error Display */}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{checkoutError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setCheckoutError(null);
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || !email.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuildYourBundlePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
      <BundleBuilderContent />
    </Suspense>
  );
}
