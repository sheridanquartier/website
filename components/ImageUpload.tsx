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
        <div>
          <label className="btn-secondary cursor-pointer inline-flex">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            Bild hinzufügen
          </label>
          <p className="text-[12px] text-[#6e6e73] mt-2">
            Optional • JPG, PNG oder WebP • Max. 1 MB
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative inline-block">
            <Image
              src={preview}
              alt="Vorschau"
              width={120}
              height={120}
              className="w-[120px] h-[120px] object-cover rounded-lg border border-[#d2d2d7]"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-[14px] text-[#ff3b30] hover:text-[#ff2d1f] transition-colors"
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
