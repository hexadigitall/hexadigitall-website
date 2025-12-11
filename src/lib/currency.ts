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
      // Use our own API endpoint which handles rate caching and fallbacks
      const response = await fetch('/api/exchange-rates', {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      const data = await response.json();
      
      if (data.rates) {
        this.rates = { ...this.rates, ...data.rates };
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      // Use fallback rates that are already set in EXCHANGE_RATES
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

// Pricing tiers for different services - STANDARDIZED PRICING FRAMEWORK
export const SERVICE_PRICING: Record<string, PricingTier[]> = {
  'business-plan': [
    {
      id: 'starter-plan',
      name: 'Starter Plan',
      description: 'Perfect for new entrepreneurs and startups',
      basePrice: 249,
      features: [
        'Executive Summary (2 pages)',
        'Business Description & Value Proposition',
        'Basic Market Analysis & Target Customer Profile',
        '1-Year Financial Projection (Revenue, Expenses, Profit)',
        'Business Model Canvas',
        'Simple Marketing Strategy Outline',
        'Basic SWOT Analysis',
        'Basic Logo Design (3 concepts)',
        'Business Plan Template for Future Updates',
        '1 Revision Round',
        '5-Day Delivery',
        'Email Support During Process'
      ],
      cta: 'Get Started Now'
    },
    {
      id: 'growth-plan',
      name: 'Growth Plan',
      description: 'Complete plan for serious entrepreneurs',
      basePrice: 499,
      popular: true,
      features: [
        'Comprehensive Business Plan (15-20 pages)',
        'Executive Summary & Company Overview',
        'Detailed Market Research & Industry Analysis',
        'Competitive Analysis (5 key competitors)',
        '3-Year Financial Projections with Monthly Breakdown',
        'Marketing & Sales Strategy with Channels',
        'Operations Plan & Organizational Structure',
        'Risk Assessment & Mitigation Strategies',
        'Basic Pitch Deck (6-8 professional slides)',
        'Professional Logo Design with 3 Variations',
        'Basic Brand Colors & Typography Guide',
        '3 Revision Rounds',
        '7-Day Delivery',
        'FREE 45-minute Strategy Consultation Call',
        'Business Plan Template & Guidelines'
      ],
      cta: 'Choose Growth Plan'
    },
    {
      id: 'investor-plan',
      name: 'Investor Plan',
      description: 'Investment-ready business plan',
      basePrice: 999,
      features: [
        'Investment-Grade Business Plan (25-35 pages)',
        'Professional Executive Summary (3 pages)',
        'Comprehensive Market Research & Analysis',
        'In-depth Competitive Intelligence Report',
        '5-Year Financial Modeling with Scenarios',
        'Detailed Revenue Model & Unit Economics',
        'Complete Go-to-Market Strategy',
        'Management Team Profiles & Advisory Board',
        'Professional Pitch Deck (12-15 slides)',
        'Investment Summary One-Pager',
        'Complete Brand Identity Package (Logo, Colors, Fonts)',
        'Business Cards & Letterhead Design',
        'Industry-Specific Legal Structure Recommendations',
        'Funding Strategy & Investment Timeline',
        'Unlimited Revisions for 30 Days',
        '10-Day Development Timeline',
        'FREE 2-Hour Strategy & Pitch Practice Session',
        'Investor Network Introduction (qualified businesses)',
        '30-Day Post-Delivery Support'
      ],
      cta: 'Get Investor-Ready'
    }
  ],
  'web-development': [
    {
      id: 'landing-page',
      name: 'Landing Page',
      description: 'High-converting single page website',
      basePrice: 299,
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
      basePrice: 999,
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
      basePrice: 1499,
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
    },
    {
      id: 'web-app-development',
      name: 'Web App Development',
      description: 'Scalable web application with database, APIs, and modern architecture',
      basePrice: 2499,
      features: [
        'Custom feature development',
        'API & third-party integrations',
        'Authentication & user roles',
        'Database design & setup',
        'Scalable architecture',
        'Performance & security hardening',
        'Deployment & CI/CD setup'
      ],
      cta: 'Choose Your Scope'
    }
  ],
  'digital-marketing': [
    {
      id: 'social-starter',
      name: 'Social Starter',
      description: 'Perfect entry into social media marketing',
      basePrice: 299,
      features: [
        '2 Platform Management (Instagram + Facebook)',
        '15 Custom Designed Posts/month',
        '5 Instagram Stories per week',
        'Basic Content Calendar Planning',
        'Daily Community Management (1-2 hours)',
        'Monthly Performance Report (Reach, Engagement, Growth)',
        '10 Premium Stock Images/month',
        'Hashtag Strategy (15-25 researched tags per post)',
        'Basic Brand Voice Development',
        '2 Revision Rounds for Content',
        'Email Support (48-hour response)'
      ],
      cta: 'Start Social Media'
    },
    {
      id: 'marketing-pro',
      name: 'Marketing Pro',
      description: 'Complete social media & marketing solution',
      basePrice: 599,
      popular: true,
      features: [
        '4 Platform Management (Instagram, Facebook, LinkedIn, Twitter)',
        '30 Custom Designed Posts/month',
        '12 Instagram/Facebook Stories per week',
        'Comprehensive Content Strategy & Editorial Calendar',
        'Basic Facebook/Instagram Ads Setup ($100 ad spend included)',
        'Daily Community Management (3-4 hours)',
        'Bi-weekly Performance Reports with Insights',
        'Email Marketing Setup (MailChimp/ConvertKit integration)',
        'Basic Local SEO Optimization (Google My Business)',
        '25 Premium Stock Images/month',
        'Brand Guidelines Development (Colors, Fonts, Voice)',
        'Competitor Analysis Report',
        '3 Revision Rounds for Content',
        'Phone/Email Support (24-hour response)'
      ],
      cta: 'Get Pro Marketing'
    },
    {
      id: 'growth-accelerator',
      name: 'Growth Accelerator',
      description: 'Full-service marketing for business growth',
      basePrice: 1199,
      features: [
        '6 Platform Management (Instagram, Facebook, LinkedIn, Twitter, TikTok, YouTube)',
        '50+ Custom Posts/month across all platforms',
        '20 Stories/Reels per week + 4 YouTube videos/month',
        'Advanced Content Strategy with A/B Testing',
        'Paid Ad Campaign Management ($300 ad spend included)',
        'Advanced Analytics Dashboard & Weekly Reporting',
        'Weekly 30-minute Strategy Calls',
        'Email Marketing Automation (Sequences, Funnels)',
        'Advanced SEO Optimization & Local Search',
        'Influencer Partnership Outreach (5 contacts/month)',
        'Growth Hacking Implementation (Viral loops, Referrals)',
        'Custom Graphics & Video Content Creation',
        'Unlimited Premium Stock Images/Videos',
        'Complete Brand Asset Library',
        'Unlimited Revisions',
        'Priority Support (2-hour response)',
        'Monthly Strategy Review & Optimization'
      ],
      cta: 'Accelerate My Growth'
    }
  ],
  'consulting': [
    {
      id: 'strategy-session',
      name: 'Strategy Session',
      description: '1-on-1 consultation to kickstart your journey',
      basePrice: 79,
      features: [
        '90-minute Deep-Dive Video Consultation',
        'Pre-session Business Assessment Questionnaire',
        'SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)',
        'Personalized 5-Step Action Plan with Timeline',
        'Resource Library Access (Templates, Guides, Tools)',
        'Priority Matrix for Next 90 Days',
        'Detailed Follow-up Summary Report (5-7 pages)',
        '7-Day Email Support for Clarifications',
        'Recommended Reading List',
        'Industry Benchmarking Insights'
      ],
      cta: 'Book Strategy Session'
    },
    {
      id: 'mentoring-program',
      name: 'Mentoring Program',
      description: 'Monthly mentoring for consistent growth',
      basePrice: 249,
      popular: true,
      features: [
        '4 One-Hour Video Sessions per Month (Scheduled at convenience)',
        'Personalized 12-Month Growth Roadmap',
        'Skill Assessment with Gap Analysis',
        'Industry-Specific Career Development Guidance',
        'Weekly Goal Setting & Accountability Check-ins',
        'Access to Mentor\'s Professional Network',
        'Exclusive Resource Library (500+ business templates)',
        'Monthly Progress Review with KPI Tracking',
        'Unlimited WhatsApp/Email Support',
        'Resume/LinkedIn Profile Optimization',
        'Mock Interview Sessions (2 per month)',
        'Industry Trend Reports & Insights',
        'Certificate of Completion'
      ],
      cta: 'Start Mentoring'
    },
    {
      id: 'full-consulting',
      name: 'Full Consulting Package',
      description: 'Comprehensive business transformation',
      basePrice: 999,
      features: [
        'Complete Business Audit & Assessment (40+ point checklist)',
        'Strategic Business Plan Development (25+ pages)',
        'Financial Analysis & Optimization Recommendations',
        'Market Research & Competitive Analysis',
        'Operational Process Mapping & Optimization',
        'Technology Stack Assessment & Recommendations',
        'Team Training Workshops (4 sessions, 2 hours each)',
        '3-Month Implementation Support with Weekly Check-ins',
        'Custom KPI Dashboard Setup & Training',
        'Risk Assessment & Mitigation Strategies',
        'Vendor/Partner Evaluation & Recommendations',
        'Legal & Compliance Review Checklist',
        'Scalability Planning for Next 3-5 Years',
        'Executive Summary for Stakeholders',
        'Unlimited Phone/Email Support during Engagement',
        '6-Month Post-Implementation Review Session'
      ],
      cta: 'Get Full Consulting'
    }
  ],
  'portfolio': [
    {
      id: 'basic-profile',
      name: 'Professional Profile',
      description: 'Showcase your work with a stunning profile',
      basePrice: 199,
      features: [
        'Single-Page Modern Portfolio Design',
        'Mobile & Tablet Responsive Layout',
        'Portfolio Gallery (Up to 12 Projects)',
        'High-Resolution Image Optimization',
        'Professional Bio & Skills Section',
        'Contact Form with Auto-Response',
        'Social Media Integration (5 platforms)',
        'Basic SEO Setup (Meta tags, descriptions)',
        'PDF Resume/CV Download Feature',
        'Google Fonts Integration',
        '2 Revision Rounds',
        '5-Day Delivery',
        'FREE Stock Photos (up to 10)',
        '30-Day Email Support'
      ],
      cta: 'Create My Profile'
    },
    {
      id: 'portfolio-website',
      name: 'Portfolio Website',
      description: 'Complete portfolio website with multiple pages',
      basePrice: 399,
      popular: true,
      features: [
        'Multi-Page Portfolio Site (Home, About, Portfolio, Services, Contact)',
        'Detailed Project Case Studies (Up to 20 projects)',
        'About Page with Professional Story',
        'Services/Pricing Page',
        'Blog Section (5 starter posts included)',
        'Advanced Contact Forms with File Upload',
        'Client Testimonials Section',
        'Skills & Experience Timeline',
        'SEO Optimization (On-page + Technical)',
        'Google Analytics & Search Console Setup',
        'Social Media Feed Integration',
        'Newsletter Signup Integration',
        'Fast Loading Optimization',
        'SSL Certificate Setup',
        '3 Revision Rounds',
        '10-Day Delivery',
        'FREE Professional Photography Consultation',
        '90-Day Support & Maintenance'
      ],
      cta: 'Build My Portfolio'
    },
    {
      id: 'brand-website',
      name: 'Premium Brand Site',
      description: 'Complete brand website with advanced features',
      basePrice: 799,
      features: [
        'Full Brand Website (8+ pages) with Custom Design',
        'Advanced Portfolio Features (Video showcases, animations)',
        'Client Portal for Project Management',
        'Online Service Booking System',
        'Payment Integration (Stripe/PayPal)',
        'E-commerce Store (Up to 50 products)',
        'Client Testimonial Collection System',
        'Advanced SEO & Local Search Optimization',
        'Social Media Management Integration',
        'Email Marketing Automation Setup',
        'Advanced Analytics Dashboard',
        'Multi-language Support (2 languages)',
        'Live Chat Integration',
        'Custom Domain & Premium Hosting (1 year)',
        'Brand Guidelines Document',
        'Professional Content Writing (5 pages)',
        'Advanced Security Features',
        'Unlimited Revisions',
        '21-Day Development Period',
        '6-Month Priority Support & Updates',
        'FREE Professional Brand Consultation'
      ],
      cta: 'Launch Brand Site'
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
    originalPrice: 798, // $499 + $299
    bundlePrice: 649,
    savings: 149,
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
    originalPrice: 1797, // $499 + $999 + $299
    bundlePrice: 1499,
    savings: 298,
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
    originalPrice: 3097, // $999 + $1499 + $599
    bundlePrice: 2499,
    savings: 598,
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
