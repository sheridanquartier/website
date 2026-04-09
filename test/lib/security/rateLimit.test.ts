import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { consumeRateLimit, getClientIp, resetRateLimit } from '@/lib/security/rateLimit'

describe('rate limit helper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-09T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('prefers x-forwarded-for over x-real-ip', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.7, 10.0.0.1',
      'x-real-ip': '198.51.100.9',
    })

    expect(getClientIp(headers)).toBe('203.0.113.7')
  })

  it('tracks attempts within a window and resets afterwards', () => {
    const key = 'test-rate-limit'

    const first = consumeRateLimit(key, { windowMs: 60_000, max: 2 })
    const second = consumeRateLimit(key, { windowMs: 60_000, max: 2 })
    const third = consumeRateLimit(key, { windowMs: 60_000, max: 2 })

    expect(first).toEqual({
      allowed: true,
      remaining: 1,
      retryAfterSeconds: 60,
    })
    expect(second).toEqual({
      allowed: true,
      remaining: 0,
      retryAfterSeconds: 60,
    })
    expect(third.allowed).toBe(false)

    resetRateLimit(key)
    vi.setSystemTime(new Date('2026-04-09T10:01:01.000Z'))

    const afterReset = consumeRateLimit(key, { windowMs: 60_000, max: 2 })

    expect(afterReset.allowed).toBe(true)
    expect(afterReset.remaining).toBe(1)
  })
})
