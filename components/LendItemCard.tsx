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
    <div className="card overflow-hidden p-0">
      {imageUrl && (
        <div className="relative w-full h-[180px] bg-[#f5f5f7]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            <CommunityBadge community={community} size="sm" />
            <span className="text-[12px] px-3 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] font-medium">
              {categoryLabels[category]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${available ? 'bg-[#34c759]' : 'bg-[#8e8e93]'}`} />
            <span className="text-[12px] text-[#6e6e73]">
              {available ? 'Verfügbar' : 'Vergeben'}
            </span>
          </div>
        </div>

        <h3 className="text-[20px] font-medium mb-2 text-[#1d1d1f]">{name}</h3>

        {description && (
          <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {contact && available && (
          <div className="border-t border-[#d2d2d7] pt-4 mt-4">
            <p className="text-[14px] text-[#1d1d1f]">
              <span className="font-medium">Kontakt:</span> {contact}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
