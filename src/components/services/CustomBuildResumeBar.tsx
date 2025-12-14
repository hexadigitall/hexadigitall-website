'use client';

import { useCustomBuild } from '@/contexts/CustomBuildContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * CustomBuildResumeBar
 * Displays when user has in-progress custom build and allows them to resume
 */
export function CustomBuildResumeBar() {
  const { state } = useCustomBuild();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const DISMISS_KEY = 'hexadigitall_custom_build_resume_dismissed';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Only show if user has real progress beyond step 1,
      // or has selected core/add-ons, and hasn't dismissed.
      const dismissed = typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === 'true';
      const hasProgress = (state.step && state.step >= 2) || !!state.core || (Array.isArray(state.addOns) && state.addOns.length > 0);
      setIsVisible(!dismissed && !!hasProgress);
    }
  }, [state, isMounted]);

  if (!isMounted || !isVisible) return null;

  const stepLabels: Record<number, string> = {
    1: 'Core Selection',
    2: 'Add-ons Selection',
    3: 'Review Summary'
  };

  return (
    <div className="sticky top-[80px] z-40 bg-gradient-to-r from-primary/95 to-primary/90 text-white px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm font-medium truncate">
            Custom Build in Progress:{' '}
            <span className="font-semibold">{stepLabels[state.step]}</span>
            {state.core && (
              <span className="ml-2 text-white/80">
                • {state.core.charAt(0).toUpperCase() + state.core.slice(1)}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/services/custom-build?step=${state.step}${state.core ? `&core=${state.core}` : ''}${state.addOns.length > 0 ? `&addOns=${encodeURIComponent(JSON.stringify(state.addOns))}` : ''}`}
            className="px-4 py-1.5 bg-white text-primary font-semibold rounded-lg hover:bg-white/95 transition-colors text-sm whitespace-nowrap"
          >
            Resume
          </Link>
          <button
            onClick={() => {
              // Persist dismissal until user makes new progress
              try {
                localStorage.setItem(DISMISS_KEY, 'true');
              } catch {}
              // If no meaningful progress, also clear any stale build state elsewhere
              // (context will handle absence gracefully)
              setIsVisible(false);
            }}
            className="px-2 py-1 hover:bg-white/20 rounded transition-colors text-sm"
            aria-label="Dismiss resume notification"
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
