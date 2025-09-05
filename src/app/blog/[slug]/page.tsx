// src/app/blog/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Post {
  title: string;
  publishedAt: string;
  body: PortableTextBlock[];
  mainImage?: SanityImageSource;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: { title?: string } = await client.fetch(groq`*[_type == "post" && slug.current == $slug][0]{ title }`, { slug });
  return { title: `${post?.title || 'Blog Post'} | Hexadigitall Blog` };
}

const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  body,
  mainImage
}`;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: Post = await client.fetch(postQuery, { slug });

  if (!post) notFound();

  return (
    <article className="py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">{post.title}</h1>
          <p className="mt-4 text-gray-600">
            Published on {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </header>
        {post.mainImage && (
          <div className="relative h-64 md:h-96 w-full rounded-lg shadow-lg overflow-hidden mb-12">
            <Image 
              src={urlFor(post.mainImage).width(800).height(384).url()} 
              alt={`Featured image for ${post.title}`} 
              fill 
              className="object-cover" 
              placeholder="blur"
              blurDataURL={urlFor(post.mainImage).width(20).blur(50).url()}
            />
          </div>
        )}
        <div className="prose lg:prose-xl max-w-none">
          <PortableText value={post.body} />
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "post"]{ slug }`);
  return slugs.map(({ slug }) => ({ slug: slug.current }));
}