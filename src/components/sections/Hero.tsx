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
    ctaLink: "/services/business-plan-and-logo-design"
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070')",
    headline: "From Concept to Code.",
    subheadline: "Our expert developers build fast, scalable, and secure web and mobile applications that deliver an exceptional user experience.",
    ctaText: "Build Your Application",
    ctaLink: "/services/web-and-mobile-software-development"
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')",
    headline: "Your Partner in Growth.",
    subheadline: "Beyond services, we offer dedicated mentorship and data-driven marketing to ensure your digital presence thrives and achieves its goals.",
    ctaText: "Grow Your Business",
    ctaLink: "/services/mentoring-and-consulting"
  }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Preload background images for better performance
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.bgImage && slide.bgImage.includes('http')) {
        const img = new Image();
        const url = slide.bgImage.match(/url\('(.+?)'\)/)?.[1];
        if (url) img.src = url;
      }
    });
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
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
    <section className="relative overflow-hidden bg-primary" ref={emblaRef} aria-label="Hero carousel">
      <div className="flex">
        {slides.map((slide, index) => (
          <article 
            key={index}
            className="relative flex-shrink-0 w-full min-w-0 flex items-center justify-center bg-cover bg-center"
            // Apply background image only for slides that have one
            style={{ backgroundImage: slide.bgImage || 'none' }}
            aria-hidden={selectedIndex !== index}
          >
            {/* Dark Overlay for slides with images */}
            {slide.bgImage && <div className="absolute inset-0 bg-black/60 z-0" aria-hidden="true"></div>}
            
            {/* Consistent Content Wrapper */}
            <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center text-white z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight !text-white">
                {slide.headline}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                {slide.subheadline}
              </p>
              
              {/* Enhanced CTA Button */}
              <Link 
                href={slide.ctaLink} 
                className={`inline-flex items-center justify-center transition-transform hover:scale-105 focus:scale-105 ${index === 0 ? 'btn-primary' : 'btn-white'}`}
                aria-describedby={`slide-${index}-description`}
              >
                {slide.ctaText === "Let's Build Your Vision" ? "Let's Build Your Vision" : slide.ctaText}
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
              
              {/* Hidden description for screen readers */}
              <p id={`slide-${index}-description`} className="sr-only">
                {slide.subheadline}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Dots */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20" aria-label="Carousel navigation">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 ${selectedIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
            aria-current={selectedIndex === index ? 'true' : 'false'}
          />
        ))}
      </nav>
    </section>
  );
};

export default Hero;