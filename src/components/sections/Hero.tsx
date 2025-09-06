// src/components/sections/Hero.tsx
"use client";

import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useCallback } from 'react';

// Define the content for each slide. The first slide has no bgImage.
const slides = [
  {
    headline: "From Idea to Impact. Your All-in-One Digital Partner.",
    subheadline: "We transform concepts into market-ready realities with strategic business planning, custom software development, and data-driven marketing.",
    ctaText: "Let's Build Your Vision",
    ctaLink: "/contact"
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')",
    headline: "Build on a Solid Foundation.",
    subheadline: "We craft investor-ready business plans and create powerful brand identities that turn great ideas into viable businesses.",
    ctaText: "Plan Your Strategy",
    ctaLink: "/services/business-plan-logo"
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070')",
    headline: "From Concept to Code.",
    subheadline: "Our expert developers build fast, scalable, and secure web and mobile applications that deliver an exceptional user experience.",
    ctaText: "Build Your Application",
    ctaLink: "/services/web-mobile-development"
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')",
    headline: "Your Partner in Growth.",
    subheadline: "Beyond services, we offer dedicated mentorship and data-driven marketing to ensure your digital presence thrives and achieves its goals.",
    ctaText: "Grow Your Business",
    ctaLink: "/services/mentoring-consulting"
  }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    emblaApi && emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(interval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-primary" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className="relative flex-shrink-0 w-full min-w-0 flex items-center justify-center bg-cover bg-center"
            // Apply background image only for slides that have one
            style={{ backgroundImage: slide.bgImage || 'none' }}
          >
            {/* Dark Overlay for slides with images */}
            {slide.bgImage && <div className="absolute inset-0 bg-black/60 z-0"></div>}
            
            {/* Consistent Content Wrapper */}
            <div className="relative container mx-auto px-6 py-24 md:py-32 text-center text-white z-10">
              <h1 className="text-4xl md:text-6xl font-bold font-heading mb-4 leading-tight !text-white">
                {slide.headline}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                {slide.subheadline}
              </p>
              
              {/* Conditional Button Style */}
              <Link 
                href={slide.ctaLink} 
                className={index === 0 ? 'btn-primary' : 'btn-white'}
              >
                {slide.ctaText === "Let's Build Your Vision" ? "Let's Build Your Vision" : slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-colors ${selectedIndex === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;