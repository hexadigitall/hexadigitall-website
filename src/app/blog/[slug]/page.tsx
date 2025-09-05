// src/app/blog/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';

interface Post {
  title: string;
  publishedAt: string;
  body: PortableTextBlock[];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post: { title: string } = await client.fetch(groq`*[_type == "post" && slug.current == $slug][0]{ title }`, { slug: params.slug });
  return { title: `${post.title} | Hexadigitall Blog` };
}

const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  body
}`;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post: Post = await client.fetch(postQuery, { slug: params.slug });

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