import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/auth/login/route'

function createRequest(password: string, ip: string) {
  return new NextRequest('https://quartier.test/api/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify({ password }),
  })
}

describe('internal auth login route', () => {
  it('rejects a wrong password', async () => {
    const response = await POST(createRequest('wrong-password', '203.0.113.11'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Falsches Passwort' })
  })

  it('sets signed cookies on a successful login', async () => {
    const response = await POST(createRequest('Gemeinschaft', '203.0.113.12'))

    expect(response.status).toBe(200)
    expect(response.cookies.get('quartier_session')?.value).toBeTruthy()
    expect(response.cookies.get('quartier_owner')?.value).toBeTruthy()
  })
})
