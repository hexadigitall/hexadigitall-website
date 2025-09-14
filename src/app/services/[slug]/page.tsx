// src/app/services/[slug]/page.tsx
import { client } from '@/sanity/client'
import { Suspense } from 'react'
import * as NextSanity from 'next-sanity'
import * as PortableTextReact from '@portabletext/react'

const { groq } = NextSanity
const { PortableText } = PortableTextReact
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ServicePricingClient from '@/components/services/ServicePricingClient'
import FocusHandler from '@/components/services/FocusHandler'
import WebMobilePricingSections from '@/components/services/WebMobilePricingSections'
import CustomizationWizard from '@/components/services/CustomizationWizard'
import CustomizeHandler from '@/components/services/CustomizeHandler'
import ConditionalSections from '@/components/services/ConditionalSections'

interface Service {
  title: string
  overview: string
  mainContent: Array<Record<string, unknown>>
}

interface RelatedService {
  title: string
  slug: {
    current: string
  }
  overview: string
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const service = await client.fetch<{ title: string }>(
    groq`*[_type == "service" && slug.current == $slug][0]{ title }`,
    { slug: params.slug }
  );
  if (!service) {
    return { title: "Service Not Found" };
  }
  return {
    title: `${service.title} | Hexadigitall`,
  };
}


const serviceQuery = groq`*[_type == "service" && slug.current == $slug][0]{
  title,
  overview,
  mainContent
}`;

// Query for related services (excluding current service)
const relatedServicesQuery = groq`*[_type == "service" && slug.current != $slug] | order(_createdAt desc) [0...3] {
  title,
  slug,
  overview
}`;
export default async function IndividualServicePage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const [service, relatedServices] = await Promise.all([
    client.fetch<Service>(serviceQuery, { slug: params.slug }),
    client.fetch<RelatedService[]>(relatedServicesQuery, { slug: params.slug })
  ]);
  
  if (!service) {
    notFound();
  }

  return (
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

      <article className="bg-white">
        {/* Hero Section */}
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-heading !text-white mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl leading-relaxed">
              {service.overview}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose lg:prose-xl max-w-none">
              <PortableText value={service.mainContent as Record<string, unknown>[]} />
            </div>
            
            {/* Sub-Services Section for Web & Mobile Software Development */}
            {params.slug === 'web-and-mobile-software-development' && (
              <div className="mt-12 mb-12">
                <Suspense fallback={null}>
                  <FocusHandler serviceSlug={params.slug} />
                </Suspense>
                
                {/* Conditional content - hide detailed sections when customizing */}
                <ConditionalSections>
                  {/* Nigerian Launch Special Banner */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse shadow-lg">
                    <span>🇳🇬</span>
                    <span>NIGERIAN LAUNCH SPECIAL: 50% OFF ALL PACKAGES!</span>
                    <span>🔥</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
                    <h3 className="text-xl font-bold text-green-800 mb-2">💰 Limited Time Offer - Ends January 31, 2026</h3>
                    <p className="text-green-700">
                      Nigerian clients get <strong>50% OFF</strong> all our Web & Mobile Development packages. 
                      Perfect time to launch your digital presence at unbeatable prices!
                    </p>
                  </div>
                </div>
                
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Web Development */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group relative overflow-hidden">
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
                        <Link 
                          href="/services?focus=web-development" 
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                        >
                          Get Web Development Quote
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <p className="text-center text-blue-600 text-sm">
                          <span className="font-medium">Starting from $299</span> • Free consultation included
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile App Development */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group relative overflow-hidden">
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
                        <Link 
                          href="/services?focus=mobile-development" 
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                        >
                          Get Mobile App Quote
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
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
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Cost Savings</h4>
                      <p className="text-gray-600 text-sm">Save up to 30% compared to separate projects</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Faster Delivery</h4>
                      <p className="text-gray-600 text-sm">Parallel development reduces overall timeline</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
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
                    <Link 
                      href="/contact?service=web-mobile-combo&package=complete-solution" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Get Complete Solution Quote
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
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

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Let&apos;s discuss your project and create a tailored solution that meets your specific needs and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get Free Consultation
                </Link>
                <Link 
                  href="/services" 
                  className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

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
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100"
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
