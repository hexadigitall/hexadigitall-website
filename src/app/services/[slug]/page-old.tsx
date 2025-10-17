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
  params: {
    slug: string
  }
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
  try {
    const serviceCategory = await getServiceCategoryBySlug(params.slug)
    
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
            url: `/images/services/${params.slug}.jpg`,
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
        images: [`/images/services/${params.slug}.jpg`]
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
const getServiceStats = (serviceType: string, slug: string): ServiceStats => {
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
  const { serviceCategory, individualServices } = await getServiceData(params.slug)

  if (!serviceCategory) {
    notFound()
  }

  const serviceStats = getServiceStats(serviceCategory.serviceType, params.slug)

  return (
    <DynamicServicePage
      serviceCategory={serviceCategory}
      individualServices={individualServices}
      serviceStats={serviceStats}
    />
  )
}
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      <article className="relative">
        {/* Enhanced Hero Section with Background Image */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/assets/images/team/diverse-team.jpg')`,
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90"></div>
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 animate-slide-up">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed animate-fade-in">
                {service.overview}
              </p>
              
              {/* Glass CTA Button */}
              <div className="mt-8">
                <a 
                  href="#packages" 
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  View Our Packages
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10" id="packages">
            <div className="max-w-4xl mx-auto">
              <div className="prose lg:prose-xl max-w-none card-enhanced p-8 rounded-2xl">
                <PortableText value={service.mainContent as Record<string, unknown>[]} />
              </div>
            </div>
            
            {/* Sub-Services Section for Web & Mobile Software Development */}
            {params.slug === 'web-and-mobile-software-development' && (
              <div className="mt-12 mb-12">
                <Suspense fallback={null}>
                  <FocusHandler serviceSlug={params.slug} />
                </Suspense>
                
                {/* Conditional content - hide detailed sections when customizing */}
                <ConditionalSections>
                  {/* Nigerian Launch Special Banner - Currency Aware */}
                  <NigerianBanner />
                
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full text-sm font-medium text-gray-700 mb-6">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Two Specialized Services, One Unified Solution</span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4" id="development-services">Choose Your Development Path</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                    Whether you need a stunning website or a powerful mobile app, our expert team delivers 
                    cutting-edge solutions tailored to your specific needs. Each service can stand alone or 
                    work together as part of a comprehensive digital strategy.
                  </p>
                </div>
                
                {/* Quote flow modals */}
                <WebMobileQuoteButtons />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Web Development */}
                  <div className="card-enhanced rounded-3xl p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:bg-blue-600 transition-colors duration-300">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-blue-900">Web Development</h3>
                          <p className="text-blue-600 text-sm font-medium">Frontend • Backend • Full-Stack</p>
                        </div>
                      </div>
                      <p className="text-blue-800 mb-6 leading-relaxed">
                        Create stunning, responsive websites and powerful web applications. From e-commerce platforms 
                        to complex business solutions, we build digital experiences that convert visitors into customers.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-center text-blue-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Responsive Design</span>
                        </div>
                        <div className="flex items-center text-blue-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">E-commerce</span>
                        </div>
                        <div className="flex items-center text-blue-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Web Applications</span>
                        </div>
                        <div className="flex items-center text-blue-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">CMS Integration</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <QuoteButtonWrapper quoteType="web">
                          <button 
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                          >
                            Get Web Development Quote
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </QuoteButtonWrapper>
                        <p className="text-center text-blue-600 text-sm">
                          <span className="font-medium">Starting from $299</span> • Free consultation included
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile App Development */}
                  <div className="card-enhanced rounded-3xl p-8 hover:scale-105 transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/20">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:bg-purple-600 transition-colors duration-300">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-purple-900">Mobile App Development</h3>
                          <p className="text-purple-600 text-sm font-medium">iOS • Android • Cross-Platform</p>
                        </div>
                      </div>
                      <p className="text-purple-800 mb-6 leading-relaxed">
                        Build powerful mobile applications that engage users and drive business growth. From simple utility 
                        apps to complex enterprise solutions, we create mobile experiences that users love.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-center text-purple-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">iOS & Android</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Cross-Platform</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">App Store Deploy</span>
                        </div>
                        <div className="flex items-center text-purple-700">
                          <svg className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Maintenance</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <QuoteButtonWrapper quoteType="mobile">
                          <button 
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                          >
                            Get Mobile App Quote
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </QuoteButtonWrapper>
                        <p className="text-center text-purple-600 text-sm">
                          <span className="font-medium">Starting from $499</span> • Free prototype included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cross-selling and Combined Solutions */}
                <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Most Popular Choice</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Digital Solution</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                      Get both web and mobile development as a unified package. Save money, ensure consistency, 
                      and accelerate your time to market with our integrated approach.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Cost Savings</h4>
                      <p className="text-gray-600 text-sm">Save up to 30% compared to separate projects</p>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Faster Delivery</h4>
                      <p className="text-gray-600 text-sm">Parallel development reduces overall timeline</p>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Brand Consistency</h4>
                      <p className="text-gray-600 text-sm">Unified design and user experience across platforms</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <QuoteButtonWrapper quoteType="complete">
                      <button 
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Get Complete Solution Quote
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </QuoteButtonWrapper>
                    <p className="mt-4 text-gray-600">
                      <span className="font-semibold text-gray-800">Starting from ₦576,675</span> (with 50% Nigerian discount) • 
                      <span className="text-green-600 font-medium">Save up to 30%</span> • 
                      <span className="text-blue-600">Free consultation & planning session</span>
                    </p>
                  </div>
                </div>
                
                {/* Dedicated Pricing Sections Based on Focus */}
                <div className="mt-16">
                  <Suspense fallback={null}>
                    <WebMobilePricingSections />
                  </Suspense>
                </div>
                </ConditionalSections>
              </div>
            )}

            {/* Service Payment Section */}
            <ServicePaymentSection 
              serviceTitle={service.title}
              serviceSlug={params.slug}
              serviceDescription={service.overview}
            />
          </div>
        </div>
        
        {/* Pricing Section */}
        <ServicePricingClient serviceSlug={params.slug} serviceName={service.title} />

        {/* Related Services */}
        {relatedServices && relatedServices.length > 0 && (
          <div className="bg-white py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-2">Related Services</h2>
                <p className="text-center text-gray-600 mb-12">
                  Explore our other professional services that might interest you
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedServices.map((relatedService: RelatedService) => (
                    <Link
                      key={relatedService.slug.current}
                      href={`/services/${relatedService.slug.current}`}
                      className="card-enhanced rounded-xl hover:scale-105 transition-all duration-300 p-6 group"
                    >
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {relatedService.overview}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                        Learn More 
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}

// This function remains the same
export async function generateStaticParams() {
  const slugs: { slug: { current:string } }[] = await client.fetch(groq`*[_type == "service"]{ slug }`);
  return slugs.map(({ slug }) => ({
    slug: slug.current,
  }));
}
