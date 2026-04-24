import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/intern/upload-image/route'

const {
  mockUpload,
  mockGetPublicUrl,
  mockGetInternalSession,
  mockGetInternalOwner,
} = vi.hoisted(() => ({
  mockUpload: vi.fn(),
  mockGetPublicUrl: vi.fn(),
  mockGetInternalSession: vi.fn(),
  mockGetInternalOwner: vi.fn(),
}))

vi.mock('@/lib/auth/internal', () => ({
  getInternalSession: mockGetInternalSession,
  getInternalOwner: mockGetInternalOwner,
}))

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  }),
}))

describe('POST /api/intern/upload-image', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetInternalSession.mockResolvedValue({ authenticated: true, sid: 'session-1' })
    mockGetInternalOwner.mockResolvedValue('owner-1')
    mockUpload.mockResolvedValue({ error: null })
    mockGetPublicUrl.mockReturnValue({
      data: {
        publicUrl: 'https://rubusfmggsdmbhskqxlo.supabase.co/storage/v1/object/public/quartier-images/internal/owner-1/test.jpg',
      },
    })
  })

  it('rejects unauthenticated uploads', async () => {
    mockGetInternalSession.mockResolvedValue(null)

    const formData = new FormData()
    formData.append('file', new File(['test'], 'bild.jpg', { type: 'image/jpeg' }))

    const response = await POST(new NextRequest('https://quartier.test/api/intern/upload-image', {
      method: 'POST',
      body: formData,
    }))

    expect(response.status).toBe(401)
  })

  it('uploads a valid image through the admin client', async () => {
    const formData = new FormData()
    formData.append('file', new File(['test'], 'bild.jpg', { type: 'image/jpeg' }))

    const response = await POST(new NextRequest('https://quartier.test/api/intern/upload-image', {
      method: 'POST',
      body: formData,
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      publicUrl: 'https://rubusfmggsdmbhskqxlo.supabase.co/storage/v1/object/public/quartier-images/internal/owner-1/test.jpg',
    })
    expect(mockUpload).toHaveBeenCalledTimes(1)
  })

  it('rejects unsupported file types', async () => {
    const formData = new FormData()
    formData.append('file', new File(['test'], 'bild.gif', { type: 'image/gif' }))

    const response = await POST(new NextRequest('https://quartier.test/api/intern/upload-image', {
      method: 'POST',
      body: formData,
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Bitte JPG, PNG oder WebP hochladen',
    })
    expect(mockUpload).not.toHaveBeenCalled()
  })
})
