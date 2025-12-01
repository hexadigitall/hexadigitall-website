// src/components/sections/Hero.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/contexts/CurrencyContext'
import OptimizedImage from '@/components/ui/OptimizedImage'
import AnimatedBackground from '@/components/animations/AnimatedBackground'

// ============================================================================
// JOURNEY STAGES - The "Digital Compass" Points
// ============================================================================
const JOURNEY_STAGES = [
  {
    id: 'idea',
    label: 'Have an Idea?',
    title: 'Launch Your Dream',
    description: 'We turn your vision into a blueprint with professional Business Plans & Brand Identity.',
    image: '/assets/images/heroes/hero-success-celebration.jpg',
    cta: 'Start Planning',
    href: '/services/business-plan-and-logo-design',
    color: 'from-green-600/90 to-emerald-600/90',
    accentColor: 'green',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M12 3v1M7.5 7.5C6 9 6 11.5 7.2 13.4 8.4 15.3 10.8 16 12 16s3.6-.7 4.8-2.6C18 11.5 18 9 16.5 7.5 15 6 13 5.5 12 7c-1-1.5-3-1-4.5.5z" />
      </svg>
    )
  },
  {
    id: 'build',
    label: 'Ready to Build?',
    title: 'Digital Solutions That Drive Results',
    description: 'Web & Mobile Development to build your digital headquarters. From landing pages to full platforms.',
    image: '/assets/images/heroes/hero-tech-team.jpg',
    cta: 'Start Building',
    href: '/services/web-and-mobile-software-development?stage=build',
    color: 'from-blue-600/90 to-cyan-600/90',
    accentColor: 'blue',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M7 7l5-4 5 4M7 11h10v10H7z" />
      </svg>
    )
  },
  {
    id: 'grow',
    label: 'Need Customers?',
    title: 'Amplify Your Voice',
    description: 'Data-driven marketing strategies that convert followers into customers. Ads, social, and growth hacking.',
    image: '/assets/images/heroes/hero-tech-team.jpg',
    cta: 'Start Growing',
    href: '/services/social-media-advertising-and-marketing',
    color: 'from-pink-600/90 to-orange-600/90',
    accentColor: 'pink',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 13l4-4 4 4 6-6" />
      </svg>
    )
  },
  {
    id: 'learn',
    label: 'Want to Learn?',
    title: 'Unlock Your Potential',
    description: 'Master industry-relevant skills with our comprehensive online courses. Learn at your own pace.',
    image: '/assets/images/heroes/hero-students-learning.jpg',
    cta: 'Preview Courses',
    href: '#courses-preview',
    color: 'from-purple-600/90 to-indigo-600/90',
    accentColor: 'purple',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422m-6.16 3.422V21" />
      </svg>
    )
  }
]

export default function Hero() {
  // State-driven interaction replaces carousel auto-rotation
  const [activeStage, setActiveStage] = useState(JOURNEY_STAGES[1]) // Default to "Build"
  const { getLocalDiscountMessage } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  // Persist last selected stage in localStorage for better continuity
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('hero:lastStage') : null
      if (saved) {
        const found = JOURNEY_STAGES.find(s => s.id === saved)
        if (found) setActiveStage(found)
      }
    } catch {}
  }, [])

  const selectStage = (stage: (typeof JOURNEY_STAGES)[number]) => {
    setActiveStage(stage)
    try { if (typeof window !== 'undefined') window.localStorage.setItem('hero:lastStage', stage.id) } catch {}
  }

  return (
    <section 
      className="relative min-h-[85vh] overflow-hidden bg-gray-900 text-white flex flex-col justify-center"
      aria-label="Interactive service navigator"
      role="region"
    >
      {/* Dynamic Background Layer - Changes based on active stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <OptimizedImage
            src={activeStage.image}
            alt={activeStage.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            className="opacity-20"
            priority
          />
          
          {/* Dynamic Gradient based on stage */}
          <div className={`absolute inset-0 bg-gradient-to-br ${activeStage.color}`} />
          
          {/* Animated Background Effects - Preserved from original */}
          <AnimatedBackground variant="gradient" intensity="medium" />
          <AnimatedBackground variant="particles" intensity="low" />
          
          {/* Decorative SVG Waves */}
          <svg 
            className="absolute bottom-0 left-0 w-full h-32 pointer-events-none" 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <motion.path
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.3, pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,30 1440,60 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Nigerian Discount Banner */}
        {discountMessage && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm border border-green-400/50 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              <span>🇳🇬</span>
              <span className="hidden sm:inline">NIGERIAN LAUNCH SPECIAL - 50% OFF ALL SERVICES!</span>
              <span className="sm:hidden">50% OFF ALL SERVICES!</span>
              <span>🔥</span>
            </div>
          </motion.div>
        )}

        {/* The Tour Guide Question */}
        <motion.div 
          className="text-center mb-8 sm:mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
            Where is your business{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              right now?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            Choose your stage. We&apos;ll guide you to the perfect solution.
          </p>
        </motion.div>

        {/* Interactive Stage Selector Cards - The "Compass" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-8 sm:mb-10">
          {JOURNEY_STAGES.map((stage, index) => (
            <motion.button
              key={stage.id}
              onClick={() => selectStage(stage)}
              onMouseEnter={() => selectStage(stage)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`
                relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden group
                min-h-[80px] sm:min-h-[100px]
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50
                ${activeStage.id === stage.id 
                  ? 'bg-white/15 border-white shadow-xl scale-105' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'}
              `}
              aria-pressed={activeStage.id === stage.id}
              aria-label={`${stage.label} - ${stage.title}`}
            >
              {/* Icon */}
              <div className={`mb-2 ${activeStage.id === stage.id ? 'text-white' : 'text-gray-300'}`}>
                {stage.icon}
              </div>
              
              {/* Label */}
              <h3 className={`font-bold text-sm sm:text-base lg:text-lg leading-tight ${
                activeStage.id === stage.id ? 'text-white' : 'text-gray-300'
              }`}>
                {stage.label}
              </h3>
              
              {/* Active Indicator Line */}
              {activeStage.id === stage.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400"
                />
              )}
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            </motion.button>
          ))}
        </div>

        {/* The Output Area - Dynamic Content Panel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Stage Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                  {activeStage.title}
                </h2>
                
                {/* Stage Description */}
                <p className="text-base sm:text-lg md:text-xl text-gray-200 text-center max-w-2xl mx-auto">
                  {activeStage.description}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Link 
                    href={activeStage.href}
                    prefetch={true}
                    className="w-full sm:w-auto min-h-[48px] px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300 text-center"
                  >
                    {activeStage.cta}
                  </Link>
                  
                  <Link
                    href="/contact"
                    prefetch={true}
                    className="w-full sm:w-auto min-h-[48px] px-8 py-4 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-center"
                  >
                    Get Free Quote
                  </Link>
                </div>

                {/* Nigerian Discount Badge - Show on Build stage */}
                {activeStage.id === 'build' && discountMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center pt-2"
                  >
                    <div className="inline-flex items-center px-4 py-2 bg-green-600/20 text-green-300 border border-green-500/50 rounded-full text-sm">
                      🇳🇬 Special Nigerian Pricing Available
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation Hint */}
        <motion.div 
          className="text-center mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-300 text-sm mb-2">Not sure where to start?</p>
          <Link 
            href="/services/custom-build"
            prefetch={true}
            className="inline-flex items-center text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
          >
            Build a Custom Solution
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}