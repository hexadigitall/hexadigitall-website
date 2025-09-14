// src/components/sections/Hero.tsx
"use client";

import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useCallback } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
// Price display components available for future use
// import { HeroPriceDisplay, CompactPriceDisplay } from '@/components/ui/PriceDisplay';

// Define the content for each slide with pricing information - Simplified to 2 slides
const slides = [
  {
    headline: "From Idea to Impact. Your All-in-One Digital Partner.",
    subheadline: "We transform concepts into market-ready realities with strategic business planning, custom software development, and data-driven marketing.",
    ctaText: "Start Your Journey",
    ctaLink: "/contact",
    showPricing: true,
    features: [
      "Expert Business Planning",
      "Custom Software Development", 
      "Digital Marketing Solutions",
      "Dedicated Support & Mentorship"
    ]
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070')",
    headline: "Complete Business Solutions Under One Roof.",
    subheadline: "From business plans to web development, from marketing to mentorship - everything you need to launch and grow your digital business successfully.",
    ctaText: "Explore Services",
    ctaLink: "/services",
    serviceType: "business-plan",
    quickFeatures: ["Business Planning", "Web & Mobile Development", "Digital Marketing", "Mentorship & Consulting"]
  }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { formatPrice, getLocalDiscountMessage } = useCurrency();
  
  const discountMessage = getLocalDiscountMessage();
  
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setIsPlaying(false); // Pause autoplay when user manually navigates
      setTimeout(() => setIsPlaying(true), 10000); // Resume after 10 seconds
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setIsPlaying(false); // Pause autoplay when user manually navigates
      setTimeout(() => setIsPlaying(true), 10000); // Resume after 10 seconds
    }
  }, [emblaApi]);

  const handleMouseEnter = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    
    emblaApi.on('select', onSelect);
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Autoplay with pause functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000); // Slightly longer interval for better readability
    
    return () => clearInterval(interval);
  }, [emblaApi, isPlaying]);

  return (
    <section 
      className="relative overflow-hidden bg-primary hero-height" 
      ref={emblaRef} 
      aria-label="Hero carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex hero-height">
        {slides.map((slide, index) => (
          <article 
            key={index}
            className="relative flex-shrink-0 w-full min-w-0 flex items-center justify-center bg-cover bg-center hero-height"
            // Apply background image only for slides that have one
            style={{ backgroundImage: slide.bgImage || 'none' }}
            aria-hidden={selectedIndex !== index}
          >
            {/* Dark Overlay for slides with images */}
            {slide.bgImage && <div className="absolute inset-0 bg-black/60 z-0" aria-hidden="true"></div>}
            
            {/* Consistent Content Wrapper */}
            <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20 z-10 flex items-center justify-center hero-height">
              <div className="max-w-6xl mx-auto w-full flex flex-col justify-center">
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-heading mb-2 sm:mb-3 lg:mb-4 leading-tight !text-white">
                    {slide.headline}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-3xl mx-auto mb-3 sm:mb-4 lg:mb-6 leading-relaxed">
                    {slide.subheadline}
                  </p>
                  
                  {/* Consolidated Launch Special Banner */}
                  {index === 0 && discountMessage && (
                    <div className="mb-3 sm:mb-4 lg:mb-6 flex justify-center">
                      <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500/80 to-green-500/80 backdrop-blur-sm border border-red-400/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                        <span>🔥</span>
                        <span className="hidden sm:inline">NIGERIAN LAUNCH SPECIAL - 50% OFF ALL SERVICES!</span>
                        <span className="sm:hidden">50% OFF LAUNCH SPECIAL!</span>
                        <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Simplified Content Display */}
                {slide.showPricing ? (
                  // First slide: Streamlined overview
                  <div className="max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Core Services */}
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Our Core Services</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {slide.features?.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-gray-200 text-xs sm:text-sm">
                                <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                                <span className="leading-tight">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Pricing Summary */}
                        <div className="text-center mt-4 md:mt-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Starting From</h3>
                          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-2">
                            {formatPrice(79, { applyNigerianDiscount: true })}
                          </div>
                          <p className="text-gray-300 text-xs sm:text-sm">
                            Professional business solutions with transparent pricing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Second slide: Service highlights
                  slide.quickFeatures && (
                    <div className="max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {slide.quickFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-gray-200 text-xs sm:text-sm">
                              <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                              <span className="leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                )}
                
                {/* CTA Buttons - Simplified */}
                <div className="text-center">
                  <Link 
                    href={slide.ctaLink} 
                    className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-white text-primary hover:bg-gray-100 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 hover:scale-105 shadow-xl"
                    aria-describedby={`slide-${index}-description`}
                  >
                    {slide.ctaText}
                    <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Hidden description for screen readers */}
              <p id={`slide-${index}-description`} className="sr-only">
                {slide.subheadline}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation Dots - Minimal and Unobtrusive */}
      <nav className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20" aria-label="Carousel navigation">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full transition-all duration-200 focus:ring-1 focus:ring-white/50 focus:ring-offset-1 ${selectedIndex === index ? 'bg-white/90 w-3 sm:w-4' : 'bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}: ${slide.headline}`}
            aria-current={selectedIndex === index ? 'true' : 'false'}
          />
        ))}
      </nav>
      
      {/* Play/Pause Indicator (visible on hover) */}
      <div className="absolute top-4 right-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className={`w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ${isPlaying ? 'text-green-400' : 'text-yellow-400'}`}>
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;