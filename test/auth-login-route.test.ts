import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/auth/login/route'
import { createJsonRequest } from '@/test/support'

vi.mock('@/lib/auth/cookies', () => ({
  signCookie: vi.fn(async (payload: unknown) => `signed:${JSON.stringify(payload)}`),
}))

vi.mock('@/lib/security/rateLimit', () => ({
  consumeRateLimit: vi.fn(() => ({ allowed: true, retryAfterSeconds: 0 })),
  getClientIp: vi.fn(() => '127.0.0.1'),
  resetRateLimit: vi.fn(),
}))

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    process.env.INTERNAL_PASSWORD = 'Gemeinschaft'
  })

  it('rejects invalid passwords', async () => {
    const response = await POST(createJsonRequest('https://quartier.test/api/auth/login', { password: 'wrong' }))
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Falsches Passwort')
  })

  it('sets both session cookies for valid passwords', async () => {
    const response = await POST(createJsonRequest('https://quartier.test/api/auth/login', { password: 'Gemeinschaft' }))

    expect(response.status).toBe(200)
    const setCookie = response.headers.get('set-cookie') || ''
    expect(setCookie).toContain('quartier_session=')
    expect(setCookie).toContain('quartier_owner=')
  })
})
