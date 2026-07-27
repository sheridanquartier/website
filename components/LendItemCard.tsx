import Image from 'next/image'
import CommunityBadge from './CommunityBadge'
import type { CommunityId } from '@/lib/constants'

interface LendItemCardProps {
  name: string
  description?: string
  category: string
  imageUrl?: string | null
  community: CommunityId
  available: boolean
  contact?: string
}

const categoryLabels: Record<string, string> = {
  werkzeug: 'Werkzeug',
  garten: 'Garten',
  haushalt: 'Haushalt',
  freizeit: 'Freizeit',
  sonstiges: 'Sonstiges'
}

export default function LendItemCard({
  name,
  description,
  category,
  imageUrl,
  community,
  available,
  contact
}: LendItemCardProps) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--app-ios-line)] bg-white p-0 shadow-[0_1px_2px_rgba(15,23,20,0.04)]">
      {imageUrl && (
        <div className="relative h-[170px] w-full bg-[#f5f5f7] md:h-[180px]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <CommunityBadge community={community} size="sm" />
            <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6e6e73]">
              {categoryLabels[category]}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#f2f2f7] px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${available ? 'bg-[#34c759]' : 'bg-[#8e8e93]'}`} />
            <span className="text-[12px] font-medium text-[#6e6e73]">
              {available ? 'Verfügbar' : 'Vergeben'}
            </span>
          </div>
        </div>

        <h3 className="mb-2 text-[20px] font-semibold leading-[1.25] text-[#1d1d1f] md:text-[22px]">{name}</h3>

        {description && (
          <p className="mb-4 text-[15px] leading-[1.65] text-[#6e6e73] md:text-[16px] line-clamp-3">
            {description}
          </p>
        )}

        {contact && available && (
          <div className="mt-4 border-t border-[var(--app-ios-line)] pt-4">
            <p className="mb-0 text-[14px] text-[#1d1d1f]">
              <span className="font-medium">Kontakt:</span> {contact}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
