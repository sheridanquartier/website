import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/admin/login/route'
import { createClient } from '@/lib/supabase/server'
import { getAdminAccess } from '@/lib/auth/admin'
import { findAdminByUsername } from '@/lib/auth/adminUsernames'
import { createSupabaseMock } from '@/test/support'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/auth/admin', () => ({
  getAdminAccess: vi.fn(),
}))

vi.mock('@/lib/auth/adminUsernames', () => ({
  findAdminByUsername: vi.fn(),
  toAdminLoginIdentity: (loginKey: string) => `${loginKey}@quartier-admin.local`,
}))

describe('admin login route', () => {
  afterEach(() => {
    vi.mocked(createClient).mockReset()
    vi.mocked(getAdminAccess).mockReset()
    vi.mocked(findAdminByUsername).mockReset()
  })

  it('rejects an unknown username', async () => {
    vi.mocked(findAdminByUsername).mockReturnValue(null)
    const request = new NextRequest('https://quartier.test/api/admin/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.21',
      },
      body: JSON.stringify({ username: 'unknown', password: 'secret' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(vi.mocked(createClient)).not.toHaveBeenCalled()
  })

  it('signs in with the mapped admin login identity', async () => {
    const mock = createSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(mock.supabase as never)
    vi.mocked(findAdminByUsername).mockReturnValue({
      username: 'Admin',
      loginKey: 'admin',
      role: 'superadmin',
      community: null,
    })
    vi.mocked(getAdminAccess).mockReturnValue({
      role: 'superadmin',
      community: null,
      isSuperadmin: true,
      isCommunityAdmin: false,
    })
    mock.auth.signInWithPassword.mockResolvedValue({
      data: { user: { app_metadata: { role: 'superadmin' } } },
      error: null,
    })

    const request = new NextRequest('https://quartier.test/api/admin/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.22',
      },
      body: JSON.stringify({ username: 'Admin', password: 'test123' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@quartier-admin.local',
      password: 'test123',
    })
  })
})
