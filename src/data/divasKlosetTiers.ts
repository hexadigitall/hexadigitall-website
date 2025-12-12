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
