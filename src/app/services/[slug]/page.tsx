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
  mainContent: any[]
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
              <PortableText value={service.mainContent} />
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Let's discuss your project and create a tailored solution that meets your specific needs and budget.
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
