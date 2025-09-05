// src/app/portfolio/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Project {
  title: string;
  mainImage?: SanityImageSource;
  projectGoal?: string;
  solution?: PortableTextBlock[];
  results?: PortableTextBlock[];
  testimonial?: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project: { title?: string } = await client.fetch(groq`*[_type == "project" && slug.current == $slug][0]{ title }`, { slug });
  return { title: `${project?.title || 'Portfolio Project'} | Hexadigitall Portfolio` };
}

const projectQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  title,
  mainImage,
  projectGoal,
  solution,
  results,
  testimonial
}`;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project: Project = await client.fetch(projectQuery, { slug });

  if (!project) notFound();

  return (
    <article className="py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">{project.title}</h1>
        </header>
        {project.mainImage && (
          <div className="relative h-96 w-full rounded-lg shadow-lg overflow-hidden mb-12">
            <Image 
              src={urlFor(project.mainImage).width(800).height(384).url()} 
              alt={`Main image for ${project.title}`} 
              fill 
              className="object-cover" 
              placeholder="blur"
              blurDataURL={urlFor(project.mainImage).width(20).blur(50).url()}
            />
          </div>
        )}
        <div className="prose lg:prose-xl max-w-none">
          {project.projectGoal && (
            <>
              <h2>The Challenge</h2>
              <p>{project.projectGoal}</p>
            </>
          )}
          
          {project.solution && (
            <>
              <h2>Our Solution</h2>
              <PortableText value={project.solution} />
            </>
          )}
          
          {project.results && (
            <>
              <h2>Results & Impact</h2>
              <PortableText value={project.results} />
            </>
          )}
          
          {project.testimonial && (
            <blockquote className="border-l-4 border-secondary pl-4 italic">
              <p>{project.testimonial}</p>
            </blockquote>
          )}
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "project"]{ slug }`);
  return slugs.map(({ slug }) => ({ slug: slug.current }));
}