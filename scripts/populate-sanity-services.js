#!/usr/bin/env node

/**
 * Data Migration Script: Populate Sanity with Service Categories
 * 
 * This script creates all service categories in Sanity Studio
 * Run with: node scripts/populate-sanity-services.js
 */

import { createClient } from 'next-sanity'

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Service categories data to import
const serviceCategories = [
  {
    _type: "serviceCategory",
    title: "Business Plan & Logo Design",
    slug: {
      _type: "slug",
      current: "business-plan-and-logo-design"
    },
    description: "Complete business planning and brand identity services to launch your business with confidence.",
    serviceType: "business",
    icon: "chart",
    featured: true,
    packages: [
      {
        _key: "starter-plan-pkg",
        name: "Starter Plan",
        tier: "standard",
        price: 79,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: [
          "Executive Summary (2 pages)",
          "Business Description & Value Proposition",
          "Basic Market Analysis & Target Customer Profile",
          "1-Year Financial Projection (Revenue, Expenses, Profit)",
          "Business Model Canvas",
          "Simple Marketing Strategy Outline",
          "Basic SWOT Analysis",
          "Basic Logo Design (3 concepts)",
          "Business Plan Template for Future Updates",
          "1 Revision Round",
          "5-Day Delivery",
          "Email Support During Process"
        ]
      },
      {
        _key: "growth-plan-pkg",
        name: "Growth Plan",
        tier: "standard",
        price: 149,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "7-10 days",
        popular: true,
        features: [
          "Comprehensive Business Plan (15-20 pages)",
          "Executive Summary & Company Overview",
          "Detailed Market Research & Industry Analysis",
          "Competitive Analysis (5 key competitors)",
          "3-Year Financial Projections with Monthly Breakdown",
          "Marketing & Sales Strategy with Channels",
          "Operations Plan & Organizational Structure",
          "Risk Assessment & Mitigation Strategies",
          "Basic Pitch Deck (6-8 professional slides)",
          "Professional Logo Design with 3 Variations",
          "Basic Brand Colors & Typography Guide",
          "3 Revision Rounds",
          "7-Day Delivery",
          "FREE 45-minute Strategy Consultation Call",
          "Business Plan Template & Guidelines"
        ]
      },
      {
        _key: "investor-plan-pkg",
        name: "Investor Plan",
        tier: "premium",
        price: 249,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: false,
        features: [
          "Investment-Grade Business Plan (25-35 pages)",
          "Professional Executive Summary (3 pages)",
          "Comprehensive Market Research & Analysis",
          "In-depth Competitive Intelligence Report",
          "5-Year Financial Modeling with Scenarios",
          "Detailed Revenue Model & Unit Economics",
          "Complete Go-to-Market Strategy",
          "Management Team Profiles & Advisory Board",
          "Professional Pitch Deck (12-15 slides)",
          "Investment Summary One-Pager",
          "Complete Brand Identity Package (Logo, Colors, Fonts)",
          "Business Cards & Letterhead Design",
          "Industry-Specific Legal Structure Recommendations",
          "Funding Strategy & Investment Timeline",
          "Unlimited Revisions for 30 Days",
          "10-Day Development Timeline",
          "FREE 2-Hour Strategy & Pitch Practice Session",
          "Investor Network Introduction (qualified businesses)",
          "30-Day Post-Delivery Support"
        ]
      }
    ],
    requirements: [
      "Business concept or idea description",
      "Target market information (if available)",
      "Basic financial information or goals",
      "Company name and any existing branding materials",
      "Timeline and funding goals (if seeking investment)"
    ],
    faq: [
      {
        _key: "faq-1",
        question: "How long does it take to create a business plan?",
        answer: "Our business plans typically take 5-14 days depending on the package chosen. The Starter Plan takes 5-7 days, Growth Plan takes 7-10 days, and Investor Plan takes 10-14 days."
      },
      {
        _key: "faq-2",
        question: "Will my business plan help me get funding?",
        answer: "Yes! Our business plans are specifically designed to attract investors and lenders. 78% of our clients successfully secure funding, which is 3x higher than the industry average."
      },
      {
        _key: "faq-3",
        question: "What's included in the logo design?",
        answer: "All our packages include professional logo design with multiple concepts, unlimited revisions, high-resolution files in various formats (PNG, JPG, SVG), and commercial usage rights."
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Web & Mobile Development",
    slug: {
      _type: "slug",
      current: "web-and-mobile-software-development"
    },
    description: "Professional web and mobile application development services to bring your digital ideas to life.",
    serviceType: "web",
    icon: "code",
    featured: true,
    packages: [
      {
        _key: "landing-page-pkg",
        name: "Landing Page",
        tier: "basic",
        price: 149,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: [
          "Single Page Design",
          "Mobile Responsive",
          "Contact Form",
          "Basic SEO Setup",
          "Social Media Links",
          "2 Revision Rounds",
          "5-day delivery",
          "FREE Stock Images"
        ]
      },
      {
        _key: "business-website-pkg",
        name: "Business Website",
        tier: "standard",
        price: 349,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: true,
        features: [
          "Up to 6 Pages",
          "Mobile Responsive Design",
          "Basic CMS (Content Management)",
          "Contact Forms",
          "SEO Optimization",
          "Google Analytics Setup",
          "Social Media Integration",
          "SSL Certificate",
          "3 Revision Rounds",
          "10-day delivery",
          "FREE Logo Design"
        ]
      },
      {
        _key: "ecommerce-website-pkg",
        name: "E-commerce Store",
        tier: "premium",
        price: 649,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "14-21 days",
        popular: false,
        features: [
          "Up to 25 Products",
          "Payment Gateway Integration",
          "Basic Inventory Management",
          "Order Management System",
          "Customer Account System",
          "Mobile Responsive",
          "SEO Optimized",
          "Basic Analytics",
          "3 Revision Rounds",
          "14-day delivery",
          "FREE 2-hour training session"
        ]
      },
      {
        _key: "mobile-app-pkg",
        name: "Mobile App Development",
        tier: "premium",
        price: 999,
        currency: "USD",
        billing: "project",
        deliveryTime: "21-30 days",
        popular: false,
        features: [
          "iOS & Android App",
          "Cross-Platform Development",
          "Custom UI/UX Design",
          "Backend API Integration",
          "Push Notifications",
          "App Store Deployment",
          "User Authentication",
          "Offline Functionality",
          "Analytics Integration",
          "3 Months Support",
          "Source Code Included",
          "App Store Optimization"
        ]
      }
    ],
    requirements: [
      "Project scope and requirements document",
      "Design preferences and brand guidelines",
      "Content and images for the website/app",
      "Third-party service accounts (if needed)",
      "Domain name and hosting preferences"
    ],
    faq: [
      {
        _key: "web-faq-1",
        question: "How long does it take to build a website?",
        answer: "Development time varies by complexity: Landing pages take 5-7 days, business websites take 10-14 days, and e-commerce sites take 14-21 days."
      },
      {
        _key: "web-faq-2",
        question: "Will my website work on mobile devices?",
        answer: "Yes! All our websites are fully responsive and optimized for mobile, tablet, and desktop devices."
      },
      {
        _key: "web-faq-3",
        question: "Do you provide ongoing maintenance?",
        answer: "We offer ongoing maintenance packages and provide initial support. Long-term maintenance can be arranged separately."
      },
      {
        _key: "web-faq-4",
        question: "Can you build mobile apps for both iOS and Android?",
        answer: "Yes, we specialize in cross-platform development that creates apps for both iOS and Android from a single codebase, saving time and cost."
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Social Media Marketing",
    slug: {
      _type: "slug",
      current: "social-media-marketing"
    },
    description: "Professional social media management and marketing services to grow your brand and engage your audience.",
    serviceType: "marketing",
    icon: "network",
    featured: true,
    packages: [
      {
        _key: "social-starter-pkg",
        name: "Social Starter",
        tier: "basic",
        price: 99,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: false,
        features: [
          "2 Platform Management (Instagram + Facebook)",
          "15 Custom Designed Posts/month",
          "5 Instagram Stories per week",
          "Basic Content Calendar Planning",
          "Daily Community Management (1-2 hours)",
          "Monthly Performance Report",
          "10 Premium Stock Images/month",
          "Hashtag Strategy (15-25 researched tags per post)",
          "Basic Brand Voice Development",
          "2 Revision Rounds for Content",
          "Email Support (48-hour response)"
        ]
      },
      {
        _key: "marketing-pro-pkg",
        name: "Marketing Pro",
        tier: "standard",
        price: 249,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: true,
        features: [
          "4 Platform Management (Instagram, Facebook, LinkedIn, Twitter)",
          "30 Custom Designed Posts/month",
          "12 Instagram/Facebook Stories per week",
          "Comprehensive Content Strategy & Editorial Calendar",
          "Basic Facebook/Instagram Ads Setup ($100 ad spend included)",
          "Daily Community Management (3-4 hours)",
          "Bi-weekly Performance Reports with Insights",
          "Email Marketing Setup (MailChimp/ConvertKit integration)",
          "Basic Local SEO Optimization (Google My Business)",
          "25 Premium Stock Images/month",
          "Brand Guidelines Development",
          "Competitor Analysis Report",
          "3 Revision Rounds for Content",
          "Phone/Email Support (24-hour response)"
        ]
      },
      {
        _key: "growth-accelerator-pkg",
        name: "Growth Accelerator",
        tier: "premium",
        price: 449,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: false,
        features: [
          "6 Platform Management (Instagram, Facebook, LinkedIn, Twitter, TikTok, YouTube)",
          "50+ Custom Posts/month across all platforms",
          "20 Stories/Reels per week + 4 YouTube videos/month",
          "Advanced Content Strategy with A/B Testing",
          "Paid Ad Campaign Management ($300 ad spend included)",
          "Advanced Analytics Dashboard & Weekly Reporting",
          "Weekly 30-minute Strategy Calls",
          "Email Marketing Automation (Sequences, Funnels)",
          "Advanced SEO Optimization & Local Search",
          "Influencer Partnership Outreach (5 contacts/month)",
          "Growth Hacking Implementation",
          "Custom Graphics & Video Content Creation",
          "Unlimited Premium Stock Images/Videos",
          "Complete Brand Asset Library",
          "Unlimited Revisions",
          "Priority Support (2-hour response)"
        ]
      }
    ],
    requirements: [
      "Access to social media accounts or willingness to create them",
      "Brand guidelines or logo (if available)",
      "Target audience information",
      "Content preferences and brand voice guidance",
      "Access to website/business information"
    ]
  },
  {
    _type: "serviceCategory",
    title: "Mentoring & Consulting",
    slug: {
      _type: "slug",
      current: "mentoring-and-consulting"
    },
    description: "Professional business mentoring and consulting services to accelerate your growth and success.",
    serviceType: "consulting",
    icon: "settings",
    featured: true,
    packages: [
      {
        _key: "strategy-session-pkg",
        name: "Strategy Session",
        tier: "basic",
        price: 99,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "1-2 days to schedule",
        popular: false,
        features: [
          "90-minute Deep-Dive Video Consultation",
          "Pre-session Business Assessment Questionnaire",
          "SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)",
          "Personalized 5-Step Action Plan with Timeline",
          "Resource Library Access (Templates, Guides, Tools)",
          "Priority Matrix for Next 90 Days",
          "Detailed Follow-up Summary Report (5-7 pages)",
          "7-Day Email Support for Clarifications",
          "Recommended Reading List",
          "Industry Benchmarking Insights"
        ]
      },
      {
        _key: "mentoring-program-pkg",
        name: "Mentoring Program",
        tier: "standard",
        price: 299,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: true,
        features: [
          "4 One-Hour Video Sessions per Month",
          "Personalized 12-Month Growth Roadmap",
          "Skill Assessment with Gap Analysis",
          "Industry-Specific Career Development Guidance",
          "Weekly Goal Setting & Accountability Check-ins",
          "Access to Mentor's Professional Network",
          "Exclusive Resource Library (500+ business templates)",
          "Monthly Progress Review with KPI Tracking",
          "Unlimited WhatsApp/Email Support",
          "Resume/LinkedIn Profile Optimization",
          "Mock Interview Sessions (2 per month)",
          "Industry Trend Reports & Insights",
          "Certificate of Completion"
        ]
      },
      {
        _key: "full-consulting-pkg",
        name: "Full Consulting Package",
        tier: "enterprise",
        price: 1999,
        currency: "USD",
        billing: "project",
        deliveryTime: "3-6 months",
        popular: false,
        features: [
          "Complete Business Audit & Assessment (40+ point checklist)",
          "Strategic Business Plan Development (25+ pages)",
          "Financial Analysis & Optimization Recommendations",
          "Market Research & Competitive Analysis",
          "Operational Process Mapping & Optimization",
          "Technology Stack Assessment & Recommendations",
          "Team Training Workshops (4 sessions, 2 hours each)",
          "3-Month Implementation Support with Weekly Check-ins",
          "Custom KPI Dashboard Setup & Training",
          "Risk Assessment & Mitigation Strategies",
          "Vendor/Partner Evaluation & Recommendations",
          "Legal & Compliance Review Checklist",
          "Scalability Planning for Next 3-5 Years",
          "Executive Summary for Stakeholders",
          "Unlimited Phone/Email Support during Engagement",
          "6-Month Post-Implementation Review Session"
        ]
      }
    ],
    requirements: [
      "Current business overview or career summary",
      "Specific goals and challenges you're facing",
      "Financial information (for business consulting)",
      "Availability for scheduled sessions",
      "Willingness to implement recommended changes"
    ]
  },
  {
    _type: "serviceCategory",
    title: "Profile & Portfolio Building",
    slug: {
      _type: "slug",
      current: "profile-and-portfolio-building"
    },
    description: "Professional portfolio websites and personal branding services to showcase your work and attract clients.",
    serviceType: "profile",
    icon: "monitor",
    featured: false,
    packages: [
      {
        _key: "professional-profile-pkg",
        name: "Professional Profile",
        tier: "basic",
        price: 199,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: [
          "Single-Page Modern Portfolio Design",
          "Mobile & Tablet Responsive Layout",
          "Portfolio Gallery (Up to 12 Projects)",
          "High-Resolution Image Optimization",
          "Professional Bio & Skills Section",
          "Contact Form with Auto-Response",
          "Social Media Integration (5 platforms)",
          "Basic SEO Setup (Meta tags, descriptions)",
          "PDF Resume/CV Download Feature",
          "Google Fonts Integration",
          "2 Revision Rounds",
          "5-Day Delivery",
          "FREE Stock Photos (up to 10)",
          "30-Day Email Support"
        ]
      },
      {
        _key: "portfolio-website-pkg",
        name: "Portfolio Website",
        tier: "standard",
        price: 399,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: true,
        features: [
          "Multi-Page Portfolio Site (Home, About, Portfolio, Services, Contact)",
          "Detailed Project Case Studies (Up to 20 projects)",
          "About Page with Professional Story",
          "Services/Pricing Page",
          "Blog Section (5 starter posts included)",
          "Advanced Contact Forms with File Upload",
          "Client Testimonials Section",
          "Skills & Experience Timeline",
          "SEO Optimization (On-page + Technical)",
          "Google Analytics & Search Console Setup",
          "Social Media Feed Integration",
          "Newsletter Signup Integration",
          "Fast Loading Optimization",
          "SSL Certificate Setup",
          "3 Revision Rounds",
          "10-Day Delivery",
          "FREE Professional Photography Consultation",
          "90-Day Support & Maintenance"
        ]
      },
      {
        _key: "brand-website-pkg",
        name: "Premium Brand Site",
        tier: "premium",
        price: 799,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "21-30 days",
        popular: false,
        features: [
          "Full Brand Website (8+ pages) with Custom Design",
          "Advanced Portfolio Features (Video showcases, animations)",
          "Client Portal for Project Management",
          "Online Service Booking System",
          "Payment Integration (Stripe/PayPal)",
          "E-commerce Store (Up to 50 products)",
          "Client Testimonial Collection System",
          "Advanced SEO & Local Search Optimization",
          "Social Media Management Integration",
          "Email Marketing Automation Setup",
          "Advanced Analytics Dashboard",
          "Multi-language Support (2 languages)",
          "Live Chat Integration",
          "Custom Domain & Premium Hosting (1 year)",
          "Brand Guidelines Document",
          "Professional Content Writing (5 pages)",
          "Advanced Security Features",
          "Unlimited Revisions",
          "21-Day Development Period",
          "6-Month Priority Support & Updates",
          "FREE Professional Brand Consultation"
        ]
      }
    ],
    requirements: [
      "Portfolio samples or previous work examples",
      "Professional headshots or photos",
      "Bio/About information",
      "List of services offered (if applicable)",
      "Target audience and goals"
    ]
  }
]

async function populateSanityServices() {
  console.log('🚀 Starting Sanity service data migration...')
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is required')
    console.log('💡 Add your Sanity write token to .env.local:')
    console.log('   SANITY_API_TOKEN=your_token_here')
    process.exit(1)
  }

  try {
    console.log(`📝 Preparing to create ${serviceCategories.length} service categories...`)
    
    for (const serviceData of serviceCategories) {
      console.log(`\n📦 Creating service: ${serviceData.title}`)
      
      try {
        // Check if service already exists
        const existing = await client.fetch(
          `*[_type == "serviceCategory" && slug.current == $slug][0]`,
          { slug: serviceData.slug.current }
        )

        if (existing) {
          console.log(`⚠️  Service "${serviceData.title}" already exists. Updating...`)
          const result = await client
            .patch(existing._id)
            .set({
              ...serviceData,
              _id: undefined, // Remove _id from the update
              _updatedAt: new Date().toISOString()
            })
            .commit()
          console.log(`✅ Updated: ${result.title}`)
        } else {
          const result = await client.create(serviceData)
          console.log(`✅ Created: ${result.title}`)
        }
      } catch (error) {
        console.error(`❌ Failed to create ${serviceData.title}:`, error.message)
      }
    }

    console.log('\n🎉 Service data migration completed!')
    console.log('👀 You can view your services in Sanity Studio at: http://localhost:3000/studio')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
populateSanityServices()