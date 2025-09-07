// src/app/about/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | Hexadigitall',
  description: 'Learn about the story, mission, and vision of Hexadigitall.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section for About Page */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading !text-white">The People Behind the Process.</h1>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Our Story</h2>
              <p className="text-darkText leading-relaxed">
                Hexadigitall was founded on a simple observation: many brilliant entrepreneurs and businesses struggle to connect their vision with the right digital tools and strategies. We exist to bridge that gap. Our journey began with a passion for technology and a commitment to helping others succeed, evolving into a multi-disciplinary agency dedicated to providing holistic support.
              </p>
            </div>
            <div className="relative h-80 w-full rounded-lg shadow-lg overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070"
                alt="Hexadigitall team working on a project"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-lightGray py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 text-center">
            <div>
              <h3 className="text-2xl font-bold font-heading mb-3">Our Mission</h3>
              <p className="text-darkText">
                To empower entrepreneurs and businesses with the strategic, technical, and creative solutions they need to thrive in a digital-first world.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-heading mb-3">Our Vision</h3>
              <p className="text-darkText">
                To be the leading digital enablement partner for startups and SMEs in Nigeria and beyond, known for our integrated approach and unwavering commitment to client success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}