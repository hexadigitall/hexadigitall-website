// src/app/services/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Services | Hexadigitall',
  description: 'Explore the range of digital services offered by Hexadigitall, from business planning to web development and marketing.',
};

interface Service {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  overview: string;
}

const servicesQuery = groq`*[_type == "service"]{
  _id,
  title,
  slug,
  overview
}`;

export default async function ServicesPage() {
  const services: Service[] = await client.fetch(servicesQuery);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Services</h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            We offer a complete suite of services to transform your ideas into successful digital realities.
          </p>
        </div>
        
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
    </section>
  );
}