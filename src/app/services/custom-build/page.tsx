'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import step components for better code splitting
const Step1Core = dynamic(() => import('./steps/Step1Core'), { ssr: true });
const Step2AddOns = dynamic(() => import('./steps/Step2AddOns'), { ssr: true });
const Step3Summary = dynamic(() => import('./steps/Step3Summary'), { ssr: true });

import type { CoreType, SelectedAddOn } from './types';

const STORAGE_KEY = 'hexadigitall_custom_build';

function CustomBuildInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCore, setSelectedCore] = useState<CoreType>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from URL or localStorage
  useEffect(() => {
    const step = parseInt(searchParams.get('step') || '1', 10);
    const core = (searchParams.get('core') || null) as CoreType;
    const addOnsParam = searchParams.get('addOns');

    let addOns: SelectedAddOn[] = [];
    if (addOnsParam) {
      try {
        addOns = JSON.parse(decodeURIComponent(addOnsParam));
      } catch {
        // Fall back to localStorage if URL param is invalid
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { addOns: storedAddOns } = JSON.parse(stored);
          addOns = storedAddOns || [];
        }
      }
    } else {
      // Try localStorage as fallback
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { step: storedStep, core: storedCore, addOns: storedAddOns } = JSON.parse(stored);
        setCurrentStep(storedStep || step);
        setSelectedCore(storedCore || core);
        setSelectedAddOns(storedAddOns || addOns);
        setIsLoading(false);
        return;
      }
    }

    setCurrentStep(step);
    setSelectedCore(core);
    setSelectedAddOns(addOns);
    setIsLoading(false);
  }, [searchParams]);

  // Persist state to URL and localStorage
  const updateState = (step: number, core: CoreType, addOns: SelectedAddOn[]) => {
    setCurrentStep(step);
    setSelectedCore(core);
    setSelectedAddOns(addOns);

    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, core, addOns })
    );

    // Update URL
    const params = new URLSearchParams();
    params.set('step', step.toString());
    if (core) params.set('core', core);
    if (addOns.length > 0) params.set('addOns', encodeURIComponent(JSON.stringify(addOns)));
    router.push(`?${params.toString()}`);
  };

  const handleCoreSelect = (core: CoreType) => {
    updateState(2, core, selectedAddOns);
  };

  const handleAddOnsChange = (addOns: SelectedAddOn[]) => {
    updateState(currentStep, selectedCore, addOns);
  };

  const handleProceedToSummary = () => {
    updateState(3, selectedCore, selectedAddOns);
  };

  const handleBack = (step: number) => {
    updateState(step, selectedCore, selectedAddOns);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    router.push('?step=1');
    updateState(1, null, []);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-darkText">Loading your progress...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-8">
            <Link
              href="/services/web-and-mobile-software-development"
              className="inline-flex items-center text-primary hover:underline mb-4 text-sm font-semibold"
            >
              ← Back to Web & Mobile
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-primary">
              Build Your Custom Solution
            </h1>
            <p className="text-lg text-darkText/70">
              Answer a few quick questions to get a personalized quote for your project.
            </p>
          </div>

          {/* Progress Bar - Make steps clickable to navigate backward */}
          <div className="flex items-center gap-2 md:gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => {
                    if (step < currentStep) {
                      handleBack(step);
                    }
                  }}
                  disabled={step > currentStep}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
                    step < currentStep
                      ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700'
                      : step === currentStep
                      ? 'bg-primary text-white cursor-default'
                      : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  }`}
                  aria-label={`Go to step ${step}`}
                  type="button"
                >
                  {step < currentStep ? '✓' : step}
                </button>
                <span
                  className={`hidden md:block text-sm font-medium ${
                    step <= currentStep ? 'text-darkText' : 'text-gray-500'
                  }`}
                >
                  {step === 1 ? 'Core' : step === 2 ? 'Add-ons' : 'Summary'}
                </span>
                {step < 3 && (
                  <div
                    className={`hidden md:flex-1 md:block h-0.5 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          {currentStep === 1 && (
            <Step1Core
              selectedCore={selectedCore}
              onCoreSelect={handleCoreSelect}
            />
          )}

          {currentStep === 2 && selectedCore && (
            <Step2AddOns
              selectedAddOns={selectedAddOns}
              onAddOnsChange={handleAddOnsChange}
              onProceed={handleProceedToSummary}
              onBack={() => handleBack(1)}
            />
          )}

          {currentStep === 3 && selectedCore && (
            <Step3Summary
              coreType={selectedCore}
              selectedAddOns={selectedAddOns}
              onBack={() => handleBack(2)}
              onReset={handleReset}
            />
          )}
        </div>
      </section>

      {/* Footer CTA */}
      {currentStep === 1 && (
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-6 text-center">
            <p className="text-darkText/70">
              Want to see pre-built packages instead?{' '}
              <Link
                href="/services/web-and-mobile-software-development"
                className="text-primary font-semibold hover:underline"
              >
                Browse our tiers
              </Link>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default function CustomBuildPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-darkText">Loading your progress...</p>
        </div>
      </main>
    }>
      <CustomBuildInner />
    </Suspense>
  );
}
