import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/auth/logout/route'

describe('internal auth logout route', () => {
  it('redirects back to the current host and clears auth cookies', async () => {
    const response = await POST(new NextRequest('https://quartier.test/intern/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://quartier.test/')
    expect(response.cookies.get('quartier_session')?.value).toBe('')
    expect(response.cookies.get('quartier_owner')?.value).toBe('')
  })
})
