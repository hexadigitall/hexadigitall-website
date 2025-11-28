'use client';

import type { SelectedAddOn } from '../types';

interface Step2AddOnsProps {
  selectedAddOns: SelectedAddOn[];
  onAddOnsChange: (addOns: SelectedAddOn[]) => void;
  onProceed: () => void;
  onBack: () => void;
}

const ADDON_OPTIONS = [
  {
    id: 'seo',
    name: 'SEO Optimization',
    description: 'Comprehensive SEO setup and optimization for search engines',
    price: 299,
    features: ['Keyword research', 'Meta optimization', 'Sitemap setup', 'Analytics integration']
  },
  {
    id: 'logo',
    name: 'Logo Design',
    description: 'Professional brand logo design with multiple variations',
    price: 199,
    features: ['Concept design', 'Revisions', 'Multiple formats', 'Brand guidelines']
  },
  {
    id: 'maintenance',
    name: 'Maintenance Package',
    description: 'Monthly maintenance and updates for your application',
    price: 149,
    features: ['Security updates', 'Bug fixes', 'Performance monitoring', 'Priority support']
  },
  {
    id: 'security',
    name: 'Security Hardening',
    description: 'Enhanced security features and protections',
    price: 249,
    features: ['SSL certificate', 'Data encryption', 'Backup system', 'Firewall setup']
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Detailed analytics and reporting dashboard',
    price: 179,
    features: ['Real-time tracking', 'Custom reports', 'User behavior analysis', 'Conversion tracking']
  },
  {
    id: 'training',
    name: 'Team Training',
    description: 'Training sessions for your team on how to use the application',
    price: 199,
    features: ['Live sessions', 'Documentation', 'Video tutorials', 'Email support']
  }
];

export default function Step2AddOns({
  selectedAddOns,
  onAddOnsChange,
  onProceed,
  onBack
}: Step2AddOnsProps) {
  const handleToggleAddOn = (addon: SelectedAddOn) => {
    const exists = selectedAddOns.some(a => a.id === addon.id);
    if (exists) {
      onAddOnsChange(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      onAddOnsChange([...selectedAddOns, addon]);
    }
  };

  const totalAddOnPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-primary">
          Add Optional Features
        </h2>
        <p className="text-lg text-darkText/70">
          Enhance your project with these optional add-ons. You can always add them later!
        </p>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {ADDON_OPTIONS.map((addonOption) => {
          const isSelected = selectedAddOns.some(a => a.id === addonOption.id);
          return (
            <button
              key={addonOption.id}
              onClick={() =>
                handleToggleAddOn({
                  id: addonOption.id,
                  name: addonOption.name,
                  price: addonOption.price
                })
              }
              className={`group relative text-left p-6 rounded-lg border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-accent bg-gradient-to-br from-accent/5 to-secondary/5 shadow-md'
                  : 'border-gray-200 hover:border-accent/50 bg-white hover:shadow-sm'
              }`}
              type="button"
              aria-pressed={isSelected}
            >
              {/* Checkmark */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-accent border-accent text-white'
                  : 'border-gray-300'
              }`}>
                {isSelected && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>

              {/* Content */}
              <div className="pr-8">
                <h3 className={`text-lg font-bold mb-1 transition-colors ${
                  isSelected ? 'text-accent' : 'text-darkText'
                }`}>
                  {addonOption.name}
                </h3>
                <p className="text-sm text-darkText/70 mb-4">
                  {addonOption.description}
                </p>

                {/* Features */}
                <ul className="space-y-1 mb-4">
                  {addonOption.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-darkText/70">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <p className="font-bold text-accent text-lg">
                  +${addonOption.price}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-darkText/70 mb-1">Additional Add-ons Selected</p>
            <p className="text-3xl font-bold text-primary">
              +${totalAddOnPrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-accent mb-1">
              {selectedAddOns.length}
            </p>
            <p className="text-sm text-darkText/70">
              {selectedAddOns.length === 1 ? 'add-on' : 'add-ons'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg font-semibold text-darkText hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onProceed}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          View Summary & Pricing →
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900 text-sm">
          💡 <strong>Tip:</strong> Add-ons can be modified later. Proceed to the summary to see your total investment and submit your request.
        </p>
      </div>
    </div>
  );
}
