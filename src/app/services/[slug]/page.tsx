// src/app/services/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity'; // 👈 Import the official type here

// The Service interface now uses the imported type
interface Service {
  title: string;
  mainContent: PortableTextBlock[];
}

// A clear type alias for the page's props
type Props = {
  params: { slug: string };
};

// This function generates dynamic metadata (great for SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service: Service = await client.fetch(groq`*[_type == "service" && slug.current == $slug][0]{ title }`, { slug: params.slug });
  if (!service) {
    return { title: "Service Not Found" };
  }
  return {
    title: `${service.title} | Hexadigitall`,
  };
}

const serviceQuery = groq`*[_type == "service" && slug.current == $slug][0]{
  title,
  mainContent
}`;

// The main page component
export default async function IndividualServicePage({ params }: Props) {
  const service: Service = await client.fetch(serviceQuery, { slug: params.slug });

  if (!service) {
    notFound();
  }

  return (
    <article className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">{service.title}</h1>
        </header>
        <div className="prose lg:prose-xl max-w-none">
          <PortableText value={service.mainContent} />
        </div>
      </div>
    </article>
  );
}

// This function tells Next.js what possible pages to pre-build
export async function generateStaticParams() {
  const slugs: { slug: { current:string } }[] = await client.fetch(groq`*[_type == "service"]{ slug }`);
  return slugs.map(({ slug }) => ({
    slug: slug.current,
  }));
}