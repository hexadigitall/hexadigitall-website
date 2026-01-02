import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import type { PortableTextBlock } from 'sanity';
import FaqPageContent from './FaqPageContent';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Hexadigitall',
  description: 'Find answers to common questions about our services, process, and pricing.',
  openGraph: {
    title: 'Hexadigitall FAQs',
    description: 'Common questions about our digital services.',
    url: 'https://hexadigitall.com/faq',
    images: [{
      url: 'https://cdn.sanity.io/images/puzezel0/production/1f1f1b1b0d3c40bb0165b12f309deb431ab30b61-1600x840.jpg',
      width: 1600,
      height: 840,
      alt: 'Hexadigitall FAQ',
      type: 'image/jpeg'
    }],
    type: 'website'
  }
};

export interface FaqItem {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
}

const faqQuery = groq`*[_type == "faq"] | order(category asc)`;

export default async function FaqPage() {
  let faqs: FaqItem[] = [];
  
  try {
    faqs = await client.fetch(faqQuery);
  } catch (error) {
    console.warn('Failed to fetch FAQs:', error);
  }

  return <FaqPageContent faqs={faqs} />;
}