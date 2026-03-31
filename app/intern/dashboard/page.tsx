import Link from 'next/link'
import CommunityBadge from '@/components/CommunityBadge'
import EventCard from '@/components/EventCard'
import { createClient } from '@/lib/supabase/server'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'
import { formatDate } from '@/lib/utils/dateFormat'

export const revalidate = 0

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
  description?: string | null
  location?: string | null
  starts_at: string
  ends_at?: string | null
  community: CommunityId
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  published_at?: string | null
  community: CommunityId
}

interface LendItem {
  id: string
}

const typeLabels: Record<BoardPost['type'], string> = {
  angebot: 'Angebot',
  gesuch: 'Gesuch',
  tausch: 'Tauschangebot',
}

export default async function InternDashboardPage() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [
    recentPostsResult,
    upcomingEventsResult,
    recentStoriesResult,
    activePostsCountResult,
    upcomingEventsCountResult,
    lendItemsCountResult,
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, description, type, category, community, created_at, expires_at')
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('events')
      .select('id, title, description, location, starts_at, ends_at, community')
      .gte('starts_at', now)
      .order('starts_at', { ascending: true })
      .limit(3),
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published_at, community')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(2),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .gt('expires_at', now),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', now),
    supabase
      .from('lend_items')
      .select('id', { count: 'exact', head: true }),
  ])

  const recentPosts = (recentPostsResult.data || []) as BoardPost[]
  const upcomingEvents = (upcomingEventsResult.data || []) as EventItem[]
  const recentStories = (recentStoriesResult.data || []) as BlogPost[]

  const activePostsCount = activePostsCountResult.count || 0
  const upcomingEventsCount = upcomingEventsCountResult.count || 0
  const lendItemsCount = lendItemsCountResult.count || 0
  const activeCommunityIds = Array.from(
    new Set([
      ...recentPosts.map((post) => post.community),
      ...upcomingEvents.map((event) => event.community),
      ...recentStories.map((story) => story.community),
    ])
  )

  const quickActions = [
    {
      href: '/intern/schwarzes-brett',
      eyebrow: 'Schnell erledigt',
      title: 'Etwas anbieten, suchen oder zum Tausch einstellen',
      description: 'Der direkteste Einstieg in den Alltag des Quartiers.',
    },
    {
      href: '/intern/kalender',
      eyebrow: 'Im Blick behalten',
      title: 'Nächste Termine und gemeinsame Anlässe prüfen',
      description: 'Sehen, was ansteht und wo Begegnung gerade stattfindet.',
    },
    {
      href: '/intern/verleihpool',
      eyebrow: 'Praktisch helfen',
      title: 'Werkzeuge und Geräte teilen statt doppelt anschaffen',
      description: 'Schnell nachsehen, was bereits im Quartier verfügbar ist.',
    },
  ]

  const serviceLinks = [
    {
      href: '/intern/schwarzes-brett',
      title: 'Schwarzes Brett',
      description: 'Angebote, Gesuche und Tauschangebote aus der Nachbarschaft',
    },
    {
      href: '/intern/skills',
      title: 'Skills',
      description: 'Fähigkeiten teilen und voneinander lernen',
    },
    {
      href: '/intern/verleihpool',
      title: 'Verleihpool',
      description: 'Werkzeuge und Geräte ausleihen',
    },
    {
      href: '/intern/kalender',
      title: 'Kalender',
      description: 'Alle Termine und Events im Überblick',
    },
    {
      href: '/intern/raumbuchungen',
      title: 'Raumbuchungen',
      description: 'Gemeinschaftsraum und Gästeappartement buchen',
    },
  ]

  return (
    <div className="pt-28 pb-20">
      <section className="section bg-white">
        <div className="container-custom">
          <div className="editorial-panel relative overflow-hidden px-6 py-7 md:px-10 md:py-10">
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <span className="eyebrow mb-5">Interner Bereich</span>
                <h1 className="mb-5 max-w-[14ch]">Gut ankommen. Schnell etwas erledigen. Sehen, was im Quartier läuft.</h1>
                <p className="max-w-[620px] text-[18px] leading-[1.75] text-[var(--muted)]">
                  Das Dashboard ist Ihr Einstieg in den Alltag der Gemeinschaften:
                  Dinge teilen, Hilfe finden, Termine sehen und ein Gefühl dafür bekommen,
                  was gerade im Quartier in Bewegung ist.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-4">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">{activePostsCount}</div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[#786f64]">Aktive Brett-Einträge</div>
                  </div>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-4">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">{upcomingEventsCount}</div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[#786f64]">Kommende Termine</div>
                  </div>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-4">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">{lendItemsCount}</div>
                    <div className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[#786f64]">Dinge im Verleihpool</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-[var(--line)] bg-[linear-gradient(165deg,#1f4d43_0%,#2b6957_100%)] p-6 text-white shadow-[0_26px_60px_rgba(38,82,62,0.18)]">
                <div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d7ebdf]">
                  Was möchten Sie heute tun?
                </div>
                <div className="space-y-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="block rounded-[24px] border border-white/10 bg-white/8 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/12"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c7ded2]">
                        {action.eyebrow}
                      </div>
                      <div className="mt-2 text-[22px] leading-[1.2] text-white">{action.title}</div>
                      <p className="mb-0 mt-3 text-[15px] leading-[1.65] text-[#e1eee7]">{action.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="editorial-panel p-6 md:p-8">
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span className="eyebrow mb-4">Soziale Orientierung</span>
                  <h2 className="mb-2 text-[32px]">Gerade auf dem Brett</h2>
                  <p className="mb-0 text-[16px] text-[#665f56]">
                    Die neuesten Angebote, Gesuche und Tauschangebote aus den Gemeinschaften.
                  </p>
                </div>
                <Link href="/intern/schwarzes-brett" className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#b85c38] hover:text-[#9d482a]">
                  Alles ansehen
                </Link>
              </div>

              {recentPosts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 px-6 py-10 text-center">
                  <p className="mb-0 text-[16px] text-[#665f56]">
                    Noch keine aktiven Einträge. Der erste Anlass für Nachbarschaft kann hier starten.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href="/intern/schwarzes-brett"
                      className="block rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d99058]/40"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <CommunityBadge community={post.community} size="sm" />
                        <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-medium text-[#6e6e73]">
                          {typeLabels[post.type]}
                        </span>
                        <span className="rounded-full bg-[#f5f5f7] px-3 py-1 text-[12px] font-medium text-[#6e6e73]">
                          {post.category}
                        </span>
                        <span className="text-[12px] text-[#8b7b6c]">{formatDate(post.created_at)}</span>
                      </div>
                      <h3 className="mb-2 text-[24px] leading-[1.2]">{post.title}</h3>
                      <p className="mb-0 text-[15px] leading-[1.7] text-[#665f56] line-clamp-2">{post.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <div className="space-y-8">
              <section className="editorial-panel p-6 md:p-8">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <span className="eyebrow mb-4">Gemeinsam unterwegs</span>
                    <h2 className="mb-2 text-[32px]">Nächste Termine</h2>
                  </div>
                  <Link href="/intern/kalender" className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#b85c38] hover:text-[#9d482a]">
                    Zum Kalender
                  </Link>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 px-6 py-8">
                    <p className="mb-0 text-[16px] text-[#665f56]">
                      Im Moment sind keine kommenden Termine eingetragen.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        title={event.title}
                        description={event.description || undefined}
                        location={event.location || undefined}
                        startsAt={event.starts_at}
                        endsAt={event.ends_at || undefined}
                        community={event.community}
                        compact
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="editorial-panel p-6 md:p-8">
                <span className="eyebrow mb-4">Im Quartier sichtbar</span>
                <h2 className="mb-4 text-[32px]">Aus den Gemeinschaften</h2>
                <p className="mb-6 text-[16px] text-[#665f56]">
                  Aktivität aus {activeCommunityIds.length || 0} von {Object.keys(COMMUNITIES).length} Gemeinschaften ist auf dem Dashboard sichtbar.
                </p>

                <div className="flex flex-wrap gap-3">
                  {activeCommunityIds.length === 0 ? (
                    <span className="text-[15px] text-[#665f56]">Sobald neue Einträge oder Termine da sind, erscheinen sie hier.</span>
                  ) : (
                    activeCommunityIds.map((communityId) => (
                      <CommunityBadge key={communityId} community={communityId} />
                    ))
                  )}
                </div>

                {recentStories.length > 0 && (
                  <div className="mt-8 space-y-4 border-t border-[var(--line)] pt-6">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                      Neu zu lesen
                    </div>
                    {recentStories.map((story) => (
                      <Link key={story.id} href={`/neuigkeiten/${story.slug}`} className="block rounded-[20px] bg-white/70 px-5 py-4 hover:bg-white">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <CommunityBadge community={story.community} size="sm" />
                          {story.published_at && (
                            <span className="text-[12px] text-[#8b7b6c]">{formatDate(story.published_at)}</span>
                          )}
                        </div>
                        <div className="text-[19px] font-medium leading-[1.3] text-[var(--ink)]">{story.title}</div>
                        {story.excerpt && (
                          <p className="mb-0 mt-2 text-[14px] leading-[1.65] text-[#665f56] line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          <section className="mt-12">
            <div className="mb-6">
              <span className="eyebrow mb-4">Alles an einem Ort</span>
              <h2 className="mb-2 text-[32px]">Wichtige Bereiche</h2>
              <p className="mb-0 text-[16px] text-[#665f56]">
                Wenn Sie etwas Bestimmtes erledigen möchten, kommen Sie von hier direkt in die passenden Bereiche.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[26px] border border-[var(--line)] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(38,82,62,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d99058]/36"
                >
                  <h3 className="mb-2 text-[22px] leading-[1.2]">{item.title}</h3>
                  <p className="mb-0 text-[14px] leading-[1.65] text-[#665f56]">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
