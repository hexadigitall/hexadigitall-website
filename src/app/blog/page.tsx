import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import BlogPageContent from './BlogPageContent';

export const metadata: Metadata = {
  title: 'Blog | Hexadigitall',
  description: 'Read our latest articles on tech, business, marketing, and content strategy.',
  openGraph: {
    title: 'Hexadigitall Insights & Blog',
    description: 'Expert articles on web development, SEO, business strategy, and digital marketing trends.',
    url: 'https://hexadigitall.com/blog',
    images: [{
      url: 'https://cdn.sanity.io/images/puzezel0/production/4b4b4d4d0d3c40bb0165b12f309deb431ab30b61-1600x840.jpg',
      width: 1600,
      height: 840,
      alt: 'Hexadigitall Blog',
      type: 'image/jpeg'
    }],
    type: 'website'
  }
};

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  categories: string[];
  mainImage?: any;
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
  let posts: Post[] = [];
  
  try {
    posts = await client.fetch(postsQuery);
  } catch (error) {
    console.warn('Failed to fetch blog posts:', error);
  }

  return <BlogPageContent posts={posts} />;
}