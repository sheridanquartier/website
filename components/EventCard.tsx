import CommunityBadge from './CommunityBadge'
import { formatDate, formatTime } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface EventCardProps {
  title: string
  description?: string
  location?: string
  startsAt: string
  endsAt?: string
  community: CommunityId
  compact?: boolean
}

export default function EventCard({
  title,
  description,
  location,
  startsAt,
  endsAt,
  community,
  compact = false
}: EventCardProps) {
  if (compact) {
    return (
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="text-center min-w-[60px] flex-shrink-0">
            <div className="text-[28px] font-semibold text-[#0071e3] leading-none">
              {formatDate(startsAt, 'dd')}
            </div>
            <div className="text-[14px] text-[#6e6e73] mt-1">
              {formatDate(startsAt, 'MMM')}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-medium text-[17px] text-[#1d1d1f]">{title}</h4>
              <CommunityBadge community={community} size="sm" />
            </div>
            <p className="text-[14px] text-[#6e6e73]">
              {formatTime(startsAt)} Uhr
              {endsAt && ` - ${formatTime(endsAt)} Uhr`}
            </p>
            {location && (
              <p className="text-[14px] text-[#6e6e73]">{location}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <CommunityBadge community={community} />
        <div className="text-right">
          <div className="font-medium text-[#0071e3] text-[17px]">
            {formatDate(startsAt, 'dd.MM.yyyy')}
          </div>
          <div className="text-[14px] text-[#6e6e73]">
            {formatTime(startsAt)}
            {endsAt && ` - ${formatTime(endsAt)}`} Uhr
          </div>
        </div>
      </div>

      <h3 className="text-[20px] font-medium mb-2 text-[#1d1d1f]">{title}</h3>

      {description && (
        <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-3">{description}</p>
      )}

      {location && (
        <div className="flex items-center gap-2 text-[14px] text-[#6e6e73]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
      )}
    </div>
  )
}
