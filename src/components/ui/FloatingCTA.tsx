"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleLeftEllipsisIcon, XMarkIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getWhatsAppLink, getGeneralInquiryMessage } from '@/lib/whatsapp'

interface FloatingCTAProps {
  showOnScroll?: number
  hideOnPaths?: string[]
}

export default function FloatingCTA({ showOnScroll = 0, hideOnPaths = [] }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const [showHelperText, setShowHelperText] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY >= showOnScroll)

      // ⚡ SMART FIX: Hide helper text immediately if user scrolls (shows intent to read)
      if (scrollY > 100 && showHelperText) {
        setShowHelperText(false)
      }
    }

    // ⚡ SMART FIX: Auto-hide helper text after 5 seconds
    const timer = setTimeout(() => {
      setShowHelperText(false)
    }, 5000)

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [showOnScroll, showHelperText])

  // Hide on specific paths
  if (hideOnPaths.includes(currentPath)) {
    return null
  }

  const handleWhatsAppClick = () => {
    const link = getWhatsAppLink(getGeneralInquiryMessage());
    window.open(link, '_blank');
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-6 right-6 z-50 group"
        >
          {/* Expanded Menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-4 min-w-[220px]"
              >
                <div className="space-y-3">
                  {/* 1. WhatsApp Option (Primary) */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-all duration-300 group text-left"
                  >
                    <div className="p-2 bg-green-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span className="text-gray-800 font-medium">Chat on WhatsApp</span>
                  </button>

                  <Link
                    href="/contact"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium">Get Free Quote</span>
                  </Link>
                  
                  <Link
                    href="tel:+2348125802140"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-teal-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-teal-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium">Call Now</span>
                  </Link>
                  
                  <Link
                    href="mailto:info@hexadigitall.com"
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-orange-500 rounded-lg text-white group-hover:shadow-lg transition-shadow">
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
            onClick={() => {
              setIsExpanded(!isExpanded);
              setShowHelperText(false); // Immediate dismiss on click
            }}
            className={`
              relative w-14 h-14 rounded-full shadow-2xl
              bg-gradient-to-r from-primary to-secondary
              hover:from-secondary hover:to-primary
              text-white flex items-center justify-center
              transition-all duration-300 hover:scale-110
              z-50
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
            
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
              )}
            </motion.div>

            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-[10px] text-white font-bold">1</span>
            </div>
          </motion.button>

          {/* Floating helper text */}
          <AnimatePresence>
            {!isExpanded && showHelperText && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowHelperText(false)}
                className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg cursor-pointer"
              >
                Hi! Need help? 👋
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
  return <FloatingCTA showOnScroll={0} hideOnPaths={['/contact', '/checkout']} />
}

export function ServiceFAB() {
  return <FloatingCTA showOnScroll={400} hideOnPaths={['/services', '/contact']} />
}