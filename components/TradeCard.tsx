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
    'tausch': 'bg-[#f7ecdf] text-[#a85f1f]',
    'skill-angebot': 'bg-[#e8f5e9] text-[#166534]',
    'skill-gesuch': 'bg-[#e8f0fe] text-[#1a56db]'
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--app-ios-line)] bg-white p-0 shadow-[0_1px_2px_rgba(15,23,20,0.04)]">
      {imageUrl && (
        <div className="relative h-[170px] w-full bg-[#f5f5f7] md:h-[180px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <CommunityBadge community={community} size="sm" />
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] ${typeStyles[type]}`}>
            {typeLabels[type]}
          </span>
        </div>

        <h3 className="mb-2 text-[20px] font-semibold leading-[1.25] text-[#1d1d1f] md:text-[22px]">{title}</h3>
        <p className="mb-4 text-[15px] leading-[1.65] text-[#6e6e73] md:text-[16px] line-clamp-3">{description}</p>

        {(offer || seek) && (
          <div className="mb-4 space-y-3 rounded-[16px] bg-[#f2f2f7] p-4">
            {offer && (
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1d1d1f]">Ich biete</span>
                <p className="mt-1 mb-0 text-[14px] leading-[1.6] text-[#6e6e73]">{offer}</p>
              </div>
            )}
            {seek && (
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1d1d1f]">Ich suche</span>
                <p className="mt-1 mb-0 text-[14px] leading-[1.6] text-[#6e6e73]">{seek}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 border-t border-[var(--app-ios-line)] pt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="mb-0 text-[14px] text-[#1d1d1f]">
              <span className="font-medium">Kontakt:</span> {contactName}
            </p>
            <span className="text-[12px] text-[#8b7b6c]">{formatDate(createdAt)}</span>
          </div>
          <p className="mb-1 text-[14px] text-[#6e6e73]">{contactInfo}</p>
          <p className="mb-0 text-[12px] text-[#6e6e73]">
            Gültig bis {formatDate(expiresAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
