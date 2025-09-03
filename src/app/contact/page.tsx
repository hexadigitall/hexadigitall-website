// src/app/contact/page.tsx

import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Hexadigitall',
  description: 'Get in touch with Hexadigitall to start your project today.',
};

export default function ContactPage() { // <-- This export is the key
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            Let&apos;s Start a Conversation.
          </h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            Whether you have a fully-formed project or just the seed of an idea, we&apos;re here to help. Fill out the form below, and our team will get back to you within 24 hours.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <ContactForm />
          </div>
          <div className="bg-lightGray p-8 rounded-lg">
            <h3 className="text-2xl font-bold font-heading text-primary mb-4">
              Contact Information
            </h3>
            <div className="space-y-4 text-darkText">
              <p>
                <strong className="block text-primary">Email:</strong>
                <a href="mailto:hexadigitztech@gmail.com" className="hover:text-secondary">
                  hexadigitztech@gmail.com
                </a>
              </p>
              <p>
                <strong className="block text-primary">Phone:</strong>
                <span>+234 8125802140</span>
              </p>
              <p>
                <strong className="block text-primary">Location:</strong>
                <span>Plot 30/31 Effangha Mkpa Residential Layout, Off Parliamentary Extension, Calabar, Cross River, Nigeria.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}