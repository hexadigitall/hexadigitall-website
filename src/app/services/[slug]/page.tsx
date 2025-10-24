import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  getServiceCategoryBySlug, 
  getIndividualServices, 
  getAllServiceCategories
} from '@/lib/sanity-queries'
import { ServiceCategory, IndividualService, ServiceStats } from '@/types/service'
import DynamicServicePage from '@/components/services/DynamicServicePage'

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all service pages
export async function generateStaticParams() {
  try {
    const services = await getAllServiceCategories()
    return services.map((service) => ({
      slug: service.slug.current,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each service page
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const serviceCategory = await getServiceCategoryBySlug(slug)
    
    if (!serviceCategory) {
      return {
        title: 'Service Not Found',
        description: 'The requested service could not be found.'
      }
    }

    return {
      title: `${serviceCategory.title} Services | Professional ${serviceCategory.serviceType} Solutions`,
      description: serviceCategory.description,
      keywords: `${serviceCategory.title.toLowerCase()}, ${serviceCategory.serviceType}, professional services, hexadigitall`,
      openGraph: {
        title: `${serviceCategory.title} Services`,
        description: serviceCategory.description,
        images: [
          {
            url: `/images/services/${slug}.jpg`,
            width: 1200,
            height: 630,
            alt: serviceCategory.title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${serviceCategory.title} Services`,
        description: serviceCategory.description,
        images: [`/images/services/${slug}.jpg`]
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Service Page',
      description: 'Professional services by Hexadigitall'
    }
  }
}

// Service stats configuration by service type
const getServiceStats = (serviceType: string): ServiceStats => {
  const statsConfig: Record<string, ServiceStats> = {
    'business': {
      fundingSuccessRate: 78,
      totalFundingRaised: '₦2.8B+',
      averageRevenueGrowth: 85,
      averageDeliveryTime: '5-Day'
    },
    'marketing': {
      fundingSuccessRate: 92,
      totalFundingRaised: '150M+',
      averageRevenueGrowth: 67,
      averageDeliveryTime: '24-Hour'
    },
    'consulting': {
      fundingSuccessRate: 89,
      totalFundingRaised: '500M+',
      averageRevenueGrowth: 145,
      averageDeliveryTime: '2-Week'
    },
    'web': {
      fundingSuccessRate: 96,
      totalFundingRaised: '100M+',
      averageRevenueGrowth: 120,
      averageDeliveryTime: '10-Day'
    },
    'profile': {
      fundingSuccessRate: 95,
      totalFundingRaised: '50M+',
      averageRevenueGrowth: 78,
      averageDeliveryTime: '7-Day'
    }
  }

  return statsConfig[serviceType] || statsConfig['business']
}

async function getServiceData(slug: string): Promise<{
  serviceCategory: ServiceCategory | null
  individualServices: IndividualService[]
}> {
  try {
    // Try to fetch from Sanity first
    const serviceCategory = await getServiceCategoryBySlug(slug)
    const individualServices = getIndividualServices()

    return {
      serviceCategory,
      individualServices: individualServices.filter(service => 
        !serviceCategory || service.category === serviceCategory.serviceType
      )
    }
  } catch (error) {
    console.error('Error fetching service data:', error)
    return {
      serviceCategory: null,
      individualServices: []
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const { serviceCategory, individualServices } = await getServiceData(slug)

  if (!serviceCategory) {
    notFound()
  }

  const serviceStats = getServiceStats(serviceCategory.serviceType)

  return (
    <DynamicServicePage
      serviceCategory={serviceCategory}
      individualServices={individualServices}
      serviceStats={serviceStats}
    />
  )
}