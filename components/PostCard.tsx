import Image from 'next/image'
import CommunityBadge from './CommunityBadge'
import { formatDate } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface PostCardProps {
  title: string
  description: string
  type: 'angebot' | 'gesuch' | 'tausch'
  category: string
  offer?: string | null
  seek?: string | null
  community: CommunityId
  contactName: string
  contactInfo: string
  expiresAt: string
  createdAt: string
  imageUrl?: string | null
}

export default function PostCard({
  title,
  description,
  type,
  category,
  offer,
  seek,
  community,
  contactName,
  contactInfo,
  expiresAt,
  createdAt,
  imageUrl
}: PostCardProps) {
  const typeStyles = {
    'angebot': { bg: 'bg-[#e8f5e9]', text: 'text-[#166534]', label: 'Angebot' },
    'gesuch': { bg: 'bg-[#e8f0fe]', text: 'text-[#1a56db]', label: 'Gesuch' },
    'tausch': { bg: 'bg-[#f3e8ff]', text: 'text-[#7c3aed]', label: 'Tauschangebot' }
  }
  return (
    <div className="card overflow-hidden p-0">
      {imageUrl && (
        <div className="relative w-full h-[180px] bg-[#f5f5f7]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-3">
        <CommunityBadge community={community} size="sm" />
        <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${typeStyles[type].bg} ${typeStyles[type].text}`}>
          {typeStyles[type].label}
        </span>
        <span className="text-[12px] px-3 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] font-medium">
          {category}
        </span>
      </div>

      <h3 className="text-[20px] font-medium mb-2 text-[#1d1d1f]">{title}</h3>
      <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-4 line-clamp-3">{description}</p>

      {/* Tausch-spezifische Felder */}
      {type === 'tausch' && (offer || seek) && (
        <div className="bg-[#f5f5f7] rounded-xl p-4 mb-4 space-y-2">
          {offer && (
            <div>
              <span className="text-[14px] font-medium text-[#1d1d1f]">Ich biete:</span>
              <p className="text-[14px] text-[#6e6e73] mt-1">{offer}</p>
            </div>
          )}
          {seek && (
            <div>
              <span className="text-[14px] font-medium text-[#1d1d1f]">Ich suche:</span>
              <p className="text-[14px] text-[#6e6e73] mt-1">{seek}</p>
            </div>
          )}
        </div>
      )}

        <div className="border-t border-[#d2d2d7] pt-4 mt-4 space-y-1">
          <p className="text-[14px] text-[#1d1d1f]">
            <span className="font-medium">Kontakt:</span> {contactName}
          </p>
          <p className="text-[14px] text-[#6e6e73]">{contactInfo}</p>
          <p className="text-[12px] text-[#6e6e73] mt-2">
            Erstellt: {formatDate(createdAt)} • Gültig bis: {formatDate(expiresAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
