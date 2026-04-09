import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/admin/logout/route'
import { createClient } from '@/lib/supabase/server'
import { createSupabaseMock } from '@/test/support'
import { NextRequest } from 'next/server'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('admin logout route', () => {
  afterEach(() => {
    vi.mocked(createClient).mockReset()
  })

  it('signs out and redirects to the admin login page', async () => {
    const mock = createSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(mock.supabase as never)
    mock.auth.signOut.mockResolvedValue(undefined)

    const response = await POST(new NextRequest('https://quartier.test/api/admin/logout', { method: 'POST' }))

    expect(mock.auth.signOut).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://quartier.test/admin/login')
  })
})
