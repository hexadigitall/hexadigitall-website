// src/lib/currency.ts

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  basePrice: number; // in USD
  popular?: boolean;
  cta: string;
}

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
  GHS: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
};

// Exchange rates (you'd typically fetch these from an API)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1650, // 1 USD = 1650 NGN (approximate)
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  ZAR: 18.5,
  KES: 129,
  GHS: 15.8,
  INR: 83.2,
};

// Country to currency mapping for geo-detection
export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: 'USD',
  NG: 'NGN',
  GB: 'GBP',
  CA: 'CAD',
  AU: 'AUD',
  ZA: 'ZAR',
  KE: 'KES',
  GH: 'GHS',
  IN: 'INR',
  // EU countries
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
};

class CurrencyService {
  private currentCurrency: string = 'USD';
  private rates: Record<string, number> = EXCHANGE_RATES;

  constructor() {
    // Initialize with user's saved preference or detect from geo
    this.initializeCurrency();
  }

  private async initializeCurrency() {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      // Check for saved preference
      const saved = localStorage.getItem('hexadigitall_currency');
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        this.currentCurrency = saved;
        return;
      }
    }

    // Detect from geo-location
    try {
      const detected = await this.detectCurrencyFromGeo();
      this.currentCurrency = detected;
      this.saveCurrencyPreference(detected);
    } catch (error) {
      console.log('Could not detect currency, using USD default');
      this.currentCurrency = 'USD';
    }
  }

  private async detectCurrencyFromGeo(): Promise<string> {
    try {
      // Try multiple geo IP services for reliability
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipgeolocation.io/ipgeo?apiKey=free', 
        'https://ipinfo.io/json'
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          const countryCode = data.country_code || data.country;
          
          if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
            return COUNTRY_CURRENCY_MAP[countryCode];
          }
        } catch (err) {
          console.log(`Service ${service} failed, trying next...`);
          continue;
        }
      }
      
      throw new Error('All geo services failed');
    } catch (error) {
      console.error('Geo detection failed:', error);
      return 'USD'; // fallback
    }
  }

  async updateExchangeRates() {
    try {
      // In production, you'd use a service like:
      // - exchangerate-api.com
      // - fixer.io
      // - currencylayer.com
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates) {
        this.rates = { USD: 1, ...data.rates };
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      // Use fallback rates
    }
  }

  setCurrency(currencyCode: string) {
    if (SUPPORTED_CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode;
      this.saveCurrencyPreference(currencyCode);
    }
  }

  getCurrentCurrency(): Currency {
    return SUPPORTED_CURRENCIES[this.currentCurrency];
  }

  private saveCurrencyPreference(currency: string) {
    // Only save to localStorage on the client side
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hexadigitall_currency', currency);
      } catch (error) {
        console.error('Could not save currency preference:', error);
      }
    }
  }

  convertPrice(usdPrice: number, toCurrency?: string): number {
    const targetCurrency = toCurrency || this.currentCurrency;
    const rate = this.rates[targetCurrency] || 1;
    return usdPrice * rate;
  }

  formatPrice(usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }): string {
    const targetCurrency = options?.currency || this.currentCurrency;
    const currency = SUPPORTED_CURRENCIES[targetCurrency];
    
    // Apply Nigerian launch special discount (30% off for NGN users)
    let finalPrice = usdPrice;
    if (options?.applyNigerianDiscount !== false && this.isLocalCurrency() && targetCurrency === 'NGN' && this.isLaunchSpecialActive()) {
      finalPrice = usdPrice * 0.7; // 30% discount
    }
    
    const convertedPrice = this.convertPrice(finalPrice, targetCurrency);
    
    // Format based on currency
    let formatted: string;
    
    if (targetCurrency === 'NGN' || targetCurrency === 'KES' || targetCurrency === 'ZAR') {
      // No decimals for these currencies
      formatted = Math.round(convertedPrice).toLocaleString();
    } else {
      // Two decimals for others
      formatted = convertedPrice.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }

    const result = options?.showCurrency !== false 
      ? `${currency.symbol}${formatted}` 
      : formatted;

    // Show original USD price if converted and requested
    if (options?.showOriginal && targetCurrency !== 'USD') {
      return `${result} (~$${usdPrice})`;
    }

    return result;
  }

  formatPriceRange(minUsd: number, maxUsd: number, options?: {
    currency?: string;
    showCurrency?: boolean;
  }): string {
    const minFormatted = this.formatPrice(minUsd, { ...options, showCurrency: false });
    const maxFormatted = this.formatPrice(maxUsd, options);
    const currency = SUPPORTED_CURRENCIES[options?.currency || this.currentCurrency];
    
    return `${currency.symbol}${minFormatted} - ${maxFormatted}`;
  }

  getSupportedCurrencies(): Currency[] {
    return Object.values(SUPPORTED_CURRENCIES);
  }

  isLocalCurrency(): boolean {
    return this.currentCurrency === 'NGN';
  }

  isLaunchSpecialActive(): boolean {
    // Launch special runs until January 31, 2025
    const endDate = new Date('2025-01-31T23:59:59Z');
    return new Date() < endDate;
  }

  getLocalDiscountMessage(): string | null {
    if (this.isLocalCurrency() && this.isLaunchSpecialActive()) {
      return "🇳🇬 30% OFF Launch Special - Limited Time for Nigerian clients!";
    } else if (this.isLocalCurrency()) {
      return "🇳🇬 Special rates for Nigerian clients - Pay in Naira!";
    }
    return null;
  }
}

