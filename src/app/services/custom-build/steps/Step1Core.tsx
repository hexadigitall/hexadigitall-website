'use client';

import type { CoreType } from '../types';

interface Step1CoreProps {
  selectedCore: CoreType;
  onCoreSelect: (core: CoreType) => void;
}

const CORE_OPTIONS = [
  {
    id: 'web',
    title: 'Web Only',
    description: 'Build a powerful web application or website for your business.',
    features: [
      'Responsive design',
      'SEO optimized',
      'Database integration',
      'User authentication',
      'Performance optimized'
    ],
    icon: '🌐',
    badge: 'Most Popular'
  },
  {
    id: 'mobile',
    title: 'Mobile Only',
    description: 'Create a native mobile app for iOS and/or Android platforms.',
    features: [
      'Native performance',
      'App store distribution',
      'Push notifications',
      'Offline functionality',
      'Platform optimization'
    ],
    icon: '📱',
    badge: null
  },
  {
    id: 'both',
    title: 'Web + Mobile',
    description: 'Get both a web platform and mobile apps with shared backend.',
    features: [
      'Unified backend',
      'Web + app experience',
      'Synchronized data',
      'Consistent branding',
      'Comprehensive coverage'
    ],
    icon: '🚀',
    badge: 'Best Value'
  }
];

export default function Step1Core({ selectedCore, onCoreSelect }: Step1CoreProps) {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3 sm:mb-4 text-primary">
          What Would You Like to Build?
        </h2>
        <p className="text-base sm:text-lg text-darkText/70">
          Select the core technology you need for your project.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {CORE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onCoreSelect(option.id as CoreType)}
            className={`group relative text-left p-4 sm:p-6 md:p-8 rounded-xl border-2 transition-all duration-300 min-h-[44px] ${
              selectedCore === option.id
                ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg'
                : 'border-gray-200 hover:border-primary/50 bg-white hover:shadow-md active:scale-[0.98]'
            }`}
            aria-pressed={selectedCore === option.id}
            type="button"
          >
            {/* Badge */}
            {option.badge && (
              <div className="absolute -top-3 right-2 sm:right-4 bg-accent text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                {option.badge}
              </div>
            )}

            {/* Icon */}
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{option.icon}</div>

            {/* Title */}
            <h3 className={`text-xl sm:text-2xl font-bold font-heading mb-2 transition-colors ${
              selectedCore === option.id ? 'text-primary' : 'text-darkText'
            }`}>
              {option.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-darkText/70 mb-4 sm:mb-6 min-h-[2.5rem] sm:min-h-[3rem]">
              {option.description}
            </p>

            {/* Features */}
            <div className="space-y-1.5 sm:space-y-2">
              {option.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-darkText/70">
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0 ${
                      selectedCore === option.id ? 'text-primary' : 'text-green-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            {/* Selection Indicator */}
            {selectedCore === option.id && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary/20">
                <p className="text-primary font-semibold text-xs sm:text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Help Text */}
      {selectedCore && (
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 font-medium text-sm sm:text-base">
            ✓ You&apos;ve selected <strong>{CORE_OPTIONS.find(o => o.id === selectedCore)?.title}</strong>
          </p>
          <p className="text-blue-800 text-xs sm:text-sm mt-2">
            Click Next to add optional features and get an instant quote.
          </p>
        </div>
      )}
    </div>
  );
}
