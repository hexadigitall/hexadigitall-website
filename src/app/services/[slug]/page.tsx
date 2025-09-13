// src/app/services/[slug]/page.tsx
import { client } from '@/sanity/client'
import * as NextSanity from 'next-sanity'
import * as PortableTextReact from '@portabletext/react'

const { groq } = NextSanity
const { PortableText } = PortableTextReact
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ServicePricingClient from '@/components/services/ServicePricingClient'

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
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Development Specialties</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    We offer comprehensive development services across web and mobile platforms, 
                    each tailored to deliver exceptional user experiences and robust functionality.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Web Development */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-900">Web Development</h3>
                    </div>
                    <p className="text-blue-800 mb-6">
                      Modern, responsive websites and web applications built with cutting-edge technologies. 
                      From simple landing pages to complex enterprise solutions.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-blue-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Responsive Design & UI/UX</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>E-commerce Platforms</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Custom Web Applications</span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>CMS & Database Integration</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Link 
                        href="/services?focus=web-development" 
                        className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        Request Web Development
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Mobile App Development */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-purple-900">Mobile App Development</h3>
                    </div>
                    <p className="text-purple-800 mb-6">
                      Native and cross-platform mobile applications for iOS and Android. 
                      Transform your ideas into powerful mobile experiences.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-purple-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>iOS & Android Apps</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Cross-Platform Solutions</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>App Store Deployment</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Maintenance & Updates</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <Link 
                        href="/services?focus=mobile-development" 
                        className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        Request Mobile App
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
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
