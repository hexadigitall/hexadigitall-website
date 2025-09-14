// src/lib/timeout-utils.ts

export class TimeoutError extends Error {
  constructor(message: string, public timeout: number) {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Wraps a promise with a timeout
 */
export function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  errorMessage?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(
        errorMessage || `Operation timed out after ${timeoutMs}ms`, 
        timeoutMs
      ))
    }, timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timeoutId)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

/**
 * Retries a promise-returning function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    timeoutMs?: number
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    timeoutMs = 30000,
    onRetry
  } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const promise = fn()
      return timeoutMs ? await withTimeout(promise, timeoutMs) : await promise
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
      
      if (onRetry) {
        onRetry(attempt, lastError)
      }

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Creates a debounced version of a function
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null

  return ((...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }) as T
}

/**
 * Creates a throttled version of a function
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  limit: number
): T {
  let inThrottle = false

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }) as T
}

/**
 * Fetches data with timeout and retry logic
 */
export async function fetchWithTimeout(
  url: string, 
  options: RequestInit & { 
    timeout?: number
    retries?: number
  } = {}
): Promise<Response> {
  const { timeout = 10000, retries = 3, ...fetchOptions } = options

  return withRetry(
    () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      return fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId))
    },
    {
      maxAttempts: retries + 1,
      timeoutMs: timeout,
      onRetry: (attempt, error) => {
        console.warn(`Fetch attempt ${attempt} failed for ${url}:`, error.message)
      }
    }
  )
}

/**
 * Preloads an image with timeout
 */
export function preloadImage(
  src: string, 
  timeoutMs: number = 10000
): Promise<HTMLImageElement> {
  return withTimeout(
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
      img.src = src
    }),
    timeoutMs,
    `Image preload timed out after ${timeoutMs}ms: ${src}`
  )
}

/**
 * Batch processes items with a delay between batches
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  batchSize: number = 5,
  batchDelay: number = 100
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchPromises = batch.map((item, index) => 
      processor(item, i + index)
    )
    
    const batchResults = await Promise.allSettled(batchPromises)
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.error(`Batch item ${i + index} failed:`, result.reason)
      }
    })
    
    // Delay between batches to prevent overwhelming
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, batchDelay))
    }
  }
  
  return results
}