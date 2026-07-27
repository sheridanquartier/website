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
      <div className="rounded-[20px] border border-[var(--app-ios-line)] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,20,0.04)] md:p-5">
        <div className="flex items-start gap-4">
          <div className="min-w-[60px] shrink-0 rounded-[16px] bg-[var(--app-ios-accent-soft)] px-2 py-3 text-center">
            <div className="text-[26px] font-semibold leading-none text-[var(--app-ios-accent)]">
              {formatDate(startsAt, 'dd')}
            </div>
            <div className="mt-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#6e6e73]">
              {formatDate(startsAt, 'MMM')}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="text-[17px] font-semibold leading-[1.35] text-[#1d1d1f]">{title}</h4>
              <CommunityBadge community={community} size="sm" />
            </div>
            <p className="mb-1 text-[14px] text-[#6e6e73]">
              {formatTime(startsAt)} Uhr
              {endsAt && ` - ${formatTime(endsAt)} Uhr`}
            </p>
            {location && (
              <p className="mb-0 text-[14px] text-[#6e6e73]">{location}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[22px] border border-[var(--app-ios-line)] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,20,0.04)] md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3 flex-wrap">
        <CommunityBadge community={community} />
        <div className="rounded-[14px] bg-[var(--app-ios-accent-soft)] px-3 py-2 text-right">
          <div className="text-[16px] font-semibold text-[var(--app-ios-accent)]">
            {formatDate(startsAt, 'dd.MM.yyyy')}
          </div>
          <div className="text-[13px] text-[#6e6e73]">
            {formatTime(startsAt)}
            {endsAt && ` - ${formatTime(endsAt)}`} Uhr
          </div>
        </div>
      </div>

      <h3 className="mb-2 text-[21px] font-semibold leading-[1.3] text-[#1d1d1f] md:text-[22px]">{title}</h3>

      {description && (
        <p className="mb-3 text-[15px] leading-[1.7] text-[#6e6e73] md:text-[16px]">{description}</p>
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
