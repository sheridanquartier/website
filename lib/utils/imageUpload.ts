import { createClient } from '@/lib/supabase/client'

/**
 * Lädt ein Bild zu Supabase Storage hoch
 * @param file Die hochzuladende Datei
 * @param bucket Der Storage Bucket Name (default: 'quartier-images')
 * @returns Die öffentliche URL des hochgeladenen Bildes
 */
export async function uploadImage(
  file: File,
  bucket: string = 'quartier-images'
): Promise<string> {
  const supabase = createClient()

  // Einzigartigen Dateinamen generieren
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()
  const fileName = `${timestamp}-${sanitizedName}`

  // Upload
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    throw new Error(`Upload fehlgeschlagen: ${error.message}`)
  }

  // Öffentliche URL abrufen
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

/**
 * Löscht ein Bild aus Supabase Storage
 * @param url Die URL des zu löschenden Bildes
 * @param bucket Der Storage Bucket Name
 */
export async function deleteImage(
  url: string,
  bucket: string = 'quartier-images'
): Promise<void> {
  const supabase = createClient()

  // Extrahiere den Dateinamen aus der URL
  const fileName = url.split('/').pop()
  if (!fileName) return

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    console.error('Fehler beim Löschen des Bildes:', error)
  }
}
