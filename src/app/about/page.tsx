import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateMetadata, generateBreadcrumbSchema } from '@/lib/seo';
import { generateStructuredData } from '@/lib/structured-data';

const baseMetadata = generateMetadata({
  title: 'About Us - The People Behind the Process',
  description: 'Discover the story, mission, and vision of Hexadigitall - your trusted digital partner in Nigeria. Learn how we transform business ideas into reality with expert web development, digital marketing, and consulting services.',
  keywords: [
    'about Hexadigitall',
    'digital agency Nigeria',
    'web development company',
    'business consulting Nigeria',
    'digital transformation',
    'startup support Nigeria',
    'tech company Calabar'
  ],
  path: '/about',
  type: 'website'
});

// ✅ FIX: Manually extend openGraph to bypass strict type checking and add the image
export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...(baseMetadata.openGraph || {}),
    title: 'About Us - The People Behind the Process',
    description: 'Discover the story, mission, and vision of Hexadigitall.',
    images: [{
      url: 'https://cdn.sanity.io/images/puzezel0/production/2e2e2b2b0d3c40bb0165b12f309deb431ab30b61-1600x840.jpg',
      width: 1600,
      height: 840,
      alt: 'Hexadigitall Team',
      type: 'image/jpeg'
    }]
  }
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://hexadigitall.com' },
    { name: 'About Us', url: 'https://hexadigitall.com/about' }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(generateBreadcrumbSchema(breadcrumbItems)),
        }}
      />
      
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex justify-center items-center space-x-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-white" aria-current="page">About Us</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold font-heading !text-white">The People Behind the Process.</h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto">
            Meet the team transforming business ideas into digital realities across Nigeria.
          </p>
        </div>
      </section>
      
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Our Story</h2>
              <p className="text-darkText leading-relaxed">
                Hexadigitall was founded on a simple observation: many brilliant entrepreneurs and businesses struggle to connect their vision with the right digital tools and strategies. We exist to bridge that gap. Our journey began with a passion for technology and a commitment to helping others succeed, evolving into a multi-disciplinary agency dedicated to providing holistic support.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg shadow-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070"
                alt="Hexadigitall team working on a project"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-lightGray py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 text-center">
            <div>
              <h3 className="text-2xl font-bold font-heading mb-3">Our Mission</h3>
              <p className="text-darkText">
                To empower entrepreneurs and businesses with the strategic, technical, and creative solutions they need to thrive in a digital-first world.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-heading mb-3">Our Vision</h3>
              <p className="text-darkText">
                To be the leading digital enablement partner for startups and SMEs in Nigeria and beyond, known for our integrated approach and unwavering commitment to client success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}