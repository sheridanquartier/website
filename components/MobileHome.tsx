import Image from 'next/image'
import Link from 'next/link'
import AppIcon from '@/components/AppIcon'
import CommunityBadge from '@/components/CommunityBadge'
import { formatDate } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  published_at: string
  community: CommunityId
}

interface MobileHomeProps {
  posts: BlogPost[]
  isLoggedIn: boolean
}

const projects = [
  {
    name: 'Sheridan Park & Junia',
    image: '/images/SheridanParkUndJunia/Parkansicht.jpg',
    href: '/projekte/sheridan-junia',
    meta: '32 Wohnungen',
  },
  {
    name: 'wagnisSHARE',
    image: '/images/Wagnis/csm_Wagnisshare_Rendering_c_binderholz_cc05340f5b.jpg',
    href: '/projekte/wagnisshare',
    meta: '46 Wohnungen',
  },
  {
    name: 'WOGENAU',
    image: '/images/Wogenau/modell_wogenau_2024_foto_c_.jpg.webp',
    href: '/projekte/wogenau',
    meta: '55 Wohnungen',
  },
]

const quickLinks = [
  { href: '/quartier', label: 'Karte', icon: 'map' as const, tone: 'sage' },
  { href: '/neuigkeiten', label: 'Aktuell', icon: 'news' as const, tone: 'clay' },
  { href: '#projekte', label: 'Projekte', icon: 'projects' as const, tone: 'sand' },
  { href: '/login', label: 'Intern', icon: 'lock' as const, tone: 'forest' },
]

