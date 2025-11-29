import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnifiedServiceRequestFlow from '@/components/services/UnifiedServiceRequestFlow';

jest.mock('@/contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    currentCurrency: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    convertPrice: (price: number) => price,
    isLocalCurrency: () => false,
    isLaunchSpecialActive: () => false,
  })
}));

describe('UnifiedServiceRequestFlow accessibility', () => {
  it('focuses heading after moving from review to details', () => {
    render(
      <UnifiedServiceRequestFlow
        serviceId="ind-1"
        serviceName="Individual Service"
        serviceType="individual"
        onClose={() => {}}
      />
    );
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn); // moves to details
    // Heading should now be focused
    const detailsHeading = screen.getByRole('heading', { name: /your details/i });
    expect(detailsHeading).toBe(document.activeElement);
  });
});
