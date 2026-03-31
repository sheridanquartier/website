import Image from 'next/image'
import CommunityBadge from './CommunityBadge'
import { formatDate } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface TradeCardProps {
  title: string
  description: string
  type: 'tausch' | 'skill-angebot' | 'skill-gesuch'
  offer?: string
  seek?: string
  imageUrl?: string | null
  community: CommunityId
  contactName: string
  contactInfo: string
  expiresAt: string
  createdAt: string
}

export default function TradeCard({
  title,
  description,
  type,
  offer,
  seek,
  imageUrl,
  community,
  contactName,
  contactInfo,
  expiresAt,
  createdAt
}: TradeCardProps) {
  const typeLabels = {
    'tausch': 'Tausch',
    'skill-angebot': 'Skill-Angebot',
    'skill-gesuch': 'Skill-Gesuch'
  }

  const typeStyles = {
    'tausch': 'bg-[#f3e8ff] text-[#7c3aed]',
    'skill-angebot': 'bg-[#e8f5e9] text-[#166534]',
    'skill-gesuch': 'bg-[#e8f0fe] text-[#1a56db]'
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
          <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${typeStyles[type]}`}>
            {typeLabels[type]}
          </span>
        </div>

        <h3 className="text-[20px] font-medium mb-2 text-[#1d1d1f]">{title}</h3>
        <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-4">{description}</p>

      {(offer || seek) && (
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
