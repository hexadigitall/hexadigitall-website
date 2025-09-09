// src/app/faq/page.tsx
import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Hexadigitall',
  description: 'Find answers to common questions about our services, process, and pricing.',
};

interface FaqItem {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
}

const faqQuery = groq`*[_type == "faq"] | order(category asc)`;

export default async function FaqPage() {
  const faqs: FaqItem[] = await client.fetch(faqQuery);

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Frequently Asked Questions</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {Object.keys(groupedFaqs).length > 0 ? (
            Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold font-heading capitalize mb-6 border-b-2 border-primary pb-2">
                  {category}
                </h2>
                <div className="space-y-4">
                  {items.map((faq) => (
                    <details key={faq._id} className="p-4 border rounded-lg">
                      <summary className="font-bold cursor-pointer text-lg">
                        {faq.question}
                      </summary>
                      <div className="mt-4 prose">
                        <PortableText value={faq.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-darkText">No FAQs available at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}