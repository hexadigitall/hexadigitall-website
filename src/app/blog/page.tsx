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
      url: '/assets/images/services/service-social-media-marketing.jpg',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall Blog'
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