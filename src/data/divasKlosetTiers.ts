export type DivasTier = {
  slug: string
  name: string
  tagline: string
  headline: string
  price: number
  currency: 'NGN' | 'USD'
  billingType: string
  summary: string
  deliverables: string[]
  highlights?: string[]
}

export const divasKlosetTiers: DivasTier[] = [
  {
    slug: 'option-1',
    name: 'The "Kickstarter" Package',
    tagline: 'Consistency, Polish & Professionalism',
    headline: 'Remote Digital Headquarters',
    price: 300000,
    currency: 'NGN',
    billingType: 'Monthly Retainer (Minimum 1 Month)',
    summary: 'The fashion brand that has the energy to capture content but lacks the time or technical skill to edit, strategize, and post professionally. We take your raw inputs and turn them into gold. We ensure Diva\'s Kloset never goes silent.',
    deliverables: [
      'Profile Optimization: One-time overhaul of Instagram Bio, Name, and Link-in-Bio structure for SEO',
      'Content Pillars: Definition of 3 key themes for the month',
      'Hashtag Strategy: 3 distinct hashtag sets to rotate and avoid shadowbanning',
      '5 Posts Per Week (20 Posts per Month)',
      '3x High-End Graphic Flyers/Carousels (Sales offers, Reviews, Educational)',
      '2x Reels Per Week with professional editing, trending audio, transitions, and color grading',
      '3x Story Designs per week for Sales or Engagement',
      'Professional, engaging captions for all posts with strong Calls to Action',
      'Engagement Monitoring: 1 hour daily (Mon-Fri) comment section management',
      'Spam Control: Deleting bot comments and competitor spam',
      'Monthly PDF Report: Follower growth, top posts, reach & impressions, recommendations',
    ],
    highlights: [
      'Senior Editor and Content Strategist (no interns)',
      'Custom, high-fashion visuals—not generic Canva templates',
      'Content Drop workflow system (Plan → Upload → Edit → Schedule)',
      'Profile optimization and first week ready within 3 days of signing',
      'Reliability guaranteed—no excuses about light or network',
      'Reel expertise optimized for algorithm growth',
    ],
  },
  {
    slug: 'option-2',
    name: 'The "Diva Takeover" Package',
    tagline: 'Aggressive Growth, Visibility & Sales Conversion',
    headline: 'Chief Marketing Office',
    price: 650000,
    currency: 'NGN',
    billingType: 'Monthly Retainer (Minimum 1 Month)',
    summary: 'The "Growth Engine" solution for brands tired of slow organic growth. We deploy a 360-degree strategy combining Content + Influencers + Ads. We don\'t just post; we campaign to ensure Diva\'s Kloset is the only brand your customers talk about.',
    deliverables: [
      'The "Detty December" Blueprint: Phase 1-4 break-into-market strategy execution',
      'Weekly Competitor Analysis: Monitoring competitors to stay one step ahead',
      'Virtual Creative Direction: Storyboards and exact filming instructions',
      '7 Posts Per Week (Daily Posting)',
      '4x Reels Per Week with trend-driven edits designed for virality',
      '3x Static/Carousel Posts (Sales graphics, catalogs, testimonials)',
      'Daily Active Story Management (Polls, Q&A, Countdowns)',
      'Custom Graphic Design Suite for Flash Sales, Sold Out alerts, promos',
      'Influencer Squad Management: Scouting, vetting, and negotiation of 3-5 micro-influencers',
      'Influencer Logistics: Coordination of "Slay Kits" delivery and compliance tracking',
      'Meta Ads Management: 2 distinct ad campaigns (Traffic/Sales + Retargeting)',
      'A/B Testing: Headlines, images, and cost-per-result optimization',
      'Community Support: 2 hours daily engagement including weekends during peak promos',
      '"Soft" Sales Closing: Replying to comments with direct item links',
    ],
    highlights: [
      'RECOMMENDED: Removes need for full-time Marketing Manager + Ad Specialist',
      'Influencer management handles 15 hours/month of coordination',
      'Ad expertise prevents ₦100k daily waste from poor setup',
      'Multiplier Effect: Content + Influencers + Ads = Network Effect (1 + 1 = 10)',
      'Weekly strategy calls to review stock and priorities',
      'Ad budget (₦5,000-₦10,000/day) and influencer fees paid separately by client',
      'Designed to clear end-of-year inventory and build massive customer list for 2026',
    ],
  },
  {
    slug: 'option-3',
    name: 'The "Empire" Package',
    tagline: 'Total Brand Automation & Concierge Service',
    headline: 'The "Boss" who acts as CEO, not employee',
    price: 1200000,
    currency: 'NGN',
    billingType: 'Monthly Retainer (Minimum 1 Month)',
    summary: 'A seamless, high-end machine running your marketing while you focus on sourcing inventory and counting profits. We don\'t just guide you; we do it for you.',
    deliverables: [
      '1x Full Production Day per month (6-hour shoot with Director + Mobile Videographer)',
      'Professional lighting, gimbals, and model direction',
      'Month\'s worth of high-quality Reels and TikToks content',
      'Concierge Sales Closing: DM management 9 AM – 6 PM (Monday – Saturday)',
      'Customer inquiry handling, size confirmation, payment processing',
      '4x Broadcast messages per month (Email/WhatsApp marketing)',
      'Cross-platform posting (Instagram, TikTok, YouTube Shorts)',
      'Trend jacking (ride viral trends within 24 hours)',
      'Priority crisis management support',
      'Bi-weekly strategy meetings analyzing sales data',
    ],
    highlights: [
      'Replaces: Content Creator + Social Media Manager + Sales Assistant',
      'Staff Cost Replacement: Saves ₦600k+ monthly vs. in-house hiring',
      'Limited to 2 clients only due to intensive nature',
    ],
  },
  {
    slug: 'option-4',
    name: 'The "Diva Blueprint" Package',
    tagline: 'Strategy, Setup & Staff Training',
    headline: 'Professional guidance with in-house execution',
    price: 250000,
    currency: 'NGN',
    billingType: 'One-Time Project Fee',
    summary: 'A DIY solution with professional guidance. We build the car, give you the map, and teach you how to drive. Perfect for owners with a team but lacking strategy and technical know-how.',
    deliverables: [
      '30-Day Content Calendar (daily posting guide)',
      '20 Pre-written "Fill-in-the-blank" captions',
      '5 custom, editable Canva templates (Quote, Sales, Reviews, New Arrival)',
      'Instagram Bio & Highlights professional revamp',
      'WhatsApp tracking link setup',
      'Facebook Ads Manager account audit',
      '3 distinct saved audiences (Lagos/Abuja Spender, Party Girl, Retargeting)',
      '2 high-converting Ad Graphics',
      '2-Hour Live Training Session (Zoom or In-Person)',
      'Training topics: Filming Reels, CapCut editing, running ads, DM sales scripts',
    ],
    highlights: [
      'Completed in 14 days (Days 1-3 Audit, Days 4-7 Design, Days 8-10 Ad Setup, Days 11-14 Training)',
      'Professional assets usable for years, not just Christmas',
      'Empower your team to run independently',
    ],
  },
]
