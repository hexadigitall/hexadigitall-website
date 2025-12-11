"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleLeftEllipsisIcon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface FloatingCTAProps {
  showOnScroll?: number
  hideOnPaths?: string[]
}

export default function FloatingCTA({ showOnScroll = 300, hideOnPaths = [] }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const [showHelperText, setShowHelperText] = useState(true)

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > showOnScroll)
      // Reset helper text when scrolling shows the button
      if (scrollY > showOnScroll && !showHelperText) {
        setShowHelperText(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showOnScroll, showHelperText])

  // Auto-hide helper text after 4 seconds
  useEffect(() => {
    if (showHelperText && !isExpanded && isVisible) {
      const timer = setTimeout(() => {
        setShowHelperText(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showHelperText, isExpanded, isVisible])

  // Hide on specific paths
  if (hideOnPaths.includes(currentPath)) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Expanded Menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-4 min-w-[200px]"
              >
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium">Get Free Quote</span>
                  </Link>
                  
                  <Link
                    href="tel:+2348123456789"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium">Call Now</span>
                  </Link>
                  
                  <Link
                    href="mailto:info@hexadigitall.com"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium">Send Email</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main FAB Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              relative w-14 h-14 rounded-full shadow-2xl
              bg-gradient-to-r from-gradient-start to-gradient-end
              hover:from-gradient-end hover:to-gradient-start
              text-white flex items-center justify-center
              transition-all duration-300 hover:scale-110
              animate-pulse-glow
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-20"></div>
            
            {/* Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
              )}
            </motion.div>

            {/* Badge for notification */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </motion.button>

          {/* Floating helper text - fades in then out after 4 seconds */}
          <AnimatePresence>
            {!isExpanded && showHelperText && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
              >
                Need help? Chat with us!
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-l-[6px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Usage examples:
export function QuickContactFAB() {
  return <FloatingCTA showOnScroll={200} hideOnPaths={['/contact', '/checkout']} />
}

export function ServiceFAB() {
  return <FloatingCTA showOnScroll={400} hideOnPaths={['/services', '/contact']} />
}