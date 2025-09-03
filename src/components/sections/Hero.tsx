// src/components/sections/Hero.tsx

import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-primary text-white">
      {/* Overlay for text readability over a potential background image */}
      <div className="bg-primary/80 py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 leading-tight">
            From Idea to Impact. Your All-in-One Digital Partner.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            We transform concepts into market-ready realities with strategic business planning, custom software development, and data-driven marketing.
          </p>
          <Link href="/contact" className="btn-primary">
            Let's Build Your Vision
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;