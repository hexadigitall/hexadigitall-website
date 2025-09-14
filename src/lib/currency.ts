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
  basePrice: number;
  popular?: boolean;
  features: string[];
  cta: string;
  billing?: string;
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
    } catch {
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
        } catch {
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
    
    // Apply Nigerian launch special discount (50% off for NGN users)
    let finalPrice = usdPrice;
    if (options?.applyNigerianDiscount !== false && this.isLocalCurrency() && targetCurrency === 'NGN' && this.isLaunchSpecialActive()) {
      finalPrice = usdPrice * 0.5; // 50% discount
    }
    
    const convertedPrice = this.convertPrice(finalPrice, targetCurrency);
    
    // Format based on currency
    let formatted: string;
    
    if (targetCurrency === 'NGN' || targetCurrency === 'KES' || targetCurrency === 'ZAR') {
      // No decimals for these currencies (whole numbers only)
      formatted = Math.round(convertedPrice).toLocaleString();
    } else {
      // Always show exactly 2 decimal places for professional currencies
      formatted = convertedPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
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
    // Launch special runs until January 31, 2026
    const endDate = new Date('2026-01-31T23:59:59Z');
    return new Date() < endDate;
  }

  getLocalDiscountMessage(): string | null {
    if (this.isLocalCurrency() && this.isLaunchSpecialActive()) {
      return "🇳🇬 50% OFF Launch Special - Limited Time for Nigerian clients!";
    } else if (this.isLocalCurrency()) {
      return "🇳🇬 Special rates for Nigerian clients - Pay in Naira!";
    }
    return null;
  }

  formatPriceWithDiscount(usdPrice: number, options?: {
    currency?: string;
    showCurrency?: boolean;
    showOriginal?: boolean;
    applyNigerianDiscount?: boolean;
  }): { originalPrice: string; discountedPrice: string; discountPercentage: number; hasDiscount: boolean } {
    const targetCurrency = options?.currency || this.currentCurrency;
    const hasDiscount = options?.applyNigerianDiscount !== false && 
                       this.isLocalCurrency() && 
                       targetCurrency === 'NGN' && 
                       this.isLaunchSpecialActive();
    
    const originalPrice = this.formatPrice(usdPrice, {
      ...options,
      applyNigerianDiscount: false // Don't apply discount for original price
    });
    
    const discountedPrice = this.formatPrice(usdPrice, options);
    
    return {
      originalPrice,
      discountedPrice,
      discountPercentage: hasDiscount ? 50 : 0,
      hasDiscount
    };
  }
}

export const currencyService = new CurrencyService();