export default function MobileHome({ posts, isLoggedIn }: MobileHomeProps) {
  const featuredPost = posts[0]
  const morePosts = posts.slice(1, 3)
  const internalHref = isLoggedIn ? '/intern/dashboard' : '/login'

  return (
    <div className="app-screen md:hidden">
      <section className="px-4 pt-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[13px] font-medium text-[var(--app-ios-muted)]">
              Willkommen
            </p>
            <h1 className="mb-0 font-sans text-[32px] font-bold leading-[1.06] tracking-[-0.045em]">
              Schön, dass du da bist.
            </h1>
          </div>
          <span className="mb-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-[var(--app-ios-muted)]">
            <span className="h-2 w-2 rounded-full bg-[#34c759]" />
            3 Häuser
          </span>
        </div>

        <Link href="/quartier" className="app-hero group">
          <Image
            src="/images/Aufmacher.jpg"
            alt="Sheridan Quartier im Sheridanpark Augsburg"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-active:scale-[1.02]"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,38,31,0.02)_18%,rgba(15,38,31,0.2)_52%,rgba(15,38,31,0.88)_100%)]" />
          <div className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1.5 text-[10px] font-medium tracking-[0.04em] text-white backdrop-blur-xl">
            Sheridanpark · Augsburg
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
            <div>
              <p className="mb-1 text-[12px] font-semibold text-white/[0.72]">Drei Gemeinschaften</p>
              <h2 className="mb-0 max-w-[10ch] font-sans text-[29px] font-bold leading-[1.03] tracking-[-0.045em] text-white">
                Ein Quartier, das verbindet.
              </h2>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/95 text-[var(--app-ios-accent)]">
              <AppIcon name="arrow" className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </section>

      <section className="mt-6 px-4">
        <div className="grid grid-cols-4 gap-2.5">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              href={item.label === 'Intern' ? internalHref : item.href}
              className={`app-quick-action app-quick-${item.tone}`}
            >
              <span className="app-quick-icon">
                <AppIcon name={item.icon} className="h-[22px] w-[22px]" />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {featuredPost && (
        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between px-4">
            <div>
              <p className="app-kicker">Gerade im Quartier</p>
              <h2 className="app-section-title">Neu & wissenswert</h2>
            </div>
            <Link href="/neuigkeiten" className="app-circle-link" aria-label="Alle Neuigkeiten">
              <AppIcon name="arrow" className="h-[18px] w-[18px]" />
            </Link>
          </div>

          <div className="px-4">
            <Link href={`/neuigkeiten/${featuredPost.slug}`} className="app-news-feature">
              {featuredPost.image_url ? (
                <div className="relative h-[190px] overflow-hidden">
                  <Image
                    src={featuredPost.image_url}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-[150px] bg-[linear-gradient(135deg,#d9e6dc,#f2dfc8)]" />
              )}
              <div className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CommunityBadge community={featuredPost.community} size="sm" />
                  <span className="text-[11px] font-medium text-[var(--muted)]">
                    {formatDate(featuredPost.published_at)}
                  </span>
                </div>
                <h3 className="mb-2 font-sans text-[21px] font-bold leading-[1.18] tracking-[-0.03em]">
                  {featuredPost.title}
                </h3>
                {featuredPost.excerpt && (
                  <p className="mb-0 line-clamp-2 text-[14px] leading-[1.55] text-[var(--muted)]">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>
            </Link>

            {morePosts.length > 0 && (
              <div className="app-group mt-2">
                {morePosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/neuigkeiten/${post.slug}`}
                    className="app-list-row !min-h-[82px] !px-3.5"
                  >
                    <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[14px] bg-[#e5e5ea]">
                      {post.image_url && (
                        <Image src={post.image_url} alt="" fill sizes="66px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[10px] font-medium text-[var(--app-ios-accent)]">
                        {formatDate(post.published_at)}
                      </div>
                      <div className="line-clamp-2 text-[14px] font-semibold leading-[1.35] tracking-[-0.015em]">
                        {post.title}
                      </div>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-[#c7c7cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="projekte" className="mt-10 scroll-mt-24">
        <div className="mb-4 px-4">
          <p className="app-kicker">Unsere Nachbarschaft</p>
          <h2 className="app-section-title">Drei Projekte. Drei Charaktere.</h2>
        </div>
        <div className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="relative h-[250px] w-[78vw] max-w-[330px] shrink-0 snap-center overflow-hidden rounded-[22px] bg-[#dce5dd] shadow-[0_3px_14px_rgba(20,24,23,0.08)]"
            >
              <Image src={project.image} alt={project.name} fill sizes="78vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(14,34,28,0.85)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/[0.68]">
                  {project.meta}
                </div>
                <div className="text-[22px] font-bold leading-[1.1] tracking-[-0.03em]">
                  {project.name}
                </div>
              </div>
            </Link>
          ))}
          <div className="w-1 shrink-0" aria-hidden="true" />
        </div>
      </section>

      <section className="app-group mx-4 mt-10 px-5 py-6">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[13px] bg-[var(--app-ios-accent-soft)] text-[var(--app-ios-accent)]">
          <AppIcon name="people" className="h-6 w-6" />
        </div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--app-ios-muted)]">
          Für Bewohnerinnen & Bewohner
        </p>
        <h2 className="mb-3 max-w-[12ch] font-sans text-[27px] font-bold leading-[1.08] tracking-[-0.04em]">
          Organisieren, teilen, füreinander da sein.
        </h2>
        <p className="mb-5 text-[14px] leading-[1.65] text-[var(--app-ios-muted)]">
          Gemeinschaftsflächen, Termine, Schwarzes Brett, Verleihpool und Skillpool liegen im internen Bereich direkt beieinander.
        </p>
        <Link href={internalHref} className="flex min-h-[50px] items-center justify-between rounded-[14px] bg-[var(--app-ios-accent)] px-4 text-[14px] font-semibold text-white">
          <span>{isLoggedIn ? 'Mein Quartier öffnen' : 'Intern anmelden'}</span>
          <AppIcon name="arrow" className="h-5 w-5" />
        </Link>
      </section>

      <div className="mt-10 flex items-center justify-center gap-5 px-4 pb-5 text-[11px] font-medium text-[var(--muted)]">
        <Link href="/impressum">Impressum</Link>
        <span className="h-1 w-1 rounded-full bg-[#aab2ad]" />
        <Link href="/datenschutz">Datenschutz</Link>
        <span className="h-1 w-1 rounded-full bg-[#aab2ad]" />
        <Link href="/admin/login">Admin</Link>
      </div>
    </div>
  )
}
