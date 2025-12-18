import type { Metadata } from 'next'
import { Suspense } from 'react'
import { generateSiteSEO } from '@/components/SiteSEO'
import DivasProposalClient from '../../divas-kloset/proposal-client'

function titleCaseFromSlug(slug: string) {
  return slug
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ client: string }> }): Promise<Metadata> {
  const { client } = await params
  const company = titleCaseFromSlug(client || 'your-business')
  return generateSiteSEO({
    title: `Social Media Marketing Proposal for ${company}`,
    description: 'Comprehensive social media management packages designed for fashion retailers. From content creation to influencer marketing and ads.',
    path: `/proposals/social-media-marketing/${client}`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'}/og-images/proposal-divas-kloset.jpg`,
    imageAlt: 'Social media marketing proposal preview',
    type: 'article',
    tags: ['social media marketing', 'fashion retail', 'proposal', 'Paystack'],
  })
}

export default async function Page({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params
  const company = titleCaseFromSlug(client || 'your-business')
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading proposal…</div>}>
      <DivasProposalClient companyName={company} />
    </Suspense>
  )
}
