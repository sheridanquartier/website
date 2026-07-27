'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage?: string | null
}

const MAX_FILE_SIZE = 1048576 // 1 MB in Bytes

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError('')

    if (!file) {
      return
    }

    // Prüfe Dateigröße
    if (file.size > MAX_FILE_SIZE) {
      setError(
        'Das Bild ist zu groß. Bitte wähle ein Bild unter 1 MB. ' +
        'Du kannst es z.B. unter squoosh.app verkleinern.'
      )
      e.target.value = '' // Reset input
      return
    }

    // Prüfe Dateityp
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Bitte wähle ein Bild im Format JPG, PNG oder WebP.')
      e.target.value = ''
      return
    }

    // Vorschau erstellen
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onImageSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setError('')
    onImageSelect(null)
  }

  return (
    <div className="space-y-3">
      {!preview ? (
        <div className="rounded-[16px] border border-dashed border-[var(--app-ios-line)] bg-white p-4 md:p-5">
          <label className="btn-secondary inline-flex cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            Bild hinzufügen
          </label>
          <p className="mt-3 text-[12px] text-[#6e6e73]">
            Optional • JPG, PNG oder WebP • Max. 1 MB
          </p>
        </div>
      ) : (
        <div className="space-y-3 rounded-[16px] border border-[var(--app-ios-line)] bg-white p-4 md:p-5">
          <div className="relative inline-block overflow-hidden rounded-[14px]">
            <Image
              src={preview}
              alt="Vorschau"
              width={120}
              height={120}
              className="h-[120px] w-[120px] object-cover border border-[#d2d2d7]"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-[14px] font-medium text-[#ff3b30] transition-colors hover:text-[#ff2d1f]"
          >
            Bild entfernen
          </button>
        </div>
      )}

      {error && (
        <div className="bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30] px-4 py-3 rounded-xl text-[14px]">
          {error}
        </div>
      )}
    </div>
  )
}
