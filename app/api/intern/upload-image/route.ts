import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'

const MAX_FILE_SIZE = 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
}

function extensionForType(type: string) {
  switch (type) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      return 'bin'
  }
}

export async function POST(request: NextRequest) {
  const session = await getInternalSession()
  const ownerId = await getInternalOwner()

  if (!session || !ownerId) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Keine Datei gefunden' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Bitte JPG, PNG oder WebP hochladen' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Das Bild ist zu groß. Maximal 1 MB.' }, { status: 400 })
  }

  const extension = extensionForType(file.type)
  const originalName = sanitizeFileName(file.name.replace(/\.[^.]+$/, '')) || 'bild'
  const filePath = `internal/${ownerId}/${Date.now()}-${originalName}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const supabase = createAdminClient()

  const { error } = await supabase.storage
    .from('quartier-images')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { data } = supabase.storage.from('quartier-images').getPublicUrl(filePath)

  return NextResponse.json({ publicUrl: data.publicUrl })
}
