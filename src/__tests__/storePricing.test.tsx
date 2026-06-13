import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StoreBuySection from '@/components/sections/StoreBuySection';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSession } from 'next-auth/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock currency context
jest.mock('@/contexts/CurrencyContext', () => ({
  useCurrency: jest.fn(),
}));

// Mock TwoStepCheckoutModal to avoid complex sub-rendering
jest.mock('@/components/modals/TwoStepCheckoutModal', () => {
  return function MockModal({ isOpen, title, price }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="checkout-modal">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-price">{price}</div>
      </div>
    );
  };
});

describe('StoreBuySection Pricing', () => {
  const mockConvertPrice = jest.fn((price) => price);
  const mockUseCurrency = useCurrency as jest.Mock;
  const mockUseSession = useSession as jest.Mock;

  // Shared state for the mock to access
  let currentCurrencyCode = 'USD';

  const mockFormatPrice = jest.fn((usdPrice, options) => {
    const currency = options?.currency || currentCurrencyCode;
    const isWhole = ['NGN', 'KES', 'ZAR'].includes(currency);
    const symbol = currency === 'NGN' ? '₦' : '$';
    const exchangeRate = currency === 'NGN' ? 1000 : 1; // Simulated exchange rate for test matching NGN PPP if needed
    
    // In our test, USD 30 becomes 30000. So we mock the exact conversion behavior
    // based on the USD price passed in.
    let finalPrice = usdPrice;
    if (currency === 'NGN') {
      finalPrice = usdPrice * 1000;
    }

    const formattedNumber = finalPrice.toLocaleString('en-US', {
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: isWhole ? 0 : 2,
    });
    return `${symbol}${formattedNumber}`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    currentCurrencyCode = 'USD';
    mockUseCurrency.mockReturnValue({
      currentCurrency: { code: 'USD', symbol: '$' },
      convertPrice: mockConvertPrice,
      formatPrice: mockFormatPrice,
    });
    mockUseSession.mockReturnValue({ data: null });
  });

  const baseBook = {
    _id: 'book1',
    _type: 'book',
    title: 'Test Textbook',
    slug: { current: 'test-textbook' },
    status: 'available',
    directDownloadEnabled: true,
    pricing: { usd: 30, ngn: 30000 },
  } as any;

  it('calculates textbook price based on mentorship rates (Hourly * 4)', () => {
    const textbookWithCourse = {
      ...baseBook,
      relatedCourse: {
        courseType: 'live',
        hourlyRateUSD: 50,
        hourlyRateNGN: 50000,
        mentorshipHourlyRateUSD: 40,
        mentorshipHourlyRateNGN: 40000,
      }
    };

    render(<StoreBuySection book={textbookWithCourse} />);
    
    // Open dropdown
    fireEvent.click(screen.getByText(/Buy Book/i));
    
    // Student Edition should be 40 * 4 = 160 -> $160.00
    expect(screen.getByText(/\$160\.00/)).toBeInTheDocument();
  });

  it('applies 15% increase for Teacher Edition', () => {
    const textbookWithCourse = {
      ...baseBook,
      relatedCourse: {
        courseType: 'live',
        hourlyRateUSD: 100,
        hourlyRateNGN: 100000,
      }
    };
    // Mentorship rate fallback = 0.8 * 100 = 80. Student = 80 * 4 = 320.
    // Teacher = 320 * 1.15 = 368 -> $368.00

    render(<StoreBuySection book={textbookWithCourse} />);
    fireEvent.click(screen.getByText(/Buy Book/i));
    
    expect(screen.getByText(/\$368\.00/)).toBeInTheDocument();
  });

  it('uses specific price for dunce-to-midjourney-pro', () => {
    const dunceBook = {
      ...baseBook,
      slug: { current: 'dunce-to-midjourney-pro' },
      pricing: { usd: 10, ngn: 10000 } // Should be overridden
    };

    render(<StoreBuySection book={dunceBook} />);
    fireEvent.click(screen.getByText(/Buy Book/i));
    
    // Student: 54.99
    expect(screen.getByText(/\$54\.99/)).toBeInTheDocument();
    // Teacher: 54.99 * 1.15 = 63.2385 -> 63.24
    expect(screen.getByText(/\$63\.24/)).toBeInTheDocument();
  });

  it('uses specific price for mother-of-two', () => {
    const motherBook = {
      ...baseBook,
      _type: 'imprint',
      slug: { current: 'mother-of-two' },
    };

    render(<StoreBuySection book={motherBook} />);
    
    // Imprints show a single button
    expect(screen.getByText(/\$47\.99/)).toBeInTheDocument();
  });

  it('uses specific price for love-is-nothing', () => {
    const loveBook = {
      ...baseBook,
      _type: 'imprint',
      slug: { current: 'love-is-nothing' },
    };

    render(<StoreBuySection book={loveBook} />);
    expect(screen.getByText(/\$85\.99/)).toBeInTheDocument();
  });

  it('respects NGN currency and PPP pricing', () => {
    currentCurrencyCode = 'NGN';
    mockUseCurrency.mockReturnValue({
      currentCurrency: { code: 'NGN', symbol: '₦' },
      convertPrice: mockConvertPrice,
      formatPrice: mockFormatPrice,
    });

    render(<StoreBuySection book={baseBook} />);
    fireEvent.click(screen.getByText(/Buy Book/i));
    
    // Student: 30000 -> ₦30,000 (because of toLocaleString)
    expect(screen.getByText(/₦30,000/)).toBeInTheDocument();
    // Teacher: 30000 * 1.15 = 34500 -> ₦34,500
    expect(screen.getByText(/₦34,500/)).toBeInTheDocument();
  });
});
