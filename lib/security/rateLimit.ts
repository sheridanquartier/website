type RateLimitOptions = {
  windowMs: number
  max: number
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

const globalStore = globalThis as typeof globalThis & {
  __quartierRateLimitStore?: Map<string, RateLimitEntry>
}

const rateLimitStore = globalStore.__quartierRateLimitStore ?? new Map<string, RateLimitEntry>()
globalStore.__quartierRateLimitStore = rateLimitStore

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return headers.get('x-real-ip')?.trim() || 'unknown'
}

export function consumeRateLimit(
  key: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    })

    return {
      allowed: true,
      remaining: Math.max(options.max - 1, 0),
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    }
  }

  current.count += 1
  rateLimitStore.set(key, current)

  return {
    allowed: current.count <= options.max,
    remaining: Math.max(options.max - current.count, 0),
    retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
  }
}

export function resetRateLimit(key: string) {
  rateLimitStore.delete(key)
}
