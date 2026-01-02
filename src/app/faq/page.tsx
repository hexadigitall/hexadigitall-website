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
      url: 'https://hexadigitall.com/digitall_partner.png',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall FAQ'
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