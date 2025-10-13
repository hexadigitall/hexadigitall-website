'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import { GradientCTA, GlassCTA } from '@/components/ui/CTAButton'
import OptimizedImage from '@/components/ui/OptimizedImage'
import AnimatedBackground from '@/components/animations/AnimatedBackground'

// Hero slides data
const slides = [
  {
    title: "Digital Solutions That Drive Results",
    subtitle: "Web • Mobile • Marketing • Consulting",
    description: "Transform your business with our expert digital services. From concept to launch, we deliver solutions that grow your success.",
    image: "/assets/images/heroes/hero-tech-team.jpg",
    cta: {
      text: "Get Started",
      href: "/services"
    }
  },
  {
    title: "Launch Your Dream with Our Expert Guidance",
    subtitle: "Empowering Startups and Businesses",
    description: "Navigate the complexities of the digital landscape with our expert mentoring and consulting services. We provide strategic advice and hands-on support to help you achieve your goals.",
    image: "/assets/images/heroes/hero-success-celebration.jpg",
    cta: {
      text: "Get a Free Consultation",
      href: "/contact"
    }
  },
  {
    title: "Unlock Your Potential with Our Online Courses",
    subtitle: "Learn, Grow, and Succeed with HexaDigitall",
    description: "Our comprehensive online courses are designed to equip you with the skills and knowledge needed to excel in the digital age. Learn from industry experts and take your career to the next level.",
    image: "/assets/images/heroes/hero-students-learning.jpg",
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
                      {/* Enhanced animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gradient-start via-primary to-secondary opacity-90"></div>
                      
                      {/* Dynamic animated background */}
                      <AnimatedBackground variant="gradient" intensity="medium" />
                      <AnimatedBackground variant="particles" intensity="low" />
                      
                      {/* Enhanced wave overlay */}
                      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path
                          initial={{ opacity: 0, pathLength: 0 }}
                          animate={{ opacity: 0.4, pathLength: 1 }}
                          transition={{ duration: 2.5, ease: "easeInOut" }}
                          d="M0,160 C480,320 960,0 1440,160 L1440,600 L0,600 Z"
                          fill="url(#modernGradient)"
                        />
                        <motion.path
                          initial={{ opacity: 0, scale: 0.8, pathLength: 0 }}
                          animate={{ opacity: 0.3, scale: 1, pathLength: 1 }}
                          transition={{ duration: 3, delay: 0.8, ease: "easeInOut" }}
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
                      <div className={`absolute inset-0 ${index === 1 ? 'bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-teal-900/70' : 'bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-pink-900/70'}`}></div>
                      
                      {/* Different animated backgrounds for each slide */}
                      {index === 1 ? (
                        <>
                          <AnimatedBackground variant="waves" intensity="medium" />
                          <AnimatedBackground variant="particles" intensity="low" />
                        </>
                      ) : (
                        <>
                          <AnimatedBackground variant="geometric" intensity="low" />
                          <AnimatedBackground variant="gradient" intensity="low" />
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Content */}
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center py-8 sm:py-12">
                  <div className="max-w-6xl w-full text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-4 sm:space-y-6"
                    >
                      <h1 className="text-sm sm:text-base lg:text-lg font-semibold uppercase tracking-widest text-secondary mb-2 sm:mb-4">
                        {slide.subtitle}
                      </h1>
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading text-white leading-tight">
                          {slide.title}
                        </p>
                        
                        {/* Launch Special Banner - Only for Nigerian currency */}
                        {isClient && index === 0 && discountMessage && (
                          <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm border border-green-400/50 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <span>🇳🇬</span>
                            <span className="hidden sm:inline">50% OFF ALL SERVICES!</span>
                            <span className="sm:hidden">50% OFF!</span>
                            <span>🔥</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-200 leading-relaxed">
                        {slide.description}
                      </p>
                      
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

                      {/* Enhanced Quick Links on First Slide - Responsive */}
                      {index === 0 && (
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto">
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                          >
                            <Link
                              href="/services"
                              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-xl p-3 sm:p-4 transition-all duration-500 text-center hover:scale-110 hover:-translate-y-2 hover-glow relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🌐</div>
                                <h3 className="text-sm sm:text-base font-semibold text-white mb-0 sm:mb-1 group-hover:text-cyan-300 transition-colors">Services</h3>
                                <p className="text-xs text-gray-300 group-hover:text-gray-200 hidden sm:block transition-colors">Web & Mobile</p>
                              </div>
                            </Link>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                          >
                            <Link
                              href="/courses"
                              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-xl p-3 sm:p-4 transition-all duration-500 text-center hover:scale-110 hover:-translate-y-2 hover-glow relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">📚</div>
                                <h3 className="text-sm sm:text-base font-semibold text-white mb-0 sm:mb-1 group-hover:text-pink-300 transition-colors">Courses</h3>
                                <p className="text-xs text-gray-300 group-hover:text-gray-200 hidden sm:block transition-colors">Learn & Grow</p>
                              </div>
                            </Link>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                          >
                            <Link
                              href="/contact"
                              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-xl p-3 sm:p-4 transition-all duration-500 text-center hover:scale-110 hover:-translate-y-2 hover-glow relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🤝</div>
                                <h3 className="text-sm sm:text-base font-semibold text-white mb-0 sm:mb-1 group-hover:text-green-300 transition-colors">Contact</h3>
                                <p className="text-xs text-gray-300 group-hover:text-gray-200 hidden sm:block transition-colors">Get Started</p>
                              </div>
                            </Link>
                          </motion.div>
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