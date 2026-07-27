import Link from 'next/link'
import AppIcon from '@/components/AppIcon'
import CommunityBadge from '@/components/CommunityBadge'
import { formatDate } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface BoardPost {
  id: string
  title: string
  description: string
  type: 'angebot' | 'gesuch' | 'tausch'
  category: string
  community: CommunityId
  created_at: string
  expires_at: string
}

interface EventItem {
  id: string
  title: string
  location?: string | null
  starts_at: string
  community: CommunityId
}

interface MobileInternalDashboardProps {
  activePostsCount: number
  upcomingEventsCount: number
  lendItemsCount: number
  recentPosts: BoardPost[]
  upcomingEvents: EventItem[]
}

const actions = [
  {
    href: '/intern/raumbuchungen',
    label: 'Gemeinschaftsflächen',
    hint: 'Alle geteilten Räume und Flächen im Überblick',
    icon: 'rooms' as const,
  },
  {
    href: '/intern/kalender',
    label: 'Termine',
    hint: 'Sehen, was ansteht',
    icon: 'calendar' as const,
  },
  {
    href: '/intern/schwarzes-brett',
    label: 'Suchen, anbieten, tauschen',
    hint: 'Das Schwarze Brett',
    icon: 'board' as const,
  },
  {
    href: '/intern/verleihpool',
    label: 'Verleihpool',
    hint: 'Dinge gemeinsam nutzen',
    icon: 'lend' as const,
  },
  {
    href: '/intern/skills',
    label: 'Skillpool',
    hint: 'Wissen teilen und finden',
    icon: 'skills' as const,
  },
]

const typeLabels: Record<BoardPost['type'], string> = {
  angebot: 'Angebot',
  gesuch: 'Gesuch',
  tausch: 'Tausch',
}

export default function MobileInternalDashboard({
  activePostsCount,
  upcomingEventsCount,
  lendItemsCount,
  recentPosts,
  upcomingEvents,
}: MobileInternalDashboardProps) {
  const nextEvent = upcomingEvents[0]

  return (
    <div className="app-screen md:hidden">
      <section className="px-4 pt-6">
        <p className="mb-1 text-[15px] font-medium text-[var(--app-ios-muted)]">Guten Tag</p>
        <h1 className="mb-2 font-sans text-[34px] font-bold leading-[1.04] tracking-[-0.045em]">
          Mein Quartier
        </h1>
        <p className="mb-0 text-[14px] leading-[1.55] text-[var(--muted)]">
          Räume, Termine und Nachbarschaft an einem Ort.
        </p>
      </section>

      <section className="mt-7 px-4">
        <p className="app-kicker mb-2.5 pl-1">Direkt loslegen</p>
        <div className="app-group">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="app-list-row"
            >
              <span className="app-list-icon">
                <AppIcon name={action.icon} className="h-[21px] w-[21px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-[1.2] tracking-[-0.015em]">
                  {action.label}
                </span>
                <span className="mt-1 block truncate text-[12px] leading-[1.3] text-[var(--app-ios-muted)]">
                  {action.hint}
                </span>
              </span>
              <AppIcon name="chevron" className="h-[17px] w-[17px] shrink-0 -rotate-90 text-[#c7c7cc]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-4">
        <p className="app-kicker mb-2.5 pl-1">Heute im Blick</p>
        <div className="app-group grid grid-cols-3 divide-x divide-[var(--app-ios-line)] py-4">
          {[
            [activePostsCount, 'am Brett'],
            [upcomingEventsCount, 'Termine'],
            [lendItemsCount, 'im Verleih'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-[22px] font-semibold leading-none tracking-[-0.035em] text-[var(--app-ios-ink)]">{value}</div>
              <div className="mt-1.5 text-[10px] font-medium text-[var(--app-ios-muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {nextEvent && (
        <section className="mt-8 px-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="app-kicker">Als Nächstes</p>
              <h2 className="app-section-title">Im Kalender</h2>
            </div>
            <Link href="/intern/kalender" className="text-[14px] font-medium text-[var(--app-ios-accent)]">Alle</Link>
          </div>
          <Link href="/intern/kalender" className="app-group flex items-center gap-4 p-4">
            <div className="flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center rounded-[16px] bg-[var(--app-ios-accent-soft)] text-[var(--app-ios-accent)]">
              <span className="text-[22px] font-semibold leading-none">{formatDate(nextEvent.starts_at, 'dd')}</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em]">
                {formatDate(nextEvent.starts_at, 'MMM')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <CommunityBadge community={nextEvent.community} size="sm" />
              <div className="mt-2 line-clamp-2 text-[16px] font-semibold leading-[1.25]">{nextEvent.title}</div>
              {nextEvent.location && <div className="mt-1 truncate text-[12px] text-[var(--app-ios-muted)]">{nextEvent.location}</div>}
            </div>
            <AppIcon name="chevron" className="h-4 w-4 shrink-0 -rotate-90 text-[#c7c7cc]" />
          </Link>
        </section>
      )}

      <section className="mt-8 px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="app-kicker">Nachbarschaft</p>
            <h2 className="app-section-title">Neu auf dem Brett</h2>
          </div>
          <Link href="/intern/schwarzes-brett" className="text-[14px] font-medium text-[var(--app-ios-accent)]">Alle</Link>
        </div>

        <div className="app-group">
          {recentPosts.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="mb-1 text-[15px] font-bold">Noch nichts eingetragen</p>
              <p className="mb-4 text-[13px] leading-[1.5] text-[var(--muted)]">Starte den ersten Austausch im Quartier.</p>
              <Link href="/intern/schwarzes-brett" className="text-[13px] font-semibold text-[var(--app-ios-accent)]">Suchen, anbieten oder tauschen</Link>
            </div>
          ) : (
            recentPosts.slice(0, 4).map((post) => (
              <Link key={post.id} href="/intern/schwarzes-brett" className="app-list-row">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--app-ios-accent-soft)] text-[var(--app-ios-accent)]">
                  <AppIcon name={post.type === 'tausch' ? 'people' : 'board'} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                    <span className="text-[var(--app-ios-accent)]">{typeLabels[post.type]}</span>
                    <span>·</span>
                    <span className="truncate">{post.category}</span>
                  </div>
                  <div className="mt-1 truncate text-[14px] font-semibold tracking-[-0.015em]">{post.title}</div>
                </div>
                <span className="text-[10px] font-medium text-[var(--muted)]">{formatDate(post.created_at)}</span>
              </Link>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
