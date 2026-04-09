import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/intern/posts/route'
import { PATCH, DELETE } from '@/app/api/intern/posts/[id]/route'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'
import { createAdminClient } from '@/lib/supabase/server'
import { createSupabaseMock, createJsonRequest } from '@/test/support'

vi.mock('@/lib/auth/internal', () => ({
  getInternalSession: vi.fn(),
  getInternalOwner: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: vi.fn(),
}))

describe('internal posts api', () => {
  afterEach(() => {
    vi.mocked(getInternalSession).mockReset()
    vi.mocked(getInternalOwner).mockReset()
    vi.mocked(createAdminClient).mockReset()
  })

  it('rejects unauthenticated writes', async () => {
    vi.mocked(getInternalSession).mockResolvedValue(null)
    vi.mocked(getInternalOwner).mockResolvedValue(null)

    const response = await POST(createJsonRequest('https://quartier.test/api/intern/posts', {
      title: 'Test',
      description: 'Test',
      type: 'angebot',
      category: 'Gegenstände',
      contact_name: 'Max',
      contact_info: 'Mail',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    }))

    expect(response.status).toBe(401)
  })

  it('binds created posts to the current owner id', async () => {
    const mock = createSupabaseMock()
    const queryChain = mock.queryChain as {
      single: ReturnType<typeof vi.fn>
      insert: ReturnType<typeof vi.fn>
      delete: ReturnType<typeof vi.fn>
    }
    vi.mocked(getInternalSession).mockResolvedValue({ authenticated: true, sid: 'sid-1' } as never)
    vi.mocked(getInternalOwner).mockResolvedValue('owner-1')
    vi.mocked(createAdminClient).mockReturnValue(mock.supabase as never)
    queryChain.single.mockResolvedValue({ data: { id: 'post-1' }, error: null })

    const response = await POST(createJsonRequest('https://quartier.test/api/intern/posts', {
      title: 'Werkzeug verleihen',
      description: 'Bohraufsatz verfügbar',
      type: 'angebot',
      category: 'Gegenstände',
      offer: null,
      seek: null,
      community: 'wogenau',
      contact_name: 'Mia',
      contact_info: 'maria@example.test',
      expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      image_url: null,
    }))

    expect(response.status).toBe(200)
    expect(queryChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        creator_session_id: 'owner-1',
        title: 'Werkzeug verleihen',
      community: 'wogenau',
    })
    )
  })

  it('blocks updates from a different owner', async () => {
    const mock = createSupabaseMock()
    const queryChain = mock.queryChain as {
      single: ReturnType<typeof vi.fn>
    }
    vi.mocked(getInternalSession).mockResolvedValue({ authenticated: true, sid: 'sid-1' } as never)
    vi.mocked(getInternalOwner).mockResolvedValue('owner-2')
    vi.mocked(createAdminClient).mockReturnValue(mock.supabase as never)
    queryChain.single.mockResolvedValue({
      data: { id: 'post-1', creator_session_id: 'owner-1' },
      error: null,
    })

    const response = (await PATCH(
      createJsonRequest('https://quartier.test/api/intern/posts/post-1', {
        title: 'Edit',
        description: 'Edit',
        type: 'angebot',
        category: 'Gegenstände',
        offer: null,
        seek: null,
        community: 'wogenau',
        contact_name: 'Mia',
        contact_info: 'maria@example.test',
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      }, { method: 'PATCH' }),
      { params: { id: 'post-1' } }
    ))!

    expect(response.status).toBe(403)
  })

  it('deletes owned posts', async () => {
    const mock = createSupabaseMock()
    const queryChain = mock.queryChain as {
      single: ReturnType<typeof vi.fn>
      delete: ReturnType<typeof vi.fn>
    }
    vi.mocked(getInternalSession).mockResolvedValue({ authenticated: true, sid: 'sid-1' } as never)
    vi.mocked(getInternalOwner).mockResolvedValue('owner-1')
    vi.mocked(createAdminClient).mockReturnValue(mock.supabase as never)
    queryChain.single.mockResolvedValue({
      data: { id: 'post-1', creator_session_id: 'owner-1' },
      error: null,
    })

    const response = (await DELETE(new NextRequest('https://quartier.test/api/intern/posts/post-1'), {
      params: { id: 'post-1' },
    }))!

    expect(response.status).toBe(200)
    expect(queryChain.delete).toHaveBeenCalledTimes(1)
  })
})
