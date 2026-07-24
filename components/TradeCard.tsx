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
    <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(251,248,241,0.98)_0%,rgba(247,241,232,0.94)_100%)] p-0 shadow-[0_18px_42px_rgba(38,82,62,0.08)]">
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
      <div className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <CommunityBadge community={community} size="sm" />
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] ${typeStyles[type]}`}>
            {typeLabels[type]}
          </span>
        </div>

        <h3 className="mb-2 text-[21px] font-medium leading-[1.25] text-[#1d1d1f] md:text-[22px]">{title}</h3>
        <p className="mb-4 text-[15px] leading-[1.65] text-[#6e6e73] md:text-[16px] line-clamp-3">{description}</p>

        {(offer || seek) && (
          <div className="mb-4 rounded-[20px] bg-[rgba(31,77,67,0.05)] p-4 space-y-3">
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

        <div className="mt-4 border-t border-[#d2d2d7] pt-4">
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
