import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { middleware } from '@/middleware'
import { verifyCookie } from '@/lib/auth/cookies'

vi.mock('@/lib/auth/cookies', () => ({
  verifyCookie: vi.fn(),
}))

describe('middleware auth guard', () => {
  afterEach(() => {
    vi.mocked(verifyCookie).mockReset()
  })

  it('redirects internal routes without a session cookie', async () => {
    const request = new NextRequest('https://quartier.test/intern/dashboard')

    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://quartier.test/login')
  })

  it('redirects internal routes with an invalid session cookie', async () => {
    vi.mocked(verifyCookie).mockResolvedValue(null)
    const request = new NextRequest('https://quartier.test/intern/dashboard', {
      headers: {
        cookie: 'quartier_session=broken',
      },
    })

    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://quartier.test/login')
  })

  it('allows internal routes with a valid session cookie', async () => {
    vi.mocked(verifyCookie).mockResolvedValue({
      authenticated: true,
      sid: 'sid-123',
      ownerId: 'owner-456',
    })
    const request = new NextRequest('https://quartier.test/intern/dashboard', {
      headers: {
        cookie: 'quartier_session=valid',
      },
    })

    const response = await middleware(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })
})
