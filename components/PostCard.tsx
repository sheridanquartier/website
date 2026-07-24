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
    'tausch': { bg: 'bg-[#f7ecdf]', text: 'text-[#a85f1f]', label: 'Tauschangebot' }
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
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] ${typeStyles[type].bg} ${typeStyles[type].text}`}>
            {typeStyles[type].label}
          </span>
          <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6e6e73]">
            {category}
          </span>
        </div>

        <h3 className="mb-2 text-[21px] font-medium leading-[1.25] text-[#1d1d1f] md:text-[22px]">{title}</h3>
        <p className="mb-4 text-[15px] leading-[1.65] text-[#6e6e73] md:text-[16px] line-clamp-3">{description}</p>

        {type === 'tausch' && (offer || seek) && (
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
