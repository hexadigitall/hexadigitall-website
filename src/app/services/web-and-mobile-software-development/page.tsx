'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WEB_DEV_PACKAGE_GROUPS } from '@/data/servicePackages';
import TierSelectionModal from '@/components/services/TierSelectionModal';
import { ServiceRequestFlow, ServiceCategory as LegacyServiceCategory } from '@/components/services/ServiceRequestFlow';
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service';
import { useCurrency } from '@/contexts/CurrencyContext';


export default function WebMobileDevelopmentPage() {
  const [selectedGroup, setSelectedGroup] = useState<ServicePackageGroup | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null);
  const [showRequestFlow, setShowRequestFlow] = useState(false);
  const { currentCurrency, convertPrice } = useCurrency();

  const handleGroupSelect = (group: ServicePackageGroup) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleTierSelect = (tier: ServicePackageTier) => {
    if (tier) {
      setSelectedTier(tier);
      setShowRequestFlow(true);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
  };

  // Convert tier to legacy service category for ServiceRequestFlow
  const createServiceCategoryFromTier = (): LegacyServiceCategory | null => {
    if (!selectedTier || !selectedGroup) return null;

    return {
      _id: selectedGroup.key?.current || 'tier-service',
      title: selectedGroup.name,
      slug: { current: selectedGroup.key?.current || '' },
      description: selectedGroup.description || 'Service package',
      icon: '📦',
      featured: true,
      serviceType: 'general',
      packages: [
        {
          _key: selectedTier._key,
          name: selectedTier.name,
          tier: selectedTier.tier,
          price: selectedTier.price,
          currency: selectedTier.currency,
          billing: selectedTier.billing,
          deliveryTime: selectedTier.deliveryTime || '7-14 days',
          features: selectedTier.features || [],
          popular: selectedTier.popular || false
        }
      ]
    }
  };

  const serviceCategory = showRequestFlow ? createServiceCategoryFromTier() : null;

  // Get minimum price for "Starting at" display
  const getMinPrice = (group: ServicePackageGroup) => {
    if (group.tiers.length === 0) return 0;
    const minTier = group.tiers.reduce((min, tier) => 
      tier.price < min.price ? tier : min
    );
    return convertPrice(minTier.price, currentCurrency.code);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-primary">
              Web & Mobile Development
            </h1>
            <p className="text-xl text-darkText/80 mb-4">
              Transform your digital vision into reality with our custom web and mobile solutions. 
              From landing pages to enterprise applications, we build scalable, user-friendly products.
            </p>
            <p className="text-lg text-darkText/70">
              Choose a package below or{' '}
              <Link href="/services/custom-build" className="text-accent font-semibold hover:underline">
                create a custom solution
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary">
              Choose Your Solution
            </h2>
            <p className="text-lg text-darkText/70 max-w-2xl mx-auto">
              Select a package type below to see available tiers and pricing. 
              Each package includes multiple tier options to fit your budget and timeline.
            </p>
          </div>

          {/* Package Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WEB_DEV_PACKAGE_GROUPS.map((group) => {
              const minPrice = getMinPrice(group);
              const keyValue = typeof group.key === 'object' && group.key.current 
                ? group.key.current 
                : String(group.key);

              return (
                <div
                  key={keyValue}
                  className="group relative bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleGroupSelect(group)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${group.name} package`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleGroupSelect(group);
                    }
                  }}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold font-heading text-primary mb-2">
                      {group.name}
                    </h3>
                    <p className="text-darkText/70 mb-6 min-h-[3rem]">
                      {group.description}
                    </p>

                    {/* Pricing Display */}
                    <div className="mb-6">
                      <p className="text-sm text-darkText/60 mb-1">Starting at</p>
                      <p className="text-3xl md:text-4xl font-bold text-accent">
                        {currentCurrency.symbol}{Math.round(minPrice)}
                        <span className="text-lg text-darkText/70 font-normal ml-2">
                          {currentCurrency.code}
                        </span>
                      </p>
                    </div>

                    {/* Features Preview */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-darkText/80 mb-2">Includes:</p>
                      <ul className="space-y-1 text-sm text-darkText/70">
                        {group.tiers[0]?.features?.slice(0, 3).map((feature, idx) => {
                          const featureText = typeof feature === 'string' ? feature : feature?.title || '';
                          return (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-600 mr-2 mt-0.5">✓</span>
                              <span>{featureText}</span>
                            </li>
                          );
                        })}
                        {(group.tiers[0]?.features?.length || 0) > 3 && (
                          <li className="text-primary font-semibold mt-2">
                            + {(group.tiers[0]?.features?.length || 0) - 3} more features in tiers
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors group-hover:shadow-md">
                      View Tiers & Pricing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-12 text-center text-primary">
            Why Choose Our Web & Mobile Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fast Delivery',
                description: 'Get your project launched quickly with our streamlined development process and clear timelines.',
                icon: '⚡'
              },
              {
                title: 'Scalable & Secure',
                description: 'Built with modern technologies and best practices for security, performance, and future growth.',
                icon: '🔒'
              },
              {
                title: 'User-Focused Design',
                description: 'Beautiful, intuitive interfaces that your users will love and that convert visitors to customers.',
                icon: '🎨'
              },
              {
                title: 'Full Support',
                description: 'Ongoing support and maintenance options to keep your application running smoothly.',
                icon: '🤝'
              },
              {
                title: 'Transparent Pricing',
                description: 'No hidden fees. Clear pricing tiers to match your budget and timeline.',
                icon: '💰'
              },
              {
                title: 'Nigerian Expertise',
                description: 'Local team that understands the Nigerian market and can be reached during your business hours.',
                icon: '🇳🇬'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold font-heading text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-darkText/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Not sure which package is right for you?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Build a custom solution tailored to your exact needs and budget.
          </p>
          <Link
            href="/services/custom-build"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
          >
            Start Custom Builder
          </Link>
        </div>
      </section>

      {/* Tier Selection Modal */}
      {showModal && selectedGroup && (
        <TierSelectionModal
          packageGroup={selectedGroup}
          onTierSelect={handleTierSelect}
          onClose={handleCloseModal}
        />
      )}

      {/* Service Request Flow */}
      {showRequestFlow && serviceCategory && (
        <ServiceRequestFlow
          serviceCategory={serviceCategory}
          onClose={() => {
            setShowRequestFlow(false);
            setSelectedTier(null);
          }}
        />
      )}
    </main>
  );
}