import { CATEGORIES, COMMUNITIES, type CommunityId } from '@/lib/constants'

const MAX_TITLE_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 3000
const MAX_CONTACT_NAME_LENGTH = 80
const MAX_CONTACT_INFO_LENGTH = 160
const MAX_DETAIL_LENGTH = 120
const MAX_IMAGE_URL_LENGTH = 500
const MAX_EXPIRES_IN_DAYS = 180

const POST_TYPES = new Set(['angebot', 'gesuch', 'tausch'])
const TRADE_TYPES = new Set(['tausch', 'skill-angebot', 'skill-gesuch'])
const COMMUNITIES_SET = new Set(Object.keys(COMMUNITIES))
const CATEGORIES_SET = new Set<string>(CATEGORIES as readonly string[])

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface ValidatedPostPayload {
  title: string
  description: string
  type: 'angebot' | 'gesuch' | 'tausch'
  category: string
  offer: string | null
  seek: string | null
  community: CommunityId
  contact_name: string
  contact_info: string
  expires_at: string
  image_url: string | null
}

export interface ValidatedTradePayload {
  title: string
  description: string
  type: 'tausch' | 'skill-angebot' | 'skill-gesuch'
  offer: string | null
  seek: string | null
  community: CommunityId
  contact_name: string
  contact_info: string
  expires_at: string
  image_url: string | null
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
}

function normalizeString(value: unknown, field: string, maxLength: number): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: `${field} ist ungültig` }
  }

  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return { success: false, error: `${field} ist erforderlich` }
  }

  if (normalized.length > maxLength) {
    return { success: false, error: `${field} ist zu lang` }
  }

  return { success: true, data: normalized }
}

function normalizeOptionalString(value: unknown, maxLength: number): ValidationResult<string | null> {
  if (value == null || value === '') {
    return { success: true, data: null }
  }

  if (typeof value !== 'string') {
    return { success: false, error: 'Ein optionales Feld ist ungültig' }
  }

  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return { success: true, data: null }
  }

  if (normalized.length > maxLength) {
    return { success: false, error: 'Ein optionales Feld ist zu lang' }
  }

  return { success: true, data: normalized }
}

function validateCommunity(value: unknown): ValidationResult<CommunityId> {
  if (typeof value !== 'string' || !COMMUNITIES_SET.has(value)) {
    return { success: false, error: 'Gemeinschaft ist ungültig' }
  }

  return { success: true, data: value as CommunityId }
}

function validateCategory(value: unknown): ValidationResult<string> {
  if (typeof value !== 'string' || !CATEGORIES_SET.has(value)) {
    return { success: false, error: 'Kategorie ist ungültig' }
  }

  return { success: true, data: value }
}

function validateExpiresAt(value: unknown): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: 'Ablaufdatum ist ungültig' }
  }

  const expiresAt = new Date(value)
  if (Number.isNaN(expiresAt.getTime())) {
    return { success: false, error: 'Ablaufdatum ist ungültig' }
  }

  const now = Date.now()
  const max = now + MAX_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000

  if (expiresAt.getTime() <= now) {
    return { success: false, error: 'Ablaufdatum muss in der Zukunft liegen' }
  }

  if (expiresAt.getTime() > max) {
    return { success: false, error: `Ablaufdatum darf maximal ${MAX_EXPIRES_IN_DAYS} Tage in der Zukunft liegen` }
  }

  return { success: true, data: expiresAt.toISOString() }
}

function validateImageUrl(value: unknown): ValidationResult<string | null> {
  if (value == null || value === '') {
    return { success: true, data: null }
  }

  if (typeof value !== 'string' || value.length > MAX_IMAGE_URL_LENGTH) {
    return { success: false, error: 'Bild-URL ist ungültig' }
  }

  try {
    const url = new URL(value)
    const isSupabaseStorage = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i.test(url.href)

    if (!isSupabaseStorage) {
      return { success: false, error: 'Bild-URL ist ungültig' }
    }

    return { success: true, data: url.toString() }
  } catch {
    return { success: false, error: 'Bild-URL ist ungültig' }
  }
}

