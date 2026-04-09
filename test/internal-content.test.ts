import { describe, expect, it } from 'vitest'
import { validatePostPayload, validateTradePayload } from '@/lib/security/internalContent'

describe('validatePostPayload', () => {
  it('rejects invalid communities', () => {
    const result = validatePostPayload({
      title: 'Test',
      description: 'Beschreibung',
      type: 'angebot',
      category: 'Gegenstände',
      community: 'evil',
      contact_name: 'Max',
      contact_info: 'max@example.com',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      image_url: null,
    })

    expect(result.success).toBe(false)
  })

  it('rejects image URLs outside supabase public storage', () => {
    const result = validatePostPayload({
      title: 'Test',
      description: 'Beschreibung',
      type: 'angebot',
      category: 'Gegenstände',
      community: 'wogenau',
      contact_name: 'Max',
      contact_info: 'max@example.com',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      image_url: 'https://evil.example.com/test.png',
    })

    expect(result.success).toBe(false)
  })
})

describe('validateTradePayload', () => {
  it('accepts valid trade payloads', () => {
    const result = validateTradePayload({
      title: 'Biete Hilfe',
      description: 'Kann beim Tragen helfen',
      type: 'skill-angebot',
      offer: 'Tragehilfe',
      seek: null,
      community: 'sheridan-junia',
      contact_name: 'Mia',
      contact_info: 'mia@example.com',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      image_url: null,
    })

    expect(result.success).toBe(true)
  })
})
