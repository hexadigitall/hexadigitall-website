import { Suspense } from 'react'
import type { Metadata } from 'next'
import { generateSiteSEO } from '@/components/SiteSEO'
import JhemaProposalClient from './proposal-client'

const pagePath = '/proposals/jhema-wears'
const pageTitle = 'E-Commerce Proposal for Jhema Wears'
const pageDescription = 'Tailored e-commerce launch plan with tiered packages, Paystack checkout, and social-share ready OG links for Jhema Wears.'

export const metadata: Metadata = generateSiteSEO({
  title: pageTitle,
  description: pageDescription,
  path: pagePath,
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'}/og-images/proposal-jhema-wears.jpg`,
  imageAlt: 'Jhema Wears e-commerce proposal preview',
  type: 'article',
  tags: ['e-commerce', 'fashion', 'Jhema Wears', 'Paystack', 'proposal'],
})

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading proposal…</div>}>
      <JhemaProposalClient />
    </Suspense>
  )
}
