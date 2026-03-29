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
    isLaunchSpecialActive: () => false,
  })
}));

// Minimal types stubs
const mockAddOns = [
  { id: 'seo', name: 'SEO Optimization', price: 200 },
  { id: 'logo', name: 'Logo Design', price: 100 }
];

describe('Discount logic', () => {
  it('does not apply launch discount in Step3Summary when special is inactive', () => {
    render(
      <Step3Summary
        coreType="web"
        selectedAddOns={mockAddOns}
        onBack={() => {}}
        onReset={() => {}}
      />
    );
    // Verify discount indicator is not shown after launch special expiry
    expect(screen.queryByText(/launch discount applied/i)).not.toBeInTheDocument();
  });

  it('shows regular NGN price in UnifiedServiceRequestFlow when launch special is inactive', () => {
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
    // Regular price should show ₦1000
    // Use getAllByText to handle multiple matches, verify at least one exists
    const priceElements = screen.getAllByText((_: string, element: Element | null) => {
      const text = element?.textContent || '';
      return text.includes('₦') && text.includes('1000');
    });
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