export const currencyService = new CurrencyService();

// Pricing tiers for different services - OPTIMIZED FOR NIGERIAN MARKET
export const SERVICE_PRICING: Record<string, PricingTier[]> = {
  'business-plan': [
    {
      id: 'basic-plan',
      name: 'Essential Plan',
      description: 'Perfect for startups and small businesses',
      basePrice: 149,
      features: [
        'Executive Summary',
        'Market Analysis',
        'Financial Projections (3 years)',
        'Business Model Canvas',
        'Basic Logo Design',
        '2 Revision Rounds',
        '7-day delivery'
      ],
      cta: 'Get Essential Plan'
    },
    {
      id: 'professional-plan',
      name: 'Professional Plan',
      description: 'Comprehensive plan for serious entrepreneurs',
      basePrice: 297,
      popular: true,
      features: [
        'Complete Business Plan (25+ pages)',
        'Market Research & Analysis',
        'Financial Projections (5 years)',
        'Investor Pitch Deck (10 slides)',
        'Premium Logo + Brand Guidelines',
        'Unlimited Revisions',
        '10-day delivery',
        'FREE 1-hour consultation call'
      ],
      cta: 'Get Professional Plan'
    },
    {
      id: 'premium-plan',
      name: 'Investor-Ready Plan',
      description: 'For businesses seeking investment',
      basePrice: 497,
      features: [
        'Investor-Grade Business Plan (40+ pages)',
        'Detailed Market Research',
        'Financial Modeling & Analysis',
        'Professional Pitch Deck (15+ slides)',
        'Complete Brand Identity Package',
        'Unlimited Revisions',
        '14-day delivery',
        'FREE 2-hour strategy session',
        'Investor Introduction (if qualified)'
      ],
      cta: 'Get Investor-Ready Plan'
    }
  ],
  'web-development': [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'High-converting single page website',
      basePrice: 297,
      features: [
        'Responsive Design',
        'Mobile Optimized',
        'Contact Form Integration',
        'SEO Optimized',
        'Social Media Integration',
        '3 Revision Rounds',
        '7-day delivery'
      ],
      cta: 'Get Landing Page'
    },
    {
      id: 'business-website',
      name: 'Business Website',
      description: 'Complete website for your business',
      basePrice: 597,
      popular: true,
      features: [
        'Up to 8 Pages',
        'Responsive Design',
        'CMS Integration',
        'Contact Forms',
        'SEO Optimization',
        'Google Analytics',
        'Social Media Integration',
        'SSL Certificate',
        'Unlimited Revisions',
        '14-day delivery'
      ],
      cta: 'Get Business Website'
    },
    {
      id: 'ecommerce-website',
      name: 'E-commerce Website',
      description: 'Full online store with payment integration',
      basePrice: 997,
      features: [
        'Up to 50 Products',
        'Payment Gateway Integration',
        'Inventory Management',
        'Order Management System',
        'Customer Accounts',
        'Mobile Responsive',
        'SEO Optimized',
        'Analytics & Reporting',
        'Unlimited Revisions',
        '21-day delivery',
        'FREE 1-hour training session'
      ],
      cta: 'Get E-commerce Website'
    }
  ],
  'digital-marketing': [
    {
      id: 'social-media-starter',
      name: 'Social Media Starter',
      description: 'Get started with social media marketing',
      basePrice: 197,
      features: [
        'Social Media Strategy',
        '20 Custom Posts/month',
        '2 Platform Management',
        'Basic Analytics Report',
        'Community Management',
        'Monthly Performance Review'
      ],
      cta: 'Start Social Media Marketing'
    },
    {
      id: 'digital-marketing-pro',
      name: 'Digital Marketing Pro',
      description: 'Comprehensive digital marketing solution',
      basePrice: 397,
      popular: true,
      features: [
        'Multi-Platform Strategy',
        '40 Custom Posts/month',
        '4 Platform Management',
        'Paid Ad Campaigns',
        'Advanced Analytics',
        'Weekly Performance Reports',
        'Email Marketing Setup',
        'SEO Optimization'
      ],
      cta: 'Get Pro Marketing'
    },
    {
      id: 'growth-marketing',
      name: 'Growth Marketing',
      description: 'Full-service marketing for rapid growth',
      basePrice: 697,
      features: [
        'Complete Marketing Strategy',
        '60+ Custom Posts/month',
        'All Major Platforms',
        'Advanced Paid Campaigns',
        'Conversion Optimization',
        'Real-time Analytics Dashboard',
        'Weekly Strategy Calls',
        'Growth Hacking Tactics',
        'Influencer Outreach'
      ],
      cta: 'Accelerate Growth'
    }
  ]
};
