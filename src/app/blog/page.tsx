// src/app/blog/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const metadata: Metadata = {
  title: 'Blog | Hexadigitall',
  description: 'Read our latest articles on tech, business, marketing, and content strategy.',
};

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  categories: string[];
  mainImage?: SanityImageSource;
}

const postsQuery = groq`*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  categories,
  mainImage
}`;

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(postsQuery);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Blog</h1>
          <p className="mt-4 text-lg text-darkText">Insights on tech, business, and marketing.</p>
        </div>
        
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug.current}`}
                className="block bg-lightGray rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {post.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={urlFor(post.mainImage).width(400).height(192).url()}
                      alt={`Cover image for ${post.title}`}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={urlFor(post.mainImage).width(20).blur(50).url()}
                    />
                  </div>
                )}
                <div className="p-8">
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <h2 className="text-2xl font-bold font-heading mb-3">{post.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.categories?.map(category => (
                      <span key={category} className="bg-secondary/20 text-secondary text-xs font-bold px-2 py-1 rounded-full">{category}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-darkText">No blog posts found. Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}