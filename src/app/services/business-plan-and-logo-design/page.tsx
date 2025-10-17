import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  getServiceCategoryBySlug, 
  getIndividualServices, 
  getFallbackServiceCategory 
} from '@/lib/sanity-queries'
import { ServiceCategory, IndividualService, ServiceStats } from '@/types/service'
import BusinessServicePage from '@/components/services/BusinessServicePage'

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Business Plan & Logo Design Services | Professional Business Foundation',
  description: 'Launch your business with confidence. Professional business plans, stunning logos, and complete brand packages that establish credibility and attract investors.',
  keywords: 'business plan, logo design, brand identity, startup services, investor pitch deck, business planning',
  openGraph: {
    title: 'Business Plan & Logo Design Services',
    description: 'Complete business planning and brand identity services to launch your business with confidence.',
    images: ['/images/services/business-plan-logo-design.jpg']
  }
}

// Service stats for display
const serviceStats: ServiceStats = {
  fundingSuccessRate: 78,
  totalFundingRaised: '₦2.8B+',
  averageRevenueGrowth: 85,
  averageDeliveryTime: '5-Day'
}

async function getServiceData(): Promise<{
  serviceCategory: ServiceCategory | null
  individualServices: IndividualService[]
}> {
  try {
    // Try to fetch from Sanity first
    const serviceCategory = await getServiceCategoryBySlug('business-plan-and-logo-design')
    const individualServices = getIndividualServices()

    // If no Sanity data, use fallback
    if (!serviceCategory) {
      const fallback = getFallbackServiceCategory('business-plan-and-logo-design')
      return {
        serviceCategory: fallback,
        individualServices
      }
    }

    return {
      serviceCategory,
      individualServices
    }
  } catch (error) {
    console.error('Error fetching service data:', error)
    
    // Return fallback data
    const fallback = getFallbackServiceCategory('business-plan-and-logo-design')
    return {
      serviceCategory: fallback,
      individualServices: getIndividualServices()
    }
  }
}

export default async function BusinessPlanLogoPage() {
  const { serviceCategory, individualServices } = await getServiceData()

  if (!serviceCategory) {
    notFound()
  }

  return (
    <BusinessServicePage
      serviceCategory={serviceCategory}
      individualServices={individualServices}
      serviceStats={serviceStats}
    />
  )
}