// src/app/services/page.tsx
"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { ServiceRequestFlow, ServiceCategory } from '@/components/services/ServiceRequestFlow'

interface Service {
  _id: string
  title: string
  slug: {
    current: string
  }
  overview: string
}

const servicesQuery = groq`*[_type == "service"]{
  _id,
  title,
  slug,
  overview
}`

const serviceCategoriesQuery = groq`*[_type == "serviceCategory"] | order(order asc, _createdAt desc) {
  _id,
  title,
  slug,
  description,
  icon,
  featured,
  packages,
  requirements,
  faq
}`

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          client.fetch(servicesQuery),
          client.fetch(serviceCategoriesQuery)
        ])
        setServices(servicesData)
        setServiceCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getServiceIcon = (iconName: string): React.ReactElement => {
    const icons: Record<string, React.ReactElement> = {
      'code': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'server': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      'monitor': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'mobile': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
        </svg>
      ),
      'chart': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'settings': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'network': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      'default': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
    
  return icons[iconName] || icons['default']
  }

  const getLowestPrice = (packages: any[]) => {
  type Package = { price?: number }
  if (!packages || packages.length === 0) return null
  const prices = (packages as Package[]).map(pkg => pkg.price).filter(price => price != null)
  return prices.length > 0 ? Math.min(...prices as number[]) : null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Services</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              We offer a complete suite of services to transform your ideas into successful digital realities.
            </p>
          </div>

          {/* Service Request Packages */}
          {serviceCategories.length > 0 && (
            <>
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-2">Service Packages</h2>
                <p className="text-center text-gray-600 mb-8">Professional IT services with transparent pricing and guaranteed delivery</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceCategories.map((service) => {
                    const lowestPrice = getLowestPrice(service.packages)
                    
                    return (
                      <div
                        key={service._id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border ${
                          service.featured ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        {service.featured && (
                          <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                            ⭐ Featured Service
                          </div>
                        )}
                        
                        <div className="p-8">
                          <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                              {getServiceIcon(service.icon)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {service.title}
                              </h3>
                              {lowestPrice && (
                                <p className="text-primary font-semibold">
                                  Starting from ${lowestPrice}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {service.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {service.packages?.length || 0} package{service.packages?.length !== 1 ? 's' : ''} available
                            </div>
                            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                              Request Service
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
          
          {/* Traditional Services */}
          {services.length > 0 && (
            <>
              <div className="border-t pt-16">
                <h2 className="text-3xl font-bold text-center mb-2">Additional Services</h2>
                <p className="text-center text-gray-600 mb-8">Explore our comprehensive range of digital transformation services</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.map((service) => (
                    <Link 
                      key={service._id} 
                      href={`/services/${service.slug.current}`}
                      className="block bg-lightGray p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <h2 className="text-2xl font-bold font-heading mb-3">{service.title}</h2>
                      <p className="text-darkText">{service.overview}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Call to Action - Improved Design */}
          <div className="mt-20 bg-gradient-to-r from-primary/10 via-white to-primary/10 border border-primary/20 shadow-lg rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-0">Need Custom Solutions?</h2>
            </div>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              Don&apos;t see exactly what you need? <span className="font-semibold text-primary">We specialize in creating custom IT solutions</span> tailored to your unique business requirements.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-primary text-white hover:bg-primary/90 font-semibold px-8 py-3 rounded-lg shadow transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Contact Us for Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestFlow
          serviceCategory={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}
