import { Metadata } from 'next'
import DivasProposalClient from './proposal-client'
import { SiteSEO } from '@/components/SiteSEO'

export const metadata: Metadata = {
  title: 'Social Media Marketing Proposal | Diva\'s Kloset',
  description: 'Comprehensive social media management packages designed for fashion retailers. From content creation to influencer marketing and ads.',
}

export default function DivasKlosetProposalPage() {
  return (
    <>
      <SiteSEO
        title="Social Media Marketing Proposal | Diva's Kloset"
        description="Comprehensive social media management packages designed for fashion retailers. From content creation to influencer marketing and ads."
        path="/proposals/divas-kloset"
        ogImage="/og-images/proposal-divas-kloset.jpg"
      />
      <DivasProposalClient companyName="Diva's Kloset" />
    </>
  )
}
