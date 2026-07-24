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
    href: '/intern/schwarzes-brett',
    label: 'Eintrag erstellen',
    hint: 'Suchen, anbieten, tauschen',
    icon: 'plus' as const,
    tone: 'bg-[#dceadf] text-[#235847]',
  },
  {
    href: '/intern/kalender',
    label: 'Termine',
    hint: 'Sehen, was ansteht',
    icon: 'calendar' as const,
    tone: 'bg-[#f1dfd2] text-[#9b4e31]',
  },
  {
    href: '/intern/verleihpool',
    label: 'Verleihpool',
    hint: 'Dinge gemeinsam nutzen',
    icon: 'lend' as const,
    tone: 'bg-[#e5e7d4] text-[#536333]',
  },
  {
    href: '/intern/raumbuchungen',
    label: 'Räume buchen',
    hint: 'Gäste & Gemeinschaft',
    icon: 'rooms' as const,
    tone: 'bg-[#dce5ea] text-[#355b6c]',
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
      <section className="px-4 pt-4">
        <p className="app-kicker">Guten Tag</p>
        <h1 className="mb-2 max-w-[13ch] font-sans text-[30px] font-bold leading-[1.08] tracking-[-0.045em]">
          Was möchtest du heute erledigen?
        </h1>
        <p className="mb-0 text-[14px] leading-[1.55] text-[var(--muted)]">
          Alles Wichtige aus den drei Gemeinschaften an einem Ort.
        </p>
      </section>

      <section className="mt-6 px-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="app-action-tile">
              <span className={`flex h-11 w-11 items-center justify-center rounded-[16px] ${action.tone}`}>
                <AppIcon name={action.icon} className="h-[22px] w-[22px]" />
              </span>
              <span className="mt-5 block text-[15px] font-bold leading-[1.2] tracking-[-0.02em]">
                {action.label}
              </span>
              <span className="mt-1 block text-[11px] leading-[1.35] text-[var(--muted)]">
                {action.hint}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 px-4">
        <div className="grid grid-cols-3 divide-x divide-[var(--line)] rounded-[24px] bg-white/[0.78] py-4 shadow-[0_12px_30px_rgba(28,64,49,0.05)]">
          {[
            [activePostsCount, 'am Brett'],
            [upcomingEventsCount, 'Termine'],
            [lendItemsCount, 'im Verleih'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-[22px] font-bold leading-none tracking-[-0.04em] text-[#245245]">{value}</div>
              <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {nextEvent && (
        <section className="mt-9 px-4">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="app-kicker">Als Nächstes</p>
              <h2 className="app-section-title">Im Kalender</h2>
            </div>
            <Link href="/intern/kalender" className="text-[12px] font-bold text-[var(--accent)]">Alle</Link>
          </div>
          <Link href="/intern/kalender" className="flex items-center gap-4 rounded-[26px] bg-[#183f36] p-4 text-white shadow-[0_16px_34px_rgba(24,63,54,0.18)]">
            <div className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-[20px] bg-white/10">
              <span className="text-[22px] font-bold leading-none">{formatDate(nextEvent.starts_at, 'dd')}</span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#b9d7c8]">
                {formatDate(nextEvent.starts_at, 'MMM')}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <CommunityBadge community={nextEvent.community} size="sm" />
              <div className="mt-2 line-clamp-2 text-[16px] font-bold leading-[1.25]">{nextEvent.title}</div>
              {nextEvent.location && <div className="mt-1 truncate text-[12px] text-white/[0.65]">{nextEvent.location}</div>}
            </div>
            <svg className="h-4 w-4 shrink-0 text-white/[0.55]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      )}

      <section className="mt-9 px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="app-kicker">Nachbarschaft</p>
            <h2 className="app-section-title">Neu auf dem Brett</h2>
          </div>
          <Link href="/intern/schwarzes-brett" className="text-[12px] font-bold text-[var(--accent)]">Alle</Link>
        </div>

        <div className="overflow-hidden rounded-[26px] bg-white/[0.78] shadow-[0_14px_34px_rgba(28,64,49,0.05)]">
          {recentPosts.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="mb-1 text-[15px] font-bold">Noch nichts eingetragen</p>
              <p className="mb-4 text-[13px] leading-[1.5] text-[var(--muted)]">Starte den ersten Austausch im Quartier.</p>
              <Link href="/intern/schwarzes-brett" className="text-[13px] font-bold text-[var(--accent)]">Eintrag erstellen</Link>
            </div>
          ) : (
            recentPosts.slice(0, 4).map((post) => (
              <Link key={post.id} href="/intern/schwarzes-brett" className="flex items-center gap-3 border-b border-[var(--line)] p-4 last:border-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#e5eee7] text-[#245245]">
                  <AppIcon name={post.type === 'tausch' ? 'people' : 'board'} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                    <span className="text-[var(--accent)]">{typeLabels[post.type]}</span>
                    <span>·</span>
                    <span className="truncate">{post.category}</span>
                  </div>
                  <div className="mt-1 truncate text-[14px] font-bold tracking-[-0.015em]">{post.title}</div>
                </div>
                <span className="text-[10px] font-medium text-[var(--muted)]">{formatDate(post.created_at)}</span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mx-4 mt-9 rounded-[26px] border border-[var(--line)] bg-[#f2eadf] p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white/70 text-[#9b573b]">
            <AppIcon name="skills" className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[15px] font-bold">Wer kann was?</div>
            <p className="mb-3 mt-1 text-[13px] leading-[1.5] text-[var(--muted)]">
              Fähigkeiten im Quartier finden oder eigenes Wissen anbieten.
            </p>
            <Link href="/intern/skills" className="text-[12px] font-bold text-[#9b573b]">Skills entdecken</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
