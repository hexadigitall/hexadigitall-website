'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogBackdrop } from '@headlessui/react';
import JourneyHeader from '@/components/services/JourneyHeader';
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service';

import type { IndividualService } from '@/data/individualServices';
import Breadcrumb from '@/components/ui/Breadcrumb';
import TierSelectionModal from '@/components/services/TierSelectionModal';
import UnifiedServiceRequestFlow from '@/components/services/UnifiedServiceRequestFlow';
import { useCurrency } from '@/contexts/CurrencyContext';
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay';
import { getWhatsAppLink } from '@/lib/whatsapp';

// --- Types ---

interface CompleteServicePageProps {
  pageTitle: string
  pageDescription: string
  heroGradient: string
  bannerBackgroundImage?: string
  accentColor: 'pink' | 'blue' | 'purple' | 'green' | 'indigo' | 'orange'
  categoryIcon: React.ReactNode
  breadcrumbItems: { label: string; href?: string }[]
  packageGroups: ServicePackageGroup[]
  individualServices: IndividualService[]
  serviceType: string
  slug: string
}

export default CompleteServicePage;

// --- Visual Config ---

const accentColors = {
  pink: { from: 'from-pink-500', to: 'to-red-500', bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-600', light: 'bg-pink-50', hoverBg: 'hover:bg-pink-600', ring: 'ring-pink-200' },
  blue: { from: 'from-blue-600', to: 'to-indigo-600', bg: 'bg-blue-600', border: 'border-blue-600', text: 'text-blue-600', light: 'bg-blue-50', hoverBg: 'hover:bg-blue-700', ring: 'ring-blue-200' },
  purple: { from: 'from-purple-600', to: 'to-violet-600', bg: 'bg-purple-600', border: 'border-purple-600', text: 'text-purple-600', light: 'bg-purple-50', hoverBg: 'hover:bg-purple-700', ring: 'ring-purple-200' },
  green: { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-700', ring: 'ring-emerald-200' },
  indigo: { from: 'from-indigo-500', to: 'to-blue-500', bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-700', ring: 'ring-indigo-200' },
  orange: { from: 'from-orange-500', to: 'to-amber-500', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', light: 'bg-orange-50', hoverBg: 'hover:bg-orange-700', ring: 'ring-orange-200' }
}

const INITIAL_SERVICES_LIMIT = 3;

// --- Helper: Determine Journey Stage ---
const getJourneyStage = (serviceType: string): 'idea' | 'build' | 'grow' => {
  const type = serviceType.toLowerCase();
  if (['business', 'consulting', 'branding'].includes(type)) return 'idea';
  if (['marketing', 'social'].includes(type)) return 'grow';
  return 'build'; // Default for 'web', 'profile', 'app'
};

// --- Helper Component: Sticky CTA for Mobile ---
const StickyServiceCTA = ({ 
  price, 
  onChat, 
  onBuy, 
  currencyCode 
}: { 
  price: number, 
  onChat: () => void, 
  onBuy: () => void,
  currencyCode: string
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past the hero/intro)
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[60] md:hidden animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Starting at</span>
          <span className="font-bold text-lg text-blue-600 leading-tight">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }).format(price)}
          </span>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <button 
            onClick={onChat}
            className="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 active:scale-95 transition-all flex-shrink-0 border border-green-200"
            aria-label="Chat on WhatsApp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
          <button 
            onClick={onBuy}
            className="flex-1 bg-blue-600 text-white font-bold rounded-xl py-3 text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
function CompleteServicePage(props: CompleteServicePageProps) {
  const [selectedIndividualService, setSelectedIndividualService] = useState<IndividualService | null>(null);
  const [shareModal, setShareModal] = useState<{ open: boolean; title: string; url: string; ogImage?: string } | null>(null);
  const {
    pageTitle,
    pageDescription,
    heroGradient,
    bannerBackgroundImage,
    accentColor,
    categoryIcon,
    breadcrumbItems,
    packageGroups,
    individualServices,
    serviceType
  } = props;
  const { currentCurrency } = useCurrency();
  const [selectedGroup, setSelectedGroup] = useState<ServicePackageGroup | null>(null);
  const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null);
  const [showRequestFlow, setShowRequestFlow] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'bundle' | 'packages'>('packages');
  const [showAllServices, setShowAllServices] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  // Find lowest price for sticky CTA (use discounted local currency value)
  const allTiers = packageGroups.flatMap((g: ServicePackageGroup) => g.tiers as ServicePackageTier[] || []);
  const lowestTier = allTiers.reduce((min: number, t: ServicePackageTier) => (t && typeof t.price === 'number' && t.price < min ? t.price : min), Infinity);
  const lowestPriceUSD = isFinite(lowestTier) ? lowestTier : 0;
  const { formatPriceWithDiscount } = useCurrency();
  // Removed unused priceInfo

  // WhatsApp action for lowest package (always use current currency)
  const handleWhatsApp = () => {
    const priceInCurrentCurrency = formatPriceWithDiscount(lowestPriceUSD, { currency: currentCurrency.code, applyNigerianDiscount: true });
    const msg = `Hello Hexadigitall! I'm interested in the ${pageTitle} service starting at ${priceInCurrentCurrency.discountedPrice}. Can you provide more details?`;
    window.open(getWhatsAppLink(msg), '_blank');
  };

  // Buy action for lowest package
  const handleBuy = () => {
    if (packageGroups.length > 0) {
      setSelectedGroup(packageGroups[0]);
    }
  };

  // Handle tier selection from modal
  const handleTierSelect = (tier: ServicePackageTier) => {
    setSelectedTier(tier);
    setShowRequestFlow(true);
  };

  // Close modal/request flow
  const handleCloseModal = () => {
    setSelectedGroup(null);
    setSelectedTier(null);
    setShowRequestFlow(false);
  };

  // --- Scroll to section on tab click ---
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
    }
  };

  // --- Sticky Tab Navigation ---
  useEffect(() => {
    const handleScroll = () => {
      if (!tabNavRef.current) return;
      const { top } = tabNavRef.current.getBoundingClientRect();
      tabNavRef.current.classList.toggle('sticky', top <= 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <JourneyHeader currentStage={getJourneyStage(serviceType)} />
      <div className="relative pt-32 pb-24 overflow-hidden text-white">
        {bannerBackgroundImage && (
          <div
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.32) 100%), url('${bannerBackgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            aria-hidden="true"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${heroGradient} z-10`} aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px] z-20" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-30">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {categoryIcon && (
              <span className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 text-4xl">
                {categoryIcon}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>{pageTitle}</h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto drop-shadow-md" style={{color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 6px rgba(0,0,0,0.12)'}}>{pageDescription}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50 z-40" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
      </div>

      {/* --- Sticky Tab Navigation --- */}
      <div ref={tabNavRef} className="w-full bg-white z-30 shadow-sm sticky top-0 transition-all duration-200">
        <div className="container mx-auto px-4 flex justify-center gap-2 py-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'individual' ? accentColors[accentColor].bg + ' text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => { setActiveTab('individual'); scrollToSection('individual-services-section'); }}
          >Individual Services</button>
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'bundle' ? accentColors[accentColor].bg + ' text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => { setActiveTab('bundle'); scrollToSection('build-bundle-section'); }}
          >Build Bundle</button>
          <button
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'packages' ? accentColors[accentColor].bg + ' text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => { setActiveTab('packages'); scrollToSection('package-groups-section'); }}
          >Complete Packages</button>
        </div>
      </div>

      {/* --- Package Groups Section --- */}
      <section id="package-groups-section" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choose a Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packageGroups.map((group: ServicePackageGroup) => {
            const groupLowest = (group.tiers as ServicePackageTier[] || []).reduce((min: number, t: ServicePackageTier) => (t && typeof t.price === 'number' && t.price < min ? t.price : min), Infinity);
            // Removed unused groupPriceInfo
            return (
              <div key={typeof group.key === 'string' ? group.key : group.key?.current || group.name} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  {isFinite(groupLowest) && (
                    <StartingAtPriceDisplay price={groupLowest} size="md" showDiscount={true} />
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {(group.tiers?.[0]?.features || []).slice(0, 5).map((feature: any, idx: number) => {
                    let featureText = '';
                    if (typeof feature === 'string') featureText = feature;
                    else if (feature && typeof feature === 'object' && ('title' in feature || 'description' in feature)) {
                      featureText = (feature as { title?: string; description?: string }).title || (feature as { title?: string; description?: string }).description || '';
                    }
                    return (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className={`w-4 h-4 text-${accentColor}-500 mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {featureText}
                      </li>
                    );
                  })}
                  {(group.tiers?.[0]?.features?.length || 0) > 5 && (
                    <li className="text-xs text-gray-400 italic">+{(group.tiers?.[0]?.features?.length || 0) - 5} more features</li>
                  )}
                </ul>
                <div className="flex gap-2 mt-auto">
                  <button
                    className={`bg-gradient-to-r from-${accentColor}-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-${accentColor}-600 hover:to-indigo-600 transition-colors`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    View Options
                  </button>
                  <button
                    className="bg-green-100 text-green-700 font-semibold rounded-xl py-3 px-4 hover:bg-green-200 transition-colors"
                    onClick={() => {
                      const groupPriceInCurrentCurrency = formatPriceWithDiscount(groupLowest, { currency: currentCurrency.code, applyNigerianDiscount: true });
                      const msg = `Hello Hexadigitall! I'm interested in the ${group.tiers?.[0]?.name || group.name} package for ${pageTitle} starting at ${groupPriceInCurrentCurrency.discountedPrice}. Can you provide more details?`;
                      window.open(getWhatsAppLink(msg), '_blank');
                    }}
                  >
                    Chat on WhatsApp
                  </button>
                  {/* Share button for this package/tier */}
                  {group.tiers?.[0]?.ogImage?.asset?.url && (
                    <button
                      className="bg-gray-100 text-gray-700 rounded-xl py-3 px-4 hover:bg-gray-200 transition-colors flex items-center gap-2"
                      onClick={() => setShareModal({
                        open: true,
                        title: `${group.name} – ${group.tiers?.[0]?.tier || ''}`,
                        url: typeof window !== 'undefined' ? window.location.href : '',
                        ogImage: group.tiers[0]?.ogImage?.asset?.url
                      })}
                      aria-label="Share this package"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a6 6 0 10-12 0 6 6 0 0012 0zm-6 6v-6" /></svg>
                      Share
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Share Modal for ogImage preview and link copy */}
      {shareModal?.open && (
        <Dialog open={shareModal.open} onClose={() => setShareModal(null)} className="fixed z-[100] inset-0 flex items-center justify-center">
          <DialogBackdrop className="fixed inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full z-10 flex flex-col items-center">
            {shareModal.ogImage && (
              <Image src={shareModal.ogImage} alt="Share preview" width={800} height={300} className="w-full h-48 object-cover rounded-xl mb-4 border" />
            )}
            <h3 className="text-lg font-bold mb-2 text-center">Share: {shareModal.title}</h3>
            <input
              className="w-full border rounded px-3 py-2 mb-3 text-sm text-gray-700 bg-gray-100"
              value={shareModal.url}
              readOnly
              onFocus={e => e.target.select()}
            />
            <button
              className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => { navigator.clipboard.writeText(shareModal.url); }}
            >Copy Link</button>
            <button
              className="mt-4 text-gray-500 hover:text-gray-700 text-xs"
              onClick={() => setShareModal(null)}
            >Close</button>
          </div>
        </Dialog>
      )}

      {/* --- Individual Services Section --- */}
      {individualServices && individualServices.length > 0 && (
        <section id="individual-services-section" className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Or Pick an Individual Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showAllServices ? individualServices : individualServices.slice(0, INITIAL_SERVICES_LIMIT)).map((service) => (
              <div key={service.name} className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                <div className="mb-4">
                  <StartingAtPriceDisplay price={service.price} size="sm" showDiscount={true} />
                  <p className="text-xs text-gray-500 mt-1">Delivery: {service.deliveryTime}</p>
                </div>
                <ul className="space-y-1 mb-6">
                  {(service.features || []).slice(0, 4).map((feature, idx) => {
                    let featureText = '';
                    if (typeof feature === 'string') featureText = feature;
                    else if (feature && typeof feature === 'object' && ('title' in feature || 'description' in feature)) {
                      featureText = (feature as { title?: string; description?: string }).title || (feature as { title?: string; description?: string }).description || '';
                    }
                    return (
                      <li key={idx} className="flex items-center text-xs text-gray-600">
                        <svg className={`w-3 h-3 text-${accentColor}-500 mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {featureText}
                      </li>
                    );
                  })}
                  {(service.features?.length || 0) > 4 && (
                    <li className="text-xs text-gray-400 italic">+{(service.features?.length || 0) - 4} more features</li>
                  )}
                </ul>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="bg-blue-600 text-white font-semibold rounded-xl py-3 px-4 hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setSelectedIndividualService(service);
                      setShowRequestFlow(true);
                    }}
                  >
                    Buy Now
                  </button>
                  <button
                    className="bg-green-100 text-green-700 font-semibold rounded-xl py-3 px-4 hover:bg-green-200 transition-colors"
                    onClick={() => {
                      const servicePriceInCurrentCurrency = formatPriceWithDiscount(service.price, { currency: currentCurrency.code, applyNigerianDiscount: true });
                      const msg = `Hello Hexadigitall! I'm interested in the ${service.name} service for ${pageTitle} starting at ${servicePriceInCurrentCurrency.discountedPrice}. Can you provide more details?`;
                      window.open(getWhatsAppLink(msg), '_blank');
                    }}
                  >
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Universal Show More button for all screen sizes */}
          {individualServices.length > INITIAL_SERVICES_LIMIT && !showAllServices && (
            <div className="flex justify-center mt-6">
              <button
                className={`px-6 py-2 rounded-full font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors`}
                onClick={() => setShowAllServices(true)}
              >
                Show {individualServices.length - INITIAL_SERVICES_LIMIT} More
              </button>
            </div>
          )}
        </section>
      )}
      {/* --- Build Bundle CTA Card --- */}
      <section id="build-bundle-section" className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl shadow-md p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">Global À La Carte Builder</h2>
            <p className="text-gray-700 mb-4">Mix and match any services to create your own custom bundle. Get instant pricing and recommendations.</p>
            <Link href="/services/build-bundle" className="bg-indigo-600 text-white font-semibold rounded-xl py-3 px-6 hover:bg-indigo-700 transition-colors">Start Building</Link>
          </div>
        </div>
      </section>
      {/* --- Software Configurator Link (Web & Mobile only) --- */}
      {['web', 'mobile', 'web & mobile'].includes(serviceType.toLowerCase()) && (
        <div className="container mx-auto px-4 py-6 flex justify-center">
          <Link href="/software-configurator" className="bg-green-600 text-white font-semibold rounded-xl py-3 px-6 hover:bg-green-700 transition-colors shadow-md">Try the Software Configurator</Link>
        </div>
      )}

      {/* --- Sticky Mobile CTA --- */}
      {!(showRequestFlow || selectedGroup || selectedIndividualService) && (
        <StickyServiceCTA
          price={parseFloat(formatPriceWithDiscount(lowestPriceUSD, { currency: currentCurrency.code, applyNigerianDiscount: true }).discountedPrice.replace(/[^0-9.]/g, ''))}
          onChat={handleWhatsApp}
          onBuy={handleBuy}
          currencyCode={currentCurrency.code}
        />
      )}

      {/* --- Tier Selection Modal --- */}
      {selectedGroup && !showRequestFlow && (
        <TierSelectionModal
          packageGroup={selectedGroup}
          onTierSelect={handleTierSelect}
          onClose={handleCloseModal}
        />
      )}

      {/* --- Unified Service Request Flow --- */}
      {showRequestFlow && selectedTier && (
        <UnifiedServiceRequestFlow
          serviceId={typeof selectedGroup?.key === 'string' ? selectedGroup.key : selectedGroup?.key?.current || 'service'}
          serviceName={selectedGroup?.name || pageTitle}
          serviceType="tiered"
          tier={selectedTier}
          onClose={handleCloseModal}
        />
      )}
      {showRequestFlow && selectedIndividualService && (
        <UnifiedServiceRequestFlow
          serviceId={selectedIndividualService.id}
          serviceName={selectedIndividualService.name}
          serviceType="individual"
          tier={undefined}
          onClose={() => {
            setShowRequestFlow(false);
            setSelectedIndividualService(null);
          }}
        />
      )}
    </div>
  );
}