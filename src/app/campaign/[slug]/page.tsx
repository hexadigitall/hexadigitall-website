import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CampaignLeadForm } from '@/components/campaign/CampaignLeadForm'

const CAMPAIGNS: Record<string, {
  title: string
  subtitle: string
  heroImage: string
  service: string
  headline: string
  bullets: string[]
  checklist: string[]
  path: string
}> = {
  almp: {
    title: 'Aggressive Local Market Penetration (ALMP)',
    subtitle: '7 cities, 5 services, 60 days of focused execution.',
    heroImage: 'https://hexadigitall.com/og-images/services-hub.jpg',
    service: 'Web Development',
    headline: 'Build, launch, and optimize every week with city-targeted offers.',
    bullets: [
      '7-city rollout across Lagos, Abuja, Calabar, Kano, Port Harcourt, Benin, and Ibadan.',
      '4 platform mix: WhatsApp, Instagram, Facebook, LinkedIn.',
      'Daily content schedule with pre-written copy and UTM tracking baked in.',
      'Lead capture flows already wired to Admin > Submissions in real time.',
    ],
    checklist: [
      'Book a consultation: we respond within 24 hours.',
      'Pick your city + service: we localize copy & OG images.',
      'Approve the landing page draft: we deploy in minutes.',
      'Start posts at 8 AM: your links track every click.',
    ],
    path: '/campaign/almp',
  },
  'web-dev': {
    title: 'City-Focused Web Development Campaign',
    subtitle: 'Custom web builds with launch-ready traffic plans.',
    heroImage: 'https://hexadigitall.com/og-images/service-web-development.jpg',
    service: 'Web Development',
    headline: 'Launch a high-converting website with city-specific credibility signals.',
    bullets: [
      'Landing page copy tailored to your city and industry.',
      'OG images already prepared for all target cities.',
      'UTM tracking pre-configured for WhatsApp, Instagram, and Facebook.',
      'Admin dashboard shows every lead with campaign metadata.',
    ],
    checklist: [
      'Tell us your city and service package.',
      'We deploy the landing page with the right OG image.',
      'Share the tracked links and post across your channels.',
      'Monitor leads live in the admin dashboard.',
    ],
    path: '/campaign/web-dev',
  },
  'digital-marketing': {
    title: 'Digital Marketing Conversion Sprint',
    subtitle: 'Full-funnel ads + organic with ready-to-go tracking.',
    heroImage: 'https://hexadigitall.com/og-images/service-digital-marketing.jpg',
    service: 'Digital Marketing',
    headline: 'Deploy persuasive ads, posts, and landing pages in hours, not weeks.',
    bullets: [
      'Prebuilt swipe copy for ads and social across 7 cities.',
      'UTM links auto-generated for every post and platform.',
      'GA4 + Admin dashboard gives real-time lead visibility.',
      'Email follow-up templates included in campaign docs.',
    ],
    checklist: [
      'Select your city and offer focus.',
      'We localize the landing page and OG previews.',
      'Publish posts with provided UTM links.',
      'Track submissions and reply from the admin panel.',
    ],
    path: '/campaign/digital-marketing',
  },
  'business-planning': {
    title: 'Business Planning & Pitch Campaign',
    subtitle: 'Investor-ready plans, logos, and websites with lead capture wired in.',
    heroImage: 'https://hexadigitall.com/og-images/service-business-planning.jpg',
    service: 'Business Planning',
    headline: 'Win investor and partner attention with localized proof and fast follow-up.',
    bullets: [
      'Localized credibility (city-specific OG images and case angles).',
      'Forms capture all lead data directly into Sanity with UTM context.',
      'Admin filters by city, source, and status to prioritize hot leads.',
      'Share-ready tracking links for WhatsApp, Instagram, and LinkedIn.',
    ],
    checklist: [
      'Share your city and ideal audience.',
      'We publish a focused landing page with tailored proof.',
      'Distribute tracked links to your channels.',
      'Review incoming leads in real time and follow up fast.',
    ],
    path: '/campaign/business-planning',
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = CAMPAIGNS[params.slug]
  if (!page) {
    return {}
  }

  return {
    title: `${page.title} | Hexadigitall`,
    description: page.subtitle,
    openGraph: {
      title: page.title,
      description: page.subtitle,
      url: `https://hexadigitall.com${page.path}`,
      images: [{ url: page.heroImage, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.subtitle,
      images: [page.heroImage],
    },
  }
}

export default function CampaignPage({ params }: { params: { slug: string } }) {
  const page = CAMPAIGNS[params.slug]
  if (!page) {
    notFound()
  }

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-primary to-[#001F3F] text-white py-14 md:py-18">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl">
            <p className="text-sm uppercase tracking-widest text-[#00D9FF] mb-4">Campaign Landing</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">{page.subtitle}</p>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-100">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#00D9FF]" />
                  <p>{page.headline}</p>
                </div>
                {page.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-3">Fast start checklist</p>
                <ul className="space-y-2 text-white">
                  {page.checklist.map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00D9FF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-blue-100">
                  <span className="px-3 py-1 rounded-full border border-white/20">GA4 + Admin dashboard ready</span>
                  <span className="px-3 py-1 rounded-full border border-white/20">UTM tracking baked in</span>
                  <span className="px-3 py-1 rounded-full border border-white/20">OG images live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full bg-gray-100">Service: {page.service}</span>
              <span className="px-3 py-1 rounded-full bg-gray-100">Campaign: dec_jan_2025</span>
              <span className="px-3 py-1 rounded-full bg-gray-100">Cities: Lagos, Abuja, Calabar, Kano, Port Harcourt, Benin, Ibadan</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-primary">What you get in 48 hours</h2>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-secondary" />Landing page deployed with OG image + UTM-ready links</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-secondary" />Admin visibility of every lead with campaign metadata</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-secondary" />GA4 tracking active with source/medium captured</li>
                <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-secondary" />Prewritten posts and captions from campaign docs</li>
              </ul>
              <div className="text-sm text-gray-600">
                Need another service? View the <Link href="/services" className="text-secondary underline">services hub</Link> or <Link href="/tools/utm" className="text-secondary underline">generate UTM links</Link> instantly.
              </div>
            </div>
          </div>
          <div>
            <CampaignLeadForm campaignName="dec_jan_2025" defaultService={page.service} />
          </div>
        </div>
      </section>
    </div>
  )
}
