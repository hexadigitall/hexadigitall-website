"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  categories: string[];
  mainImage?: any;
}

interface BlogPageContentProps {
  posts: Post[];
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
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
                className="block bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
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
                  <h2 className="text-2xl font-bold font-heading mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.categories?.map(category => (
                      <span key={category} className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{category}</span>
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