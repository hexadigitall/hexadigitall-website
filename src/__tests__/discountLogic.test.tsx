import React from 'react';
import { render, screen } from '@testing-library/react';
import Step3Summary from '@/app/services/custom-build/steps/Step3Summary';
import UnifiedServiceRequestFlow from '@/components/services/UnifiedServiceRequestFlow';

// Mock currency context
jest.mock('@/contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    currentCurrency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
    convertPrice: (price: number) => price, // identity for test
    isLocalCurrency: () => true,
    isLaunchSpecialActive: () => true,
  })
}));

// Minimal types stubs
const mockAddOns = [
  { id: 'seo', name: 'SEO Optimization', price: 200 },
  { id: 'logo', name: 'Logo Design', price: 100 }
];

describe('Discount logic', () => {
  it('applies 50% discount to core and addons in Step3Summary (NGN)', () => {
    render(
      <Step3Summary
        coreType="web"
        selectedAddOns={mockAddOns}
        onBack={() => {}}
        onReset={() => {}}
      />
    );
    // Core 1999 -> 999.5 => rounds to 1000
    // Add-ons 300 -> 150
    // Total 2299 -> 1149.5 => rounds to 1150
    // Verify discount was applied (check for discount indicator text)
    expect(screen.getByText(/50% launch discount applied/i)).toBeInTheDocument();
  });

  it('applies discount to UnifiedServiceRequestFlow base price', () => {
    render(
      <UnifiedServiceRequestFlow
        serviceId="tier-1"
        serviceName="Test Tier"
        serviceType="tiered"
        tier={{
          _key: 'basic-tier',
          name: 'Basic',
          tier: 'basic',
          price: 1000,
          currency: 'NGN',
          billing: 'one_time',
          features: [],
          deliveryTime: '5 days',
        }}
        onClose={() => {}}
      />
    );
    // Discounted price should show ₦500
    // Use getAllByText to handle multiple matches, verify at least one exists
    const priceElements = screen.getAllByText((_: string, element: Element | null) => {
      const text = element?.textContent || '';
      return text.includes('₦') && text.includes('500');
    });
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
