// src/app/portfolio/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Portfolio | Hexadigitall',
  description: 'View a selection of our successful projects and case studies.',
};

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: { asset: { url: string; metadata: { lqip: string } } };
  industry: string;
}

const projectsQuery = groq`*[_type == "project"]{
  _id,
  title,
  slug,
  "mainImage": mainImage{ asset->{url, metadata{lqip}} },
  industry
}`;

export default async function PortfolioPage() {
  const projects: Project[] = await client.fetch(projectsQuery);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Work</h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            We are proud of the partnerships we build and the results we deliver.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link 
              key={project._id} 
              href={`/portfolio/${project.slug.current}`}
              className="group block bg-lightGray rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-56 w-full">
                <Image 
                  src={project.mainImage.asset.url}
                  alt={`Cover image for ${project.title}`}
                  layout="fill"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL={project.mainImage.asset.metadata.lqip}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-secondary font-bold uppercase">{project.industry}</p>
                <h2 className="text-xl font-bold font-heading mt-2">{project.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}