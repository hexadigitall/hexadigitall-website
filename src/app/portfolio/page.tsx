import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import PortfolioPageContent from './PortfolioPageContent';

// ✅ Unique Metadata
export const metadata: Metadata = {
  title: 'Our Portfolio | Hexadigitall',
  description: 'Explore case studies that showcase our commitment to delivering tangible results and building lasting client partnerships.',
  openGraph: {
    title: 'Our Portfolio | Hexadigitall',
    description: 'See how we build growth engines, not just websites. Check out our case studies.',
    url: 'https://hexadigitall.com/portfolio',
    images: [{
      url: '/assets/images/services/service-portfolio-website.jpg',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall Portfolio Showcase'
    }],
    type: 'website'
  }
};

// Types
export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any; // strict typing can be complex with Sanity image sources
  industry?: string;
}

const projectsQuery = groq`*[_type == "project"]{
  _id,
  title,
  slug,
  mainImage,
  industry
}`;

export default async function PortfolioPage() {
  let projects: Project[] = [];
  
  try {
    projects = await client.fetch(projectsQuery);
  } catch (error) {
    console.warn('Failed to fetch portfolio projects:', error);
  }

  // Pass data to the Client Component
  return <PortfolioPageContent projects={projects} />;
}