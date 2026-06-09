export interface CustomField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'tel'
  required: boolean
  options?: string[]
  placeholder?: string
  min?: number
  max?: number
}

export const SERVICE_CUSTOM_FIELDS: Record<string, CustomField[]> = {
  'web-and-mobile-software-development': [
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      required: true,
      options: ['Web Application', 'Mobile App (iOS)', 'Mobile App (Android)', 'Cross-Platform App', 'Desktop Application', 'API Development']
    },
    {
      name: 'complexity',
      label: 'Project Complexity',
      type: 'select',
      required: true,
      options: ['Simple (Basic functionality)', 'Medium (Standard features)', 'Complex (Advanced features)', 'Enterprise (Full-scale system)']
    },
    {
      name: 'timeline',
      label: 'Preferred Timeline',
      type: 'select',
      required: true,
      options: ['Rush (1-2 weeks)', 'Standard (1-2 months)', 'Extended (3-6 months)', 'Long-term (6+ months)']
    },
    {
      name: 'description',
      label: 'Project Description',
      type: 'textarea',
      required: true,
      placeholder: 'Please describe your project requirements, features needed, target audience, etc.'
    },
    {
      name: 'budget',
      label: 'Budget Range',
      type: 'select',
      required: false,
      options: ['Under $5,000', '$5,000 - $15,000', '$15,000 - $50,000', '$50,000 - $100,000', 'Over $100,000']
    }
  ],
  'business-plan-and-logo-design': [
    {
      name: 'serviceType',
      label: 'Service Required',
      type: 'select',
      required: true,
      options: ['Business Plan Only', 'Logo Design Only', 'Both Business Plan & Logo Design', 'Brand Identity Package']
    },
    {
      name: 'businessStage',
      label: 'Business Stage',
      type: 'select',
      required: true,
      options: ['Startup/New Business', 'Existing Business', 'Business Expansion', 'Rebranding']
    },
    {
      name: 'industry',
      label: 'Industry/Sector',
      type: 'text',
      required: true,
      placeholder: 'e.g., Technology, Healthcare, Retail, etc.'
    },
    {
      name: 'targetMarket',
      label: 'Target Market',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your target customers, demographics, geographic location, etc.'
    }
  ],
  'social-media-advertising-and-marketing': [
    {
      name: 'platforms',
      label: 'Preferred Platforms',
      type: 'select',
      required: true,
      options: ['Facebook & Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'YouTube', 'All Major Platforms']
    },
    {
      name: 'campaignType',
      label: 'Campaign Type',
      type: 'select',
      required: true,
      options: ['Brand Awareness', 'Lead Generation', 'Sales/Conversions', 'App Downloads', 'Event Promotion']
    },
    {
      name: 'monthlyBudget',
      label: 'Monthly Ad Spend Budget',
      type: 'select',
      required: true,
      options: ['$500 - $1,500', '$1,500 - $5,000', '$5,000 - $15,000', '$15,000 - $50,000', 'Over $50,000']
    },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      type: 'textarea',
      required: true,
      placeholder: 'Demographics, interests, behaviors, location, etc.'
    }
  ],
  'profile-and-portfolio-building': [
    {
      name: 'profileType',
      label: 'Profile/Portfolio Type',
      type: 'select',
      required: true,
      options: ['Professional LinkedIn Profile', 'Creative Portfolio Website', 'Developer Portfolio', 'Business Executive Profile', 'Personal Brand Package']
    },
    {
      name: 'profession',
      label: 'Your Profession/Industry',
      type: 'text',
      required: true,
      placeholder: 'e.g., Software Developer, Designer, Consultant, etc.'
    },
    {
      name: 'experience',
      label: 'Years of Experience',
      type: 'select',
      required: true,
      options: ['Entry Level (0-2 years)', 'Mid-Level (3-5 years)', 'Senior (6-10 years)', 'Executive (10+ years)']
    },
    {
      name: 'goals',
      label: 'Profile Goals',
      type: 'textarea',
      required: true,
      placeholder: 'What do you want to achieve? Job opportunities, clients, partnerships, etc.'
    }
  ],
  'mentoring-and-consulting': [
    {
      name: 'consultingArea',
      label: 'Consulting/Mentoring Area',
      type: 'select',
      required: true,
      options: ['Business Strategy', 'Digital Marketing', 'Technology/Software', 'Career Development', 'Startup Guidance', 'Project Management']
    },
    {
      name: 'sessionType',
      label: 'Preferred Session Type',
      type: 'select',
      required: true,
      options: ['One-time Consultation', 'Weekly Sessions', 'Monthly Check-ins', 'Intensive Workshop', 'Long-term Mentoring']
    },
    {
      name: 'experience',
      label: 'Your Current Level',
      type: 'select',
      required: true,
      options: ['Beginner', 'Some Experience', 'Intermediate', 'Advanced']
    },
    {
      name: 'challenges',
      label: 'Main Challenges/Goals',
      type: 'textarea',
      required: true,
      placeholder: 'What specific challenges are you facing? What do you want to achieve?'
    }
  ]
}