/**
 * E-Commerce Proposal Page
 * 
 * Public-facing page showing e-commerce packages and pricing tiers
 * Optimized for social sharing with proper OG tags
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import { generateOGMetadata } from '@/lib/og';

// Generate metadata with proper OG tags for social sharing
export async function generateMetadata(): Promise<Metadata> {
  return generateOGMetadata({
    title: 'E-Commerce Website Packages - Hexadigitall',
    description: 'Professional e-commerce solutions for Nigerian businesses. Choose from Basic (₦2.5M), Standard (₦4.2M), or Premium (₦6.5M) packages. Includes payment integration, mobile design, and ongoing support.',
    url: '/proposals/ecommerce',
    type: 'website',
    image: {
      url: '/digitall_partner.png',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall E-Commerce Packages',
    },
  });
}

const packages = [
  {
    name: 'Basic',
    price: '₦2,500,000',
    duration: '6-8 weeks',
    features: [
      'Up to 50 products',
      '5 product categories',
      'Basic Sanity CMS setup',
      'Paystack payment integration',
      'Contact form',
      'Basic SEO setup',
      'Mobile-responsive design',
      '1 month post-launch support',
      'Shareable links with OG images',
    ],
    icon: '🥉',
    recommended: false,
  },
  {
    name: 'Standard',
    price: '₦4,200,000',
    duration: '8-10 weeks',
    features: [
      'Up to 150 products',
      '15 product categories',
      'Stripe + Paystack integration',
      'Customer accounts & order history',
      'Product reviews system',
      'Email marketing integration',
      'Advanced SEO optimization',
      'Blog section',
      'Google Analytics setup',
      '2 months post-launch support',
      'Advanced shareable links with UTM tracking',
      'Coupon/discount code system',
    ],
    icon: '🥈',
    recommended: false,
  },
  {
    name: 'Premium',
    price: '₦6,500,000',
    duration: '10-12 weeks',
    features: [
      'Unlimited products',
      'Unlimited categories',
      'Multiple currency support (₦, $, £, €)',
      'Advanced inventory management',
      'Automated email workflows',
      'SMS notifications',
      'Loyalty/rewards program',
      'Multi-variant products (size, color)',
      'Advanced analytics dashboard',
      'WhatsApp Business integration',
      'Social media auto-posting',
      '3 months post-launch support',
      'Comprehensive training sessions',
      'Priority support for 6 months',
      'Custom referral program',
      'Monthly performance reports',
      '50 custom OG images for top products',
    ],
    icon: '🥇',
    recommended: true,
  },
];

export default function EcommerceProposal() {
  const pageUrl = 'https://hexadigitall.com/proposals/ecommerce';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              E-Commerce Website Packages
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Professional solutions for Nigerian fashion and retail businesses
            </p>
            <p className="text-lg opacity-80 mb-8">
              Turn your social media following into sales with a professional online store
            </p>
            
            {/* Share Section */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm opacity-75">Share this with your network:</p>
              <ShareButtons
                url={pageUrl}
                title="E-Commerce Website Packages by Hexadigitall"
                description="Professional e-commerce solutions starting at ₦2.5M"
                showLabels={true}
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Choose Your Package
              </h2>
              <p className="text-xl text-gray-600">
                All packages include training, support, and social sharing features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
                    pkg.recommended ? 'ring-4 ring-primary' : ''
                  }`}
                >
                  {pkg.recommended && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                      Recommended
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* Package Icon */}
                    <div className="text-5xl mb-4">{pkg.icon}</div>
                    
                    {/* Package Name */}
                    <h3 className="text-2xl font-bold font-heading mb-2">
                      {pkg.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-primary">
                        {pkg.price}
                      </span>
                    </div>
                    
                    {/* Duration */}
                    <p className="text-gray-600 mb-6">
                      Timeline: {pkg.duration}
                    </p>
                    
                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <Link
                      href="/contact"
                      className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                        pkg.recommended
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-8 text-center">
              Why Choose Hexadigitall?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🇳🇬</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Nigerian Market Expertise</h3>
                  <p className="text-gray-600">
                    We understand local payment preferences, customer behavior, and optimize for Nigerian internet speeds.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">👗</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fashion E-Commerce Specialists</h3>
                  <p className="text-gray-600">
                    Experience with fashion brands, understanding of styling and visual presentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Social Sharing Built-In</h3>
                  <p className="text-gray-600">
                    Beautiful product previews on WhatsApp, Facebook, Instagram. Turn customers into brand ambassadors.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Modern Technology</h3>
                  <p className="text-gray-600">
                    Latest web technologies, fast loading, secure, and scalable architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-heading mb-6">
              Flexible Payment Terms
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">40%</div>
                  <p className="text-gray-600">Deposit to begin</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">30%</div>
                  <p className="text-gray-600">At midpoint milestone</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">30%</div>
                  <p className="text-gray-600">At launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule a free consultation to discuss your business needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-block"
              >
                Contact Us
              </Link>
              <Link
                href="/demo/jhema-wears"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-block"
              >
                View Demo
              </Link>
            </div>
            
            {/* Share Again */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm opacity-75 mb-4">Know someone who needs this?</p>
              <ShareButtons
                url={pageUrl}
                title="E-Commerce Website Packages by Hexadigitall"
                description="Professional e-commerce solutions starting at ₦2.5M"
                showLabels={true}
                size="md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
