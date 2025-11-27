// Simple in-memory rate limiting (for production, consider Redis-based solution)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
  identifier?: string // Optional custom identifier (defaults to IP)
}

export async function rateLimit(
  request: Request | { headers: { get: (key: string) => string | null } },
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  try {
    const { maxRequests, windowMs, identifier } = options
    
    // Get identifier (IP address or custom)
    let id: string = identifier || 'unknown'
    if (!identifier) {
      try {
        // Safely get headers
        const headers = request.headers
        if (headers && typeof headers.get === 'function') {
          const forwardedFor = headers.get('x-forwarded-for')
          if (forwardedFor) {
            const firstIp = forwardedFor.split(',')[0]?.trim()
            if (firstIp) {
              id = firstIp
            }
          }
          if (id === 'unknown') {
            const realIp = headers.get('x-real-ip')
            if (realIp) {
              id = realIp
            }
          }
        }
      } catch (e) {
        console.error('Error getting IP from headers:', e)
        id = 'unknown'
      }
    }
  
    const now = Date.now()
    const key = `${id}:${maxRequests}:${windowMs}`
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      const keys = Array.from(rateLimitStore.keys())
      for (const k of keys) {
        const v = rateLimitStore.get(k)
        if (v && v.resetAt < now) {
          rateLimitStore.delete(k)
        }
      }
    }
    
    const record = rateLimitStore.get(key)
    
    if (!record || record.resetAt < now) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: now + windowMs,
      }
    }
    
    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt,
      }
    }
    
    record.count++
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetAt: record.resetAt,
    }
  } catch (error) {
    // If anything goes wrong with rate limiting, allow the request
    console.error('Rate limit function error:', error)
    const { maxRequests, windowMs } = options
    const now = Date.now()
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    }
  }
}

