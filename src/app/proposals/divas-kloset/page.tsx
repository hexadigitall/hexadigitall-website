import { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateSiteSEO } from '@/components/SiteSEO'
import DivasProposalClient from './proposal-client'

const pagePath = '/proposals/divas-kloset'
const pageTitle = 'Social Media Marketing Proposal for Diva\'s Kloset'
const pageDescription = 'Comprehensive social media management packages designed for fashion retailers. From content creation to influencer marketing and ads.'

export const metadata: Metadata = generateSiteSEO({
  title: pageTitle,
  description: pageDescription,
  path: pagePath,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'}/og-images/proposal-divas-kloset.jpg`,
  imageAlt: 'Diva\'s Kloset social media marketing proposal preview',
  type: 'article',
  tags: ['social media marketing', 'fashion retail', 'Diva\'s Kloset', 'Paystack', 'proposal'],
})

export default function DivasKlosetProposalPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading proposal…</div>}>
      <DivasProposalClient companyName="Diva's Kloset" />
    </Suspense>
  )
}
