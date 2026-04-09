import { describe, expect, it } from 'vitest'
import { signCookie, verifyCookie } from '@/lib/auth/cookies'

describe('auth cookies', () => {
  it('signs and verifies payloads', async () => {
    const token = await signCookie({
      authenticated: true,
      sid: 'sid-123',
      ownerId: 'owner-456',
      timestamp: Date.now(),
    })

    const payload = await verifyCookie(token)

    expect(payload).not.toBeNull()
    expect(payload?.authenticated).toBe(true)
    expect(payload?.sid).toBe('sid-123')
    expect(payload?.ownerId).toBe('owner-456')
  })

  it('rejects tampered tokens', async () => {
    const token = await signCookie({
      authenticated: true,
      sid: 'sid-123',
      ownerId: 'owner-456',
      timestamp: Date.now(),
    })

    const [header, body, signature] = token.split('.')
    const tamperedSignature = `${signature.slice(0, -1)}${signature.endsWith('a') ? 'b' : 'a'}`
    const tampered = [header, body, tamperedSignature].join('.')
    const verified = await verifyCookie(tampered)

    expect(verified).toBeNull()
  })
})
