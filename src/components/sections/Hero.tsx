'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CTAButton } from '@/components/ui/CTAButton'
import OptimizedImage from '@/components/ui/OptimizedImage'

// Hero slides data
const slides = [
  {
    title: "Transforming Ideas into Digital Realities",
    subtitle: "Web & Mobile Development • IT Consulting • Digital Marketing",
    description: "We are a full-service digital agency dedicated to helping businesses grow and succeed in the digital world. From concept to launch, we provide the expertise and support you need to thrive.",
    image: "/images/hero/hero-1.jpg",
    cta: {
      text: "Explore Our Services",
      href: "/services"
    }
  },
  {
    title: "Launch Your Dream with Our Expert Guidance",
    subtitle: "Empowering Startups and Businesses",
    description: "Navigate the complexities of the digital landscape with our expert mentoring and consulting services. We provide strategic advice and hands-on support to help you achieve your goals.",
    image: "/images/hero/hero-2.jpg",
    cta: {
      text: "Get a Free Consultation",
      href: "/contact"
    }
  },
  {
    title: "Unlock Your Potential with Our Online Courses",
    subtitle: "Learn, Grow, and Succeed with HexaDigitall",
    description: "Our comprehensive online courses are designed to equip you with the skills and knowledge needed to excel in the digital age. Learn from industry experts and take your career to the next level.",
    image: "/images/hero/hero-3.jpg",
    cta: {
      text: "Browse Our Courses",
      href: "/courses"
    }
  }
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const { getLocalDiscountMessage } = useCurrency()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const discountMessage = getLocalDiscountMessage()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        ),
      5000 // Change slide every 5 seconds
    )

    return () => {
      resetTimeout()
    }
  }, [currentIndex])

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <section 
      className="relative overflow-hidden bg-gray-900 text-white hero-height"
      aria-label="Hero carousel"
      role="region"
      aria-roledescription="carousel"
    >
      <div className="flex h-full">
        <AnimatePresence initial={false}>
          {slides.map((slide, index) => (
            currentIndex === index && (
              <motion.article
                key={index}
                className="relative flex-shrink-0 w-full h-full"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
                aria-hidden={currentIndex !== index}
                role="group"
                aria-roledescription="slide"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <OptimizedImage
                    src={slide.image}
                    alt={slide.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-40"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center">
                  <div className="max-w-6xl text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h1 className="text-sm sm:text-base font-semibold uppercase tracking-widest text-secondary mb-2 sm:mb-4">
                        {slide.subtitle}
                      </h1>
                      <p className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white mb-4 sm:mb-6 leading-tight">
                        {slide.title}
                      </p>
                      
                      {/* Consolidated Launch Special Banner */}
                      {isClient && index === 0 && discountMessage && (
                        <div className="mb-3 sm:mb-4 lg:mb-6 flex justify-center">
                          <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500/80 to-green-500/80 backdrop-blur-sm border border-red-400/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            <span>🔥</span>
                            <span className="hidden sm:inline">NIGERIAN LAUNCH SPECIAL - 50% OFF ALL SERVICES!</span>
                            <span className="sm:hidden">50% OFF FOR NIGERIANS!</span>
                          </div>
                        </div>
                      )}

                      <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
                        {slide.description}
                      </p>
                      <CTAButton href={slide.cta.href} size="lg">
                        {slide.cta.text}
                      </CTAButton>
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index ? 'bg-secondary' : 'bg-gray-400 hover:bg-gray-200'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentIndex === index}
          />
        ))}
      </div>
    </section>
  )
}