export function validatePostPayload(body: unknown): ValidationResult<ValidatedPostPayload> {
  const payload = asObject(body)
  if (!payload) {
    return { success: false, error: 'Ungültige Anfrage' }
  }

  const title = normalizeString(payload.title, 'Titel', MAX_TITLE_LENGTH)
  if (!title.success) return title
  const description = normalizeString(payload.description, 'Beschreibung', MAX_DESCRIPTION_LENGTH)
  if (!description.success) return description
  const category = validateCategory(payload.category)
  if (!category.success) return category
  const community = validateCommunity(payload.community)
  if (!community.success) return community
  const contactName = normalizeString(payload.contact_name, 'Kontaktname', MAX_CONTACT_NAME_LENGTH)
  if (!contactName.success) return contactName
  const contactInfo = normalizeString(payload.contact_info, 'Kontaktinfo', MAX_CONTACT_INFO_LENGTH)
  if (!contactInfo.success) return contactInfo
  const expiresAt = validateExpiresAt(payload.expires_at)
  if (!expiresAt.success) return expiresAt
  const imageUrl = validateImageUrl(payload.image_url)
  if (!imageUrl.success) return imageUrl

  if (typeof payload.type !== 'string' || !POST_TYPES.has(payload.type)) {
    return { success: false, error: 'Typ ist ungültig' }
  }

  const offer = normalizeOptionalString(payload.offer, MAX_DETAIL_LENGTH)
  if (!offer.success) return offer
  const seek = normalizeOptionalString(payload.seek, MAX_DETAIL_LENGTH)
  if (!seek.success) return seek

  return {
    success: true,
    data: {
      title: title.data,
      description: description.data,
      type: payload.type as ValidatedPostPayload['type'],
      category: category.data,
      offer: offer.data,
      seek: seek.data,
      community: community.data,
      contact_name: contactName.data,
      contact_info: contactInfo.data,
      expires_at: expiresAt.data,
      image_url: imageUrl.data,
    },
  }
}

export function validateTradePayload(body: unknown): ValidationResult<ValidatedTradePayload> {
  const payload = asObject(body)
  if (!payload) {
    return { success: false, error: 'Ungültige Anfrage' }
  }

  const title = normalizeString(payload.title, 'Titel', MAX_TITLE_LENGTH)
  if (!title.success) return title
  const description = normalizeString(payload.description, 'Beschreibung', MAX_DESCRIPTION_LENGTH)
  if (!description.success) return description
  const community = validateCommunity(payload.community)
  if (!community.success) return community
  const contactName = normalizeString(payload.contact_name, 'Kontaktname', MAX_CONTACT_NAME_LENGTH)
  if (!contactName.success) return contactName
  const contactInfo = normalizeString(payload.contact_info, 'Kontaktinfo', MAX_CONTACT_INFO_LENGTH)
  if (!contactInfo.success) return contactInfo
  const expiresAt = validateExpiresAt(payload.expires_at)
  if (!expiresAt.success) return expiresAt
  const imageUrl = validateImageUrl(payload.image_url)
  if (!imageUrl.success) return imageUrl

  if (typeof payload.type !== 'string' || !TRADE_TYPES.has(payload.type)) {
    return { success: false, error: 'Typ ist ungültig' }
  }

  const offer = normalizeOptionalString(payload.offer, MAX_DETAIL_LENGTH)
  if (!offer.success) return offer
  const seek = normalizeOptionalString(payload.seek, MAX_DETAIL_LENGTH)
  if (!seek.success) return seek

  return {
    success: true,
    data: {
      title: title.data,
      description: description.data,
      type: payload.type as ValidatedTradePayload['type'],
      offer: offer.data,
      seek: seek.data,
      community: community.data,
      contact_name: contactName.data,
      contact_info: contactInfo.data,
      expires_at: expiresAt.data,
      image_url: imageUrl.data,
    },
  }
}
