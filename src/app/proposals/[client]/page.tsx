import type { Metadata } from 'next'
import { generateSiteSEO } from '@/components/SiteSEO'
import JhemaProposalClient from '../jhema-wears/proposal-client'

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
    title: `E-Commerce Proposal for ${company}`,
    description: 'Tailored e-commerce launch plan with tiered packages, Paystack checkout, and social-share ready OG links.',
    path: `/proposals/${client}`,
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'}/og-images/proposal-generic.jpg`,
    imageAlt: 'E-commerce proposal preview',
    type: 'article',
    tags: ['e-commerce', 'fashion', 'proposal', 'Paystack'],
  })
}

export default async function Page({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params
  const company = titleCaseFromSlug(client || 'your-business')
  return <JhemaProposalClient companyName={company} />
}
