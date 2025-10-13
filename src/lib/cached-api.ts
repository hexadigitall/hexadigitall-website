// src/lib/cached-api.ts
import { client } from '@/sanity/client'
// import { withTimeout, withRetry } from '@/lib/timeout-utils' // Temporarily disabled

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APICache {
  private cache: Map<string, CacheEntry<unknown>> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

  private generateKey(query: string, params?: Record<string, unknown>): string {
    return `${query}-${JSON.stringify(params || {})}`
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  async get<T>(
    query: string, 
    params?: Record<string, unknown>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const key = this.generateKey(query, params)
    const cached = this.cache.get(key)

    // Return cached data if it exists and hasn't expired
    if (cached && !this.isExpired(cached)) {
      console.log(`📦 [CACHE HIT] Using cached data for query: ${query.substring(0, 50)}...`)
      return cached.data as T
    }

    // Fetch fresh data
    console.log(`🔄 [CACHE MISS] Fetching fresh data for query: ${query.substring(0, 50)}...`)
    try {
      const data = await client.fetch<T>(query, params as Record<string, unknown>)
      
      // Cache the result
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })

      // Clean up expired entries (simple cleanup)
      this.cleanupExpired()

      return data
    } catch (error) {
      console.error('❌ [API ERROR] Failed to fetch data:', error)
      
      // Return stale data if available as fallback
      if (cached) {
        console.log('🔄 [STALE FALLBACK] Using expired cached data')
        return cached.data as T
      }
      
      throw error
    }
  }

  private cleanupExpired(): void {
    // Only run cleanup occasionally to avoid performance impact
    if (Math.random() > 0.1) return // 10% chance to run cleanup

    let cleaned = 0
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 [CACHE CLEANUP] Removed ${cleaned} expired entries`)
    }
  }

  clear(): void {
    this.cache.clear()
    console.log('🗑️ [CACHE CLEAR] All cache entries cleared')
  }

  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()).map(key => key.substring(0, 100))
    }
  }
}

// Export singleton instance
export const apiCache = new APICache()

// Export convenience functions
export const cachedFetch = <T>(
  query: string, 
  params?: Record<string, unknown>,
  ttlMinutes: number = 5
): Promise<T> => {
  return apiCache.get<T>(query, params, ttlMinutes * 60 * 1000)
}

// Specific cache functions for common queries
export const getCachedFeaturedCourses = () => 
  cachedFetch(`*[_type == "course" && featured == true] | order(_createdAt desc)[0...4] {
    _id,
    title,
    slug,
    "mainImage": mainImage.asset->url,
    description,
    duration,
    level,
    instructor,
    nairaPrice,
    dollarPrice,
    price,
    featured
  }`, {}, 10) // 10 minutes cache

export const getCachedServiceCategories = () =>
  cachedFetch(`*[_type == "serviceCategory"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    description,
    serviceType,
    icon,
    featured,
    packages,
    requirements,
    faq
  }`, {}, 15) // 15 minutes cache

export const getCachedServices = () =>
  cachedFetch(`*[_type == "service"] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    overview
  }`, {}, 15) // 15 minutes cache

export const getCachedCourseCategories = () =>
  cachedFetch(`*[_type == "courseCategory"] | order(title asc) {
    _id,
    title,
    description[0...200],
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      summary[0...200],
      "mainImage": mainImage.asset->url,
      description[0...300],
      duration,
      level,
      instructor,
      nairaPrice,
      dollarPrice,
      price,
      featured
    }
  }`, {}, 15) // 15 minutes cache for better performance
