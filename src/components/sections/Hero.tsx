'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import { GradientCTA, GlassCTA } from '@/components/ui/CTAButton'
import OptimizedImage from '@/components/ui/OptimizedImage'

// Hero slides data
const slides = [
  {
    title: "Digital Solutions That Drive Results",
    subtitle: "Web • Mobile • Marketing • Consulting",
    description: "Transform your business with our expert digital services. From concept to launch, we deliver solutions that grow your success.",
    image: "/web-development.jpg",
    cta: {
      text: "Get Started",
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
                {/* First Slide: Enhanced Modern Gradient Effect */}
                {index === 0 ? (
                  <>
                    <div className="absolute inset-0 h-full">
                      <OptimizedImage
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        className="opacity-20"
                        priority={true}
                      />
                      {/* Modern animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gradient-start via-primary to-secondary opacity-90 animate-gradient-xy"></div>
                      
                      {/* Animated morph shapes with better gradients */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.4 }}
                          transition={{ duration: 1.5 }}
                          d="M0,160 C480,320 960,0 1440,160 L1440,600 L0,600 Z"
                          fill="url(#modernGradient)"
                        />
                        <motion.path
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.3, scale: 1 }}
                          transition={{ duration: 2, delay: 0.5 }}
                          d="M0,300 C360,150 720,450 1080,300 C1260,225 1350,375 1440,300 L1440,600 L0,600 Z"
                          fill="url(#accentGradient)"
                        />
                        <defs>
                          <linearGradient id="modernGradient" x1="0" y1="0" x2="1440" y2="600" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#667eea" stopOpacity="0.8"/>
                            <stop offset="0.5" stopColor="#764ba2" stopOpacity="0.6"/>
                            <stop offset="1" stopColor="#f093fb" stopOpacity="0.4"/>
                          </linearGradient>
                          <linearGradient id="accentGradient" x1="0" y1="0" x2="1440" y2="600" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#f5576c" stopOpacity="0.6"/>
                            <stop offset="1" stopColor="#4facfe" stopOpacity="0.4"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    
                    {/* Enhanced floating particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
                      <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
                      <div className="absolute left-1/2 top-1/2 w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl animate-pulse"></div>
                      
                      {/* Sparkle effects */}
                      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-secondary rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
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
                        className="opacity-40"
                        priority={false}
                      />
                      {/* Modern gradient overlay for other slides */}
                      <div className={`absolute inset-0 ${index === 1 ? 'bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-teal-900/70' : 'bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-pink-900/70'} animate-gradient-y`}></div>
                      
                      {/* Subtle floating particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute left-1/3 top-1/3 w-64 h-64 ${index === 1 ? 'bg-purple-400/20' : 'bg-blue-400/20'} rounded-full blur-3xl animate-float`}></div>
                        <div className={`absolute right-1/3 bottom-1/3 w-48 h-48 ${index === 1 ? 'bg-teal-400/15' : 'bg-pink-400/15'} rounded-full blur-2xl animate-float`} style={{animationDelay: '1.5s'}}></div>
                      </div>
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center">
                  <div className="max-w-7xl w-full text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h1 className="text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-widest text-secondary mb-2 sm:mb-4">
                        {slide.subtitle}
                      </h1>
                      <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold font-heading text-white mb-3 sm:mb-4 leading-tight px-2 sm:px-4">
                        {slide.title}
                      </p>
                      
                      <p className="max-w-xl sm:max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-gray-200 mb-4 sm:mb-6 leading-relaxed px-4 sm:px-6">
                        {slide.description}
                      </p>
                      
                      {/* Launch Special Banner - Only for Nigerian currency */}
                      {isClient && index === 0 && discountMessage && (
                        <div className="mb-3 sm:mb-4 flex justify-center">
                          <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm border border-green-400/50 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-bold shadow-lg">
                            <span>🇳🇬</span>
                            <span className="hidden sm:inline">50% OFF ALL SERVICES!</span>
                            <span className="sm:hidden">50% OFF!</span>
                            <span>🔥</span>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <GradientCTA href={slide.cta.href} size={index === 0 ? "md" : "lg"}>
                          {slide.cta.text}
                        </GradientCTA>
                        {index === 0 && (
                          <GlassCTA href="/contact" size="md">
                            Free Quote
                          </GlassCTA>
                        )}
                      </div>

                      {/* Simplified Entry Points on First Slide - Mobile Optimized */}
                      {index === 0 && (
                        <div className="mt-6 sm:mt-8 hidden sm:grid grid-cols-3 gap-3 max-w-4xl mx-auto px-4">
                          <Link
                            href="/services"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-xl p-4 transition-all duration-300 text-center"
                          >
                            <div className="text-3xl mb-2">🌐</div>
                            <h3 className="text-sm font-semibold text-white mb-1">Services</h3>
                            <p className="text-xs text-gray-300">Web & Mobile</p>
                          </Link>
                          <Link
                            href="/courses"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-xl p-4 transition-all duration-300 text-center"
                          >
                            <div className="text-3xl mb-2">📚</div>
                            <h3 className="text-sm font-semibold text-white mb-1">Courses</h3>
                            <p className="text-xs text-gray-300">Learn & Grow</p>
                          </Link>
                          <Link
                            href="/contact"
                            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 rounded-xl p-4 transition-all duration-300 text-center"
                          >
                            <div className="text-3xl mb-2">🤝</div>
                            <h3 className="text-sm font-semibold text-white mb-1">Contact</h3>
                            <p className="text-xs text-gray-300">Get Started</p>
                          </Link>
                        </div>
                      )}

                      {/* Mobile-only simplified version */}
                      {index === 0 && (
                        <div className="mt-4 sm:hidden flex justify-center space-x-4 px-4">
                          <Link href="/services" className="flex flex-col items-center space-y-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 hover:bg-white/20 transition-all duration-300">
                            <span className="text-2xl">🌐</span>
                            <span className="text-xs font-medium text-white">Services</span>
                          </Link>
                          <Link href="/courses" className="flex flex-col items-center space-y-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 hover:bg-white/20 transition-all duration-300">
                            <span className="text-2xl">📚</span>
                            <span className="text-xs font-medium text-white">Courses</span>
                          </Link>
                          <Link href="/contact" className="flex flex-col items-center space-y-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 hover:bg-white/20 transition-all duration-300">
                            <span className="text-2xl">🤝</span>
                            <span className="text-xs font-medium text-white">Contact</span>
                          </Link>
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