// Pricing tiers for different services - AGGRESSIVE MARKET PENETRATION PRICING
export const SERVICE_PRICING: Record<string, PricingTier[]> = {
  'business-plan': [
    {
      id: 'starter-plan',
      name: 'Starter Plan',
      description: 'Perfect for new entrepreneurs and startups',
      basePrice: 79,
      features: [
        'Executive Summary',
        'Basic Market Analysis',
        '1-Year Financial Projection',
        'Business Model Outline',
        'Basic Logo Design',
        '1 Revision Round',
        '5-day delivery'
      ],
      cta: 'Get Started Now'
    },
    {
      id: 'growth-plan',
      name: 'Growth Plan',
      description: 'Complete plan for serious entrepreneurs',
      basePrice: 149,
      popular: true,
      features: [
        'Complete Business Plan (15+ pages)',
        'Market Research & Analysis',
        '3-Year Financial Projections',
        'Basic Pitch Deck (5 slides)',
        'Professional Logo Design',
        '3 Revision Rounds',
        '7-day delivery',
        'FREE consultation call'
      ],
      cta: 'Choose Growth Plan'
    },
    {
      id: 'investor-plan',
      name: 'Investor Plan',
      description: 'Investment-ready business plan',
      basePrice: 249,
      features: [
        'Professional Business Plan (25+ pages)',
        'Detailed Market Research',
        '5-Year Financial Modeling',
        'Professional Pitch Deck (12 slides)',
        'Complete Brand Identity Package',
        'Unlimited Revisions',
        '10-day delivery',
        'FREE 2-hour strategy session',
        'Investor Introduction (if qualified)'
      ],
      cta: 'Get Investor-Ready'
    }
  ],
  'web-development': [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'High-converting single page website',
      basePrice: 149,
      features: [
        'Single Page Design',
        'Mobile Responsive',
        'Contact Form',
        'Basic SEO Setup',
        'Social Media Links',
        '2 Revision Rounds',
        '5-day delivery',
        'FREE Stock Images'
      ],
      cta: 'Get Landing Page'
    },
    {
      id: 'business-website',
      name: 'Business Website',
      description: 'Complete professional website',
      basePrice: 349,
      popular: true,
      features: [
        'Up to 6 Pages',
        'Mobile Responsive Design',
        'Basic CMS (Content Management)',
        'Contact Forms',
        'SEO Optimization',
        'Google Analytics Setup',
        'Social Media Integration',
        'SSL Certificate',
        '3 Revision Rounds',
        '10-day delivery',
        'FREE Logo Design'
      ],
      cta: 'Build My Website'
    },
    {
      id: 'ecommerce-website',
      name: 'E-commerce Store',
      description: 'Complete online store solution',
      basePrice: 649,
      features: [
        'Up to 25 Products',
        'Payment Gateway Integration',
        'Basic Inventory Management',
        'Order Management System',
        'Customer Account System',
        'Mobile Responsive',
        'SEO Optimized',
        'Basic Analytics',
        '3 Revision Rounds',
        '14-day delivery',
        'FREE 2-hour training session'
      ],
      cta: 'Launch My Store'
    }
  ],
  'digital-marketing': [
    {
      id: 'social-starter',
      name: 'Social Starter',
      description: 'Perfect entry into social media marketing',
      basePrice: 99,
      features: [
        '2 Platforms (Instagram, Facebook)',
        '15 Custom Posts/month',
        'Basic Content Strategy',
        'Community Management',
        'Monthly Performance Report',
        'Stock Images Included',
        'Basic Hashtag Research'
      ],
      cta: 'Start Social Media'
    },
    {
      id: 'marketing-pro',
      name: 'Marketing Pro',
      description: 'Complete social media & marketing solution',
      basePrice: 249,
      popular: true,
      features: [
        '4 Platform Management',
        '30 Custom Posts/month',
        'Content Strategy & Planning',
        'Basic Paid Ads Setup',
        'Community Management',
        'Weekly Performance Reports',
        'Email Marketing Setup',
        'Basic SEO Optimization',
        'FREE Brand Guidelines'
      ],
      cta: 'Get Pro Marketing'
    },
    {
      id: 'growth-accelerator',
      name: 'Growth Accelerator',
      description: 'Full-service marketing for business growth',
      basePrice: 449,
      features: [
        'All Major Social Platforms',
        '50+ Custom Posts/month',
        'Advanced Content Strategy',
        'Paid Ad Campaign Management',
        'Advanced Analytics & Reporting',
        'Weekly Strategy Calls',
        'Email Marketing Automation',
        'Advanced SEO Optimization',
        'Influencer Outreach',
        'Growth Hacking Strategies'
      ],
      cta: 'Accelerate My Growth'
    }
  ]
};

// Bundle packages for volume discounts and higher AOV
export const BUNDLE_PACKAGES = {
  'startup-combo': {
    name: 'Startup Combo',
    description: 'Business Plan + Landing Page - Everything to launch your business',
    services: ['business-plan', 'web-development'],
    packages: ['growth-plan', 'landing-page'],
    originalPrice: 298, // $149 + $149
    bundlePrice: 249,
    savings: 49,
    popular: false,
    features: [
      'Complete Business Plan (15+ pages)',
      'Professional Landing Page',
      'Logo Design Included',
      'FREE Business Consultation',
      '10-day delivery'
    ]
  },
  'business-builder': {
    name: 'Business Builder',
    description: 'Complete business setup package',
    services: ['business-plan', 'web-development', 'digital-marketing'],
    packages: ['growth-plan', 'business-website', 'social-starter'],
    originalPrice: 597, // $149 + $349 + $99
    bundlePrice: 449,
    savings: 148,
    popular: true,
    features: [
      'Complete Business Plan',
      'Professional Website (6 pages)',
      '1 Month Social Media Management',
      'Complete Brand Package',
      'FREE Strategy Session',
      'Priority Support',
      '14-day delivery'
    ]
  },
  'growth-master': {
    name: 'Growth Master',
    description: 'Launch to scale - Complete business package',
    services: ['business-plan', 'web-development', 'digital-marketing'],
    packages: ['investor-plan', 'ecommerce-website', 'marketing-pro'],
    originalPrice: 1147, // $249 + $649 + $249
    bundlePrice: 799,
    savings: 348,
    popular: false,
    features: [
      'Investor-Ready Business Plan',
      'Complete E-commerce Store',
      '3 Months Professional Marketing',
      'Complete Brand Identity',
      'Investor Pitch Deck',
      'Advanced Analytics Setup',
      'Weekly Strategy Calls',
      'Priority Support & Training',
      '21-day delivery'
    ]
  }
};
