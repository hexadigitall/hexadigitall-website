// src/app/services/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';

interface Service {
  title: string;
  mainContent: PortableTextBlock[];
}

export async function generateMetadata(
  props: { params: { slug: string } }
): Promise<Metadata> {
  const { params } = props;
  const service: Service = await client.fetch(
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
  mainContent
}`;
export default async function IndividualServicePage(
  props: { params: { slug: string } }
) {
  const { params } = props;
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


// This function remains the same
export async function generateStaticParams() {
  const slugs: { slug: { current:string } }[] = await client.fetch(groq`*[_type == "service"]{ slug }`);
  return slugs.map(({ slug }) => ({
    slug: slug.current,
  }));
}