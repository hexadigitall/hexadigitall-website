// src/components/sections/Hero.tsx
"use client";

import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState, useCallback } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { SERVICE_PRICING } from '@/lib/currency';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
// Price display components available for future use
// import { HeroPriceDisplay, CompactPriceDisplay } from '@/components/ui/PriceDisplay';

// Define the content for each slide with pricing information
const slides = [
  {
    headline: "From Idea to Impact. Your All-in-One Digital Partner.",
    subheadline: "We transform concepts into market-ready realities with strategic business planning, custom software development, and data-driven marketing.",
    ctaText: "Let's Build Your Vision",
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
    headline: "Build on a Solid Foundation.",
    subheadline: "We craft investor-ready business plans and create powerful brand identities that turn great ideas into viable businesses.",
    ctaText: "Plan Your Strategy",
    ctaLink: "/services/business-plan-and-logo-design",
    serviceType: "business-plan",
    quickFeatures: ["Investor-Ready Plans", "Brand Identity", "Market Analysis"]
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070')",
    headline: "From Concept to Code.",
    subheadline: "Our expert developers build fast, scalable, and secure web and mobile applications that deliver an exceptional user experience.",
    ctaText: "Build Your Application",
    ctaLink: "/services/web-and-mobile-software-development",
    serviceType: "web-development",
    quickFeatures: ["Responsive Design", "Mobile Apps", "E-commerce Solutions"]
  },
  {
    bgImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')",
    headline: "Your Partner in Growth.",
    subheadline: "Beyond services, we offer dedicated mentorship and data-driven marketing to ensure your digital presence thrives and achieves its goals.",
    ctaText: "Grow Your Business",
    ctaLink: "/services/mentoring-and-consulting",
    serviceType: "digital-marketing",
    quickFeatures: ["Social Media Marketing", "SEO Optimization", "Growth Strategy"]
  }
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
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
            <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 z-10">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight !text-white">
                    {slide.headline}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                    {slide.subheadline}
                  </p>
                  
                  {/* Launch Special Banner */}
                  {index === 0 && (
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="inline-flex items-center space-x-2 bg-red-500/30 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg">
                        <span>🔥 MEGA LAUNCH SPECIAL - 50% OFF!</span>
                      </div>
                      {discountMessage && (
                        <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                          <SparklesIcon className="h-4 w-4" />
                          <span>{discountMessage.replace('30%', '50%')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing and Features Display */}
                {slide.showPricing ? (
                  // First slide: Show overview with general features
                  <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                    {/* Features */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">What We Offer</h3>
                      <ul className="space-y-3">
                        {slide.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-3 text-gray-200">
                            <CheckIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Popular Services Pricing */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Starting Prices</h3>
                      <div className="space-y-4">
                        {Object.entries(SERVICE_PRICING).slice(0, 3).map(([serviceKey, tiers]) => {
                          const popularTier = tiers.find(tier => tier.popular) || tiers[0];
                          return (
                            <div key={serviceKey} className="flex justify-between items-center">
                              <span className="text-gray-200 text-sm">
                                {serviceKey === 'business-plan' ? 'Business Plans' : 
                                 serviceKey === 'web-development' ? 'Web Development' : 
                                 'Digital Marketing'}
                              </span>
                              <span className="text-white font-semibold">
                                {formatPrice(popularTier.basePrice, { applyNigerianDiscount: true })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Other slides: Show specific service pricing
                  slide.serviceType && (
                    <div className="max-w-md mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">Starting From</h3>
                        <div className="text-3xl font-bold text-white mb-2">
                          {(() => {
                            const serviceTiers = SERVICE_PRICING[slide.serviceType as keyof typeof SERVICE_PRICING] || [];
                            const startingPrice = Math.min(...serviceTiers.map(t => t.basePrice));
                            return formatPrice(startingPrice, { applyNigerianDiscount: true });
                          })()}
                        </div>
                      </div>
                      
                      {/* Quick Features */}
                      <div className="space-y-2">
                        {slide.quickFeatures?.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-gray-200 text-sm">
                            <CheckIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                
                {/* CTA Buttons */}
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href={slide.ctaLink} 
                      className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 focus:scale-105 shadow-lg ${index === 0 ? 'btn-primary' : 'btn-white'}`}
                      aria-describedby={`slide-${index}-description`}
                    >
                      {slide.ctaText}
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </Link>
                    
                    {/* Secondary CTA for service slides */}
                    {slide.serviceType && (
                      <Link 
                        href="/services" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-primary rounded-xl font-medium transition-all duration-200"
                      >
                        View All Services
                      </Link>
                    )}
                  </div>
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