'use client'

import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
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
    image: "/web-development.jpg",
    cta: {
      text: "Explore Our Services",
      href: "/services"
    }
  },
  {
    title: "Launch Your Dream with Our Expert Guidance",
    subtitle: "Empowering Startups and Businesses",
    description: "Navigate the complexities of the digital landscape with our expert mentoring and consulting services. We provide strategic advice and hands-on support to help you achieve your goals.",
    image: "/digital_marketing2.jpg",
    cta: {
      text: "Get a Free Consultation",
      href: "/contact"
    }
  },
  {
    title: "Unlock Your Potential with Our Online Courses",
    subtitle: "Learn, Grow, and Succeed with HexaDigitall",
    description: "Our comprehensive online courses are designed to equip you with the skills and knowledge needed to excel in the digital age. Learn from industry experts and take your career to the next level.",
    image: "/web-development-bootcamp-from-zero-to-hero.jpg",
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
      className="relative overflow-hidden bg-gray-900 text-white hero-height h-full"
      aria-label="Hero carousel"
      role="region"
      aria-roledescription="carousel"
    >
  <div className="flex h-full w-full">
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
                  bottom: 0,
                  height: '100%'
                }}
                aria-hidden={currentIndex !== index}
                role="group"
                aria-roledescription="slide"
              >
                {/* First Slide: Glassy Polymorphic Effect */}
                {index === 0 ? (
                  <>
                    <div className="absolute inset-0 h-full">
                      <OptimizedImage
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        className="opacity-30"
                        priority={true}
                      />
                      {/* Animated morph shapes */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.3 }}
                          transition={{ duration: 1 }}
                          d="M0,160 C480,320 960,0 1440,160 L1440,600 L0,600 Z"
                          fill="url(#blueGradient)"
                        />
                        <defs>
                          <linearGradient id="blueGradient" x1="0" y1="0" x2="1440" y2="600" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-blue-400/40 to-blue-900/60 backdrop-blur-xl"></div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/4 top-1/4 w-1/2 h-1/2 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute right-1/4 bottom-1/4 w-1/3 h-1/3 bg-cyan-400/30 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 h-full">
                      <OptimizedImage
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        className="opacity-50"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
                    </div>
                  </>
                )}

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
                      {/* Launch Special Banner */}
                      {isClient && index === 0 && discountMessage && (
                        <div className="mb-3 sm:mb-4 lg:mb-6 flex justify-center">
                          <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm border border-blue-400/50 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                            <span>🔥</span>
                            <span className="hidden sm:inline">NIGERIAN LAUNCH SPECIAL - 50% OFF ALL SERVICES!</span>
                            <span className="sm:hidden">50% OFF FOR NIGERIANS!</span>
                          </div>
                        </div>
                      )}

                      <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8">
                        {slide.description}
                      </p>
                      <CTAButton href={slide.cta.href} size="lg">
                        {slide.cta.text}
                      </CTAButton>

                      {/* Clear Entry Points on First Slide */}
                      {index === 0 && (
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                          <a
                            href="/services"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105"
                          >
                            <div className="text-4xl mb-3">🌐</div>
                            <h3 className="text-lg font-bold text-white mb-2">Explore Our Services</h3>
                            <p className="text-sm text-gray-200">Web, mobile, marketing & more</p>
                          </a>
                          <a
                            href="/courses"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105"
                          >
                            <div className="text-4xl mb-3">📚</div>
                            <h3 className="text-lg font-bold text-white mb-2">Explore Our Courses</h3>
                            <p className="text-sm text-gray-200">Learn from industry experts</p>
                          </a>
                          <a
                            href="/contact"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105"
                          >
                            <div className="text-4xl mb-3">🤝</div>
                            <h3 className="text-lg font-bold text-white mb-2">Join Our Community</h3>
                            <p className="text-sm text-gray-200">Network & grow together</p>
                          </a>
                        </div>
                      )}
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