"use client"

import React from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';

interface FaqItem {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string;
}

interface FaqPageContentProps {
  faqs: FaqItem[];
}

export default function FaqPageContent({ faqs }: FaqPageContentProps) {
  // Group FAQs by category in the client component
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
                <h2 className="text-2xl md:text-3xl font-bold font-heading capitalize mb-6 border-b-2 border-primary pb-2 text-gray-800">
                  {category}
                </h2>
                <div className="space-y-4">
                  {items.map((faq) => (
                    <details key={faq._id} className="p-4 border border-gray-200 rounded-lg group open:bg-gray-50 transition-colors">
                      <summary className="font-bold cursor-pointer text-lg text-gray-900 flex justify-between items-center list-none">
                        {faq.question}
                        <span className="transition-transform group-open:rotate-180">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="mt-4 prose prose-blue max-w-none text-gray-600">
                        <PortableText value={faq.answer as Record<string, unknown>[]} />
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