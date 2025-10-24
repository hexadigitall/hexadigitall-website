export interface ServicePackage {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  popular?: boolean
  deliveryTime: string
  category: 'basic' | 'standard' | 'premium' | 'enterprise'
}

export const SERVICE_PACKAGES: Record<string, ServicePackage[]> = {
  'web-and-mobile-software-development': [
    {
      id: 'web-basic',
      name: 'Basic Web App',
      price: 2500,
      originalPrice: 3500,
      description: 'Perfect for simple business websites and basic web applications',
      features: [
        'Responsive design',
        'Up to 5 pages',
        'Contact form',
        'Basic SEO setup',
        'Mobile optimization',
        '30 days support'
      ],
      deliveryTime: '2-3 weeks',
      category: 'basic'
    },
    {
      id: 'web-standard',
      name: 'Standard Web Solution',
      price: 5500,
      originalPrice: 7000,
      description: 'Comprehensive web solution for growing businesses',
      features: [
        'Custom design & development',
        'Up to 10 pages',
        'CMS integration',
        'Advanced SEO',
        'Analytics setup',
        'Payment integration',
        '60 days support'
      ],
      deliveryTime: '4-6 weeks',
      category: 'standard',
      popular: true
    },
    {
      id: 'web-premium',
      name: 'Premium Web Platform',
      price: 12000,
      originalPrice: 15000,
      description: 'Advanced web platform with custom features',
      features: [
        'Full-stack development',
        'Unlimited pages',
        'Custom functionality',
        'API integration',
        'Advanced security',
        'Performance optimization',
        '90 days support'
      ],
      deliveryTime: '8-12 weeks',
      category: 'premium'
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Development',
      price: 8500,
      originalPrice: 12000,
      description: 'Native or cross-platform mobile application',
      features: [
        'iOS & Android apps',
        'Custom UI/UX design',
        'Backend integration',
        'Push notifications',
        'App store submission',
        'Performance optimization',
        '120 days support'
      ],
      deliveryTime: '10-16 weeks',
      category: 'premium'
    }
  ],
  'business-plan-and-logo-design': [
    {
      id: 'logo-only',
      name: 'Logo Design',
      price: 350,
      originalPrice: 500,
      description: 'Professional logo design for your business',
      features: [
        '3 logo concepts',
        'Unlimited revisions',
        'Vector files (AI, EPS)',
        'PNG & JPG formats',
        'Brand color palette',
        'Usage guidelines'
      ],
      deliveryTime: '5-7 days',
      category: 'basic'
    },
    {
      id: 'business-plan',
      name: 'Business Plan',
      price: 1200,
      originalPrice: 1800,
      description: 'Comprehensive business plan for startups and existing businesses',
      features: [
        'Executive summary',
        'Market analysis',
        'Financial projections',
        'Marketing strategy',
        'Operations plan',
        'Investor-ready format'
      ],
      deliveryTime: '2-3 weeks',
      category: 'standard',
      popular: true
    },
    {
      id: 'complete-brand',
      name: 'Complete Brand Package',
      price: 1800,
      originalPrice: 2500,
      description: 'Full branding solution including business plan and design',
      features: [
        'Complete business plan',
        'Logo design & brand identity',
        'Business card design',
        'Letterhead template',
        'Brand style guide',
        'Social media templates'
      ],
      deliveryTime: '3-4 weeks',
      category: 'premium'
    }
  ],
  'social-media-advertising-and-marketing': [
    {
      id: 'social-starter',
      name: 'Social Media Starter',
      price: 800,
      originalPrice: 1200,
      description: 'Perfect for small businesses starting with social media',
      features: [
        '2 platforms management',
        '12 posts per month',
        'Basic graphics design',
        'Community management',
        'Monthly analytics report',
        'Ad spend not included'
      ],
      deliveryTime: 'Ongoing monthly',
      category: 'basic'
    },
    {
      id: 'social-growth',
      name: 'Growth Marketing',
      price: 1500,
      originalPrice: 2000,
      description: 'Comprehensive social media marketing for growth',
      features: [
        '4 platforms management',
        '24 posts per month',
        'Custom graphics & videos',
        'Paid advertising setup',
        'Lead generation campaigns',
        'Weekly performance reports'
      ],
      deliveryTime: 'Ongoing monthly',
      category: 'standard',
      popular: true
    },
    {
      id: 'social-enterprise',
      name: 'Enterprise Marketing',
      price: 3000,
      originalPrice: 4000,
      description: 'Full-scale social media marketing and advertising',
      features: [
        'All major platforms',
        'Daily posting & engagement',
        'Professional content creation',
        'Advanced targeting & automation',
        'Conversion tracking & optimization',
        'Dedicated account manager'
      ],
      deliveryTime: 'Ongoing monthly',
      category: 'enterprise'
    }
  ],
  'profile-and-portfolio-building': [
    {
      id: 'linkedin-profile',
      name: 'LinkedIn Optimization',
      price: 250,
      originalPrice: 400,
      description: 'Professional LinkedIn profile optimization',
      features: [
        'Profile audit & optimization',
        'Compelling headline & summary',
        'Skills & endorsements strategy',
        'Connection building tips',
        'Content strategy guide'
      ],
      deliveryTime: '3-5 days',
      category: 'basic'
    },
    {
      id: 'portfolio-website',
      name: 'Portfolio Website',
      price: 1200,
      originalPrice: 1800,
      description: 'Custom portfolio website to showcase your work',
      features: [
        'Custom design & development',
        'Project showcase galleries',
        'About & contact pages',
        'Blog functionality',
        'SEO optimization',
        'Mobile responsive'
      ],
      deliveryTime: '2-3 weeks',
      category: 'standard',
      popular: true
    },
    {
      id: 'complete-presence',
      name: 'Complete Digital Presence',
      price: 2000,
      originalPrice: 3000,
      description: 'Full personal brand package with website and profiles',
      features: [
        'Custom portfolio website',
        'LinkedIn profile optimization',
        'Professional headshots guide',
        'Personal brand strategy',
        'Social media setup',
        'Email signature design'
      ],
      deliveryTime: '3-4 weeks',
      category: 'premium'
    }
  ],
  'mentoring-and-consulting': [
    {
      id: 'single-session',
      name: 'Single Consultation',
      price: 150,
      originalPrice: 200,
      description: 'One-time consultation session for specific challenges',
      features: [
        '90-minute session',
        'Pre-session questionnaire',
        'Personalized action plan',
        'Resource recommendations',
        'Follow-up email summary'
      ],
      deliveryTime: 'Within 1 week',
      category: 'basic'
    },
    {
      id: 'monthly-mentoring',
      name: 'Monthly Mentoring',
      price: 500,
      originalPrice: 700,
      description: 'Ongoing monthly mentoring for continuous growth',
      features: [
        '4 sessions per month',
        'Goal setting & tracking',
        'Unlimited email support',
        'Progress assessments',
        'Resource library access'
      ],
      deliveryTime: 'Ongoing monthly',
      category: 'standard',
      popular: true
    },
    {
      id: 'intensive-program',
      name: 'Intensive Program',
      price: 2500,
      originalPrice: 3500,
      description: 'Comprehensive 3-month intensive mentoring program',
      features: [
        '12 sessions over 3 months',
        'Customized curriculum',
        'Weekly assignments',
        'Direct access to mentor',
        'Certificate of completion',
        'Lifetime resource access'
      ],
      deliveryTime: '3 months',
      category: 'premium'
    }
  ]
}