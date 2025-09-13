'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  endDate: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ endDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endDate.getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (isExpired) {
    return (
      <div className={`text-red-600 font-bold ${className}`}>
        ⚠️ Offer Expired
      </div>
    )
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${className}`}>
      <span className="text-red-600 font-semibold text-sm sm:text-base">⏰</span>
      <div className="flex items-center space-x-1 text-red-600 font-mono font-bold text-xs sm:text-sm">
        {timeLeft.days > 0 && (
          <>
            <span className="bg-red-100 px-1 sm:px-2 py-1 rounded">{timeLeft.days}</span>
            <span className="text-xs">d</span>
          </>
        )}
        <span className="bg-red-100 px-1 sm:px-2 py-1 rounded">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-xs">:</span>
        <span className="bg-red-100 px-1 sm:px-2 py-1 rounded">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-xs">:</span>
        <span className="bg-red-100 px-1 sm:px-2 py-1 rounded">{timeLeft.seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  )
}

// Component for spots remaining (simulated scarcity)
export function SpotsRemaining({ className = "" }: { className?: string }) {
  const [spotsLeft, setSpotsLeft] = useState(47) // Starting at 47 for realism

  useEffect(() => {
    // Simulate spots being taken randomly
    const interval = setInterval(() => {
      if (Math.random() > 0.85 && spotsLeft > 15) { // 15% chance to decrease, minimum 15 spots
        setSpotsLeft(prev => Math.max(15, prev - 1))
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [spotsLeft])

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      <span className="bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse whitespace-nowrap">
        {spotsLeft} SPOTS LEFT
      </span>
      {spotsLeft <= 25 && (
        <span className="text-red-600 text-xs font-medium animate-bounce whitespace-nowrap">
          Hurry! Almost full!
        </span>
      )}
    </div>
  )
}