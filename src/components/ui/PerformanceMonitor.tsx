"use client"

import { useEffect } from 'react'

interface PerformanceMonitorProps {
  enabled?: boolean
}

export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Monitor Core Web Vitals
    const observePerformance = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                const lcp = Math.round(entry.startTime)
                console.log(`🎯 LCP: ${lcp}ms ${lcp > 2500 ? '❌ Poor' : lcp > 1200 ? '⚠️ Needs Improvement' : '✅ Good'}`)
              }
            }
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

          // First Input Delay (FID) / Interaction to Next Paint (INP)
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'first-input') {
                const fidEntry = entry as PerformanceEventTiming
                const fid = Math.round(fidEntry.processingStart - fidEntry.startTime)
                console.log(`⚡ FID: ${fid}ms ${fid > 100 ? '❌ Poor' : fid > 25 ? '⚠️ Needs Improvement' : '✅ Good'}`)
              }
            }
          })
          fidObserver.observe({ entryTypes: ['first-input'] })

          // Cumulative Layout Shift (CLS)
          const clsObserver = new PerformanceObserver((list) => {
            let cls = 0
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !('hadRecentInput' in entry ? entry.hadRecentInput : false)) {
                cls += 'value' in entry ? (entry.value as number) : 0
              }
            }
            if (cls > 0) {
              console.log(`📐 CLS: ${cls.toFixed(3)} ${cls > 0.25 ? '❌ Poor' : cls > 0.1 ? '⚠️ Needs Improvement' : '✅ Good'}`)
            }
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })

          // Long Tasks (tasks taking >50ms)
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const duration = Math.round(entry.duration)
              console.warn(`🐌 Long Task: ${duration}ms - Consider breaking this up`)
            }
          })
          longTaskObserver.observe({ entryTypes: ['longtask'] })

          // Resource loading times
          const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const resource = entry as PerformanceResourceTiming
              const duration = Math.round(resource.responseEnd - resource.requestStart)
              
              if (duration > 3000) { // More than 3 seconds
                console.warn(`🚨 Slow Resource: ${resource.name.split('/').pop()} took ${duration}ms`)
              } else if (duration > 1000) { // More than 1 second
                console.log(`⏰ Resource: ${resource.name.split('/').pop()} took ${duration}ms`)
              }
            }
          })
          resourceObserver.observe({ entryTypes: ['resource'] })

        } catch (error) {
          console.error('Performance monitoring setup failed:', error)
        }
      }

      // Monitor image loading specifically
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.complete) {
          const startTime = performance.now()
          const onLoad = () => {
            const loadTime = Math.round(performance.now() - startTime)
            if (loadTime > 2000) {
              console.warn(`🖼️ Slow Image ${index + 1}: ${loadTime}ms - ${img.src.split('/').pop()}`)
            }
            img.removeEventListener('load', onLoad)
          }
          img.addEventListener('load', onLoad)
        }
      })
    }

    // Run after page load
    if (document.readyState === 'complete') {
      observePerformance()
    } else {
      window.addEventListener('load', observePerformance)
    }

    // Memory usage monitoring (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory
      const used = Math.round(memory.usedJSHeapSize / 1048576)
      const total = Math.round(memory.totalJSHeapSize / 1048576)
      console.log(`🧠 Memory: ${used}MB / ${total}MB`)
      
      if (used > 100) {
        console.warn(`⚠️ High memory usage: ${used}MB`)
      }
    }

    // Clean up function
    return () => {
      window.removeEventListener('load', observePerformance)
    }
  }, [enabled])

  // This component doesn't render anything
  return null
}

// Hook for manual performance measurement
export function usePerformanceTimer(label: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      console.log(`⏱️ ${label}: ${duration}ms`)
    }
  }, [label])
}