// src/app/contact/page.tsx

import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { generateStructuredData } from '@/lib/structured-data';

export const metadata: Metadata = generateMetadata({
  title: 'Contact Us - Start Your Digital Transformation',
  description: 'Ready to transform your business idea into reality? Contact Hexadigitall today for a free consultation. Expert web development, digital marketing, and business planning services in Nigeria.',
  keywords: [
    'contact Hexadigitall',
    'free consultation Nigeria',
    'web development quote',
    'digital marketing consultation',
    'business planning contact',
    'startup consultation Nigeria',
    'Calabar tech services'
  ],
  path: '/contact',
  type: 'website'
});

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://hexadigitall.com' },
    { name: 'Contact Us', url: 'https://hexadigitall.com/contact' }
  ];

  const organizationContactData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Hexadigitall',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+234-812-580-2140',
        contactType: 'Customer Service',
        email: 'hexadigitztech@gmail.com',
        availableLanguage: 'English',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00'
        }
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Calabar',
        addressRegion: 'Cross River',
        addressCountry: 'NG'
      }
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(generateBreadcrumbSchema(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(organizationContactData),
        }}
      />
      
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li className="text-gray-400">/</li>
              <li className="text-primary font-medium" aria-current="page">Contact Us</li>
            </ol>
          </nav>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              Let&apos;s Start Your Digital Transformation
            </h1>
            <p className="mt-4 text-lg text-darkText max-w-3xl mx-auto leading-relaxed">
              Whether you have a fully-formed project or just the seed of an idea, we&apos;re here to help. Our expert team provides free consultations and responds within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Consultation
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                24-Hour Response
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Obligation
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <ContactForm />
            </div>
            <div className="bg-lightGray p-8 rounded-lg">
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">
                Contact Information
              </h2>
              <div className="space-y-6 text-darkText">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Email Us</h3>
                  <a href="mailto:hexadigitztech@gmail.com" className="flex items-center hover:text-secondary transition-colors">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    hexadigitztech@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Call Us</h3>
                  <a href="tel:+2348125802140" className="flex items-center hover:text-secondary transition-colors">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    +234 812 580 2140
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Visit Us</h3>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Calabar, Cross River, Nigeria</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Business Hours</h3>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-primary mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-sm text-gray-600 mt-1">Weekend: By appointment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
