'use client'

import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'standard' | 'glass' | 'neon' | 'gradient'
  intensity?: 'low' | 'medium' | 'high'
  delay?: number
}

export default function AnimatedCard({
  children,
  className = '',
  variant = 'standard',
  intensity = 'medium',
  delay = 0
}: AnimatedCardProps) {
  const getTiltProps = () => {
    switch (intensity) {
      case 'low': return { max: 15, scale: 1.02, speed: 1000 }
      case 'medium': return { max: 25, scale: 1.05, speed: 800 }
      case 'high': return { max: 35, scale: 1.08, speed: 600 }
      default: return { max: 25, scale: 1.05, speed: 800 }
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
      case 'neon':
        return 'bg-gray-900/80 border border-cyan-400/30 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40'
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10'
      default:
        return 'bg-white shadow-lg hover:shadow-xl border border-gray-200'
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1
    }
  }
  
  const transitionProps = {
    duration: 0.6,
    delay: delay,
    ease: "easeOut" as const
  }

  const tiltProps = getTiltProps()

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={transitionProps}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      <Tilt
        tiltMaxAngleX={tiltProps.max}
        tiltMaxAngleY={tiltProps.max}
        scale={tiltProps.scale}
        transitionSpeed={tiltProps.speed}
        glareEnable={variant === 'neon' || variant === 'glass'}
        glareMaxOpacity={variant === 'neon' ? 0.3 : 0.1}
        glareColor={variant === 'neon' ? '#00ffff' : '#ffffff'}
        glarePosition="all"
        glareBorderRadius="16px"
      >
        <div className={`
          rounded-2xl p-6 transition-all duration-500 
          ${getVariantStyles()} 
          ${className}
        `}>
          {children}
          {variant === 'neon' && (
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 animate-pulse" />
            </div>
          )}
          {variant === 'gradient' && (
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/5 to-purple-400/5" />
            </div>
          )}
        </div>
      </Tilt>
    </motion.div>
  )
}