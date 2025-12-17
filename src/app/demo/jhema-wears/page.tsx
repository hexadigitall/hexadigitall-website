/**
 * Jhema Wears Demo Page
 * 
 * Demo page showcasing OG meta tags and shareable links for a fashion e-commerce store.
 * This demonstrates how proper Open Graph tags work with social sharing.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import { generateOGMetadata } from '@/lib/og';

// Generate metadata with proper OG tags for social sharing
export async function generateMetadata(): Promise<Metadata> {
  return generateOGMetadata({
    title: 'Jhema Wears - Premium Fashion Collection',
    description: 'Discover our exclusive collection of premium fashion items. Quality craftsmanship meets modern style. Shop now for trendy outfits and accessories.',
    url: '/demo/jhema-wears',
    type: 'website',
    image: {
      url: '/digitall_partner.png',
      width: 1200,
      height: 630,
      alt: 'Jhema Wears Fashion Collection',
    },
  });
}

export default function JhemaWearsDemo() {
  const product = {
    name: 'Premium Summer Dress Collection',
    price: '₦45,000',
    description: 'Elegant summer dress perfect for any occasion. Made with high-quality breathable fabric, this dress combines comfort with style. Available in multiple colors and sizes.',
    features: [
      'Premium breathable fabric',
      'Multiple color options',
      'Sizes: S, M, L, XL',
      'Easy care and maintenance',
      'Perfect for any occasion',
    ],
    availability: 'In Stock',
  };

  const pageUrl = 'https://hexadigitall.com/demo/jhema-wears';

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Jhema Wears
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Premium Fashion Collection
            </p>
            <p className="text-lg opacity-80">
              This is a demo page showcasing how Open Graph (OG) images and shareable links work for e-commerce
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg">Product Image Placeholder</p>
                      <p className="text-sm mt-2">Fashion Product Display</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                    {product.availability}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
                    {product.name}
                  </h2>
                  <p className="text-4xl font-bold text-primary mb-6">
                    {product.price}
                  </p>
                  <p className="text-lg text-gray-600 mb-6">
                    {product.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-8">
                  <h3 className="text-xl font-semibold mb-4">Share this product:</h3>
                  <ShareButtons
                    url={pageUrl}
                    title={product.name}
                    description={product.description}
                    showLabels={true}
                    size="lg"
                  />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
                    Add to Cart
                  </button>
                  <button className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200">
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-heading mb-8 text-center">
              How This Demo Works
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-blue-900">
                  🎯 Open Graph Tags
                </h3>
                <p className="text-gray-700 mb-4">
                  This page includes complete Open Graph meta tags that social platforms read when you share the link.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ og:title</li>
                  <li>✅ og:description</li>
                  <li>✅ og:image (1200x630px)</li>
                  <li>✅ og:url</li>
                  <li>✅ og:type</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-green-900">
                  📱 Social Sharing
                </h3>
                <p className="text-gray-700 mb-4">
                  The share buttons above allow easy sharing to multiple platforms with proper metadata.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Facebook</li>
                  <li>✅ Twitter/X</li>
                  <li>✅ LinkedIn</li>
                  <li>✅ WhatsApp</li>
                  <li>✅ Email</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-purple-900">
                  🚀 Server-Side Rendering
                </h3>
                <p className="text-gray-700 text-sm">
                  Meta tags are generated server-side using Next.js generateMetadata, ensuring social crawlers can read them immediately without JavaScript execution.
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-orange-900">
                  🎨 Optimized for E-commerce
                </h3>
                <p className="text-gray-700 text-sm">
                  Perfect for fashion stores like Jhema Wears, with product images, prices, and compelling descriptions optimized for social conversion.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gray-100 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Testing Your Social Links</h3>
              <p className="text-gray-700 mb-4">
                Use these tools to test how this page appears when shared:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://developers.facebook.com/tools/debug/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Facebook Sharing Debugger
                  </a>
                </li>
                <li>
                  <a 
                    href="https://cards-dev.twitter.com/validator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Twitter Card Validator
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/post-inspector/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    LinkedIn Post Inspector
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
