'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'waves' | 'geometric' | 'gradient'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export default function AnimatedBackground({ 
  variant = 'particles', 
  intensity = 'medium',
  className = ''
}: AnimatedBackgroundProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return null
  }
  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 15
      case 'medium': return 25
      case 'high': return 40
      default: return 25
    }
  }

  const particles = Array.from({ length: getParticleCount() }, (_, i) => i)

  if (variant === 'particles') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {particles.map((particle) => (
          <motion.div
            key={particle}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'waves') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800">
          <motion.path
            d="M0,400 C360,300 720,500 1080,400 C1260,350 1350,450 1440,400 L1440,800 L0,800 Z"
            fill="url(#waveGradient1)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,500 C240,400 480,600 720,500 C960,400 1200,600 1440,500 L1440,800 L0,800 Z"
            fill="url(#waveGradient2)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  if (variant === 'geometric') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className={`absolute border border-white/10 ${
              i % 3 === 0 ? 'w-16 h-16 rounded-full' :
              i % 3 === 1 ? 'w-12 h-12' : 'w-20 h-20 rounded-lg'
            }`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 0,
              scale: 0.5,
              opacity: 0
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth * 0.2,
                window.innerWidth * 0.8 + Math.random() * window.innerWidth * 0.2
              ],
              y: [
                Math.random() * window.innerHeight * 0.2,
                window.innerHeight * 0.8 + Math.random() * window.innerHeight * 0.2
              ],
              rotate: 360,
              scale: [0.5, 1, 0.5],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 20 + 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'gradient') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)'
          }}
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    )
  }

  return null
}