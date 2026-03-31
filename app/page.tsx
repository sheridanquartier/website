import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CommunityBadge from '@/components/CommunityBadge'
import { formatDate } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

export const revalidate = 60

const communities = [
  {
    id: 'sheridan-junia' as CommunityId,
    title: 'Sheridan Park & Junia',
    image: '/images/SheridanParkUndJunia/Parkansicht.jpg',
    stat: '32 Wohnungen',
    tone: 'Textile Gemeinschaft mit Holzbau, Werkstatt und gemeinsamen Räumen.',
    description:
      'Nachhaltiges Mehrgenerationenwohnen mit einer klaren Idee von Nachbarschaft: gemeinsam geplant, gemeinsam genutzt, gemeinsam getragen.',
    href: '/projekte/sheridan-junia',
  },
  {
    id: 'wagnisshare' as CommunityId,
    title: 'wagnisSHARE',
    image: '/images/Wagnis/csm_Wagnisshare_Rendering_c_binderholz_cc05340f5b.jpg',
    stat: '46 Wohnungen',
    tone: 'Genossenschaftliches Wohnen mit Dachgärten, Werkstatt und Gästeapartment.',
    description:
      'Das erste Projekt der wagnis eG außerhalb Münchens bringt urbane Genossenschaftskultur in das Quartier und ergänzt es um gemeinschaftliche Infrastruktur.',
    href: '/projekte/wagnisshare',
  },
  {
    id: 'wogenau' as CommunityId,
    title: 'WOGENAU',
    image: '/images/Wogenau/modell_wogenau_2024_foto_c_.jpg.webp',
    stat: '55 Wohnungen',
    tone: 'Genossenschaft aus Augsburg mit großen Gemeinschaftsflächen für das ganze Viertel.',
    description:
      'Ein Holzhaus mit Haltung: bezahlbar, gemeinschaftlich und offen gedacht, mit Räumen, die über das eigene Haus hinaus wirken sollen.',
    href: '/projekte/wogenau',
  },
]

const pathways = [
  {
    eyebrow: 'Orientieren',
    title: 'Das Quartier räumlich verstehen',
    description: 'Die Karte zeigt Projekte, Gästeappartements und Gemeinschaftsräume auf einen Blick.',
    href: '/quartier',
  },
  {
    eyebrow: 'Entdecken',
    title: 'Neuigkeiten und Entwicklungen verfolgen',
    description: 'Geschichten, Fortschritte und Einblicke aus den Häusern an einem Ort.',
    href: '#neuigkeiten',
  },
  {
    eyebrow: 'Mitmachen',
    title: 'In den internen Alltag einsteigen',
    description: 'Brett, Skills, Verleihpool und Kalender helfen beim gemeinsamen Organisieren.',
    href: '/login',
  },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at, community')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const featuredPost = blogPosts?.[0]
  const secondaryPosts = blogPosts?.slice(1) || []

  return (
    <div className="pt-16">
      <section className="section pb-14 md:pb-18">
        <div className="container-custom">
          <div className="section-shell">
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(380px,1.12fr)] xl:items-start">
              <div className="relative z-10 xl:pr-10">
                <span className="eyebrow mb-5">Augsburg · Sheridanpark · Gemeinsamer Alltag</span>
                <h1 className="max-w-[12ch] text-[clamp(2.35rem,3.8vw,4rem)] [text-wrap:balance]">
                  Aus drei Gemeinschaften wird ein Quartier.
                </h1>
                <p className="max-w-[620px] text-[18px] md:text-[19px] leading-[1.8] text-[var(--muted)]">
                  Sheridan Quartier bündelt Neuigkeiten, Orientierung und den internen Alltag
                  der drei Projekte in einer ruhigen, gemeinsamen Plattform.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="#gemeinschaften" className="btn-primary w-full sm:min-w-[220px] sm:w-auto">
                    Gemeinschaften ansehen
                  </Link>
                  <Link href="/quartier" className="btn-secondary w-full sm:min-w-[220px] sm:w-auto">
                    Quartierskarte öffnen
                  </Link>
                </div>

                <div className="mt-4">
                  <Link href="/neuigkeiten" className="subtle-link">
                    Neuigkeiten lesen
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {communities.map((community) => (
                    <CommunityBadge key={community.id} community={community.id} />
                  ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 md:max-w-[640px]">
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">133</div>
                    <div className="mt-2 text-[11px] font-medium text-[#786f64]">Wohnungen</div>
                  </div>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">3</div>
                    <div className="mt-2 text-[11px] font-medium text-[#786f64]">Gemeinschaften</div>
                  </div>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                    <div className="text-[28px] font-semibold leading-none text-[#1f4d43]">1</div>
                    <div className="mt-2 text-[11px] font-medium text-[#786f64]">Gemeinsame Plattform</div>
                  </div>
                </div>
              </div>

              <div className="relative xl:pl-2">
                <div className="rounded-[34px] overflow-hidden border border-[var(--line)] shadow-[0_30px_70px_rgba(38,82,62,0.14)]">
                  <Image
                    src="/images/Aufmacher.jpg"
                    alt="Sheridan Quartier im Sheridanpark Augsburg"
                    width={1200}
                    height={860}
                    className="h-[300px] w-full object-cover sm:h-[460px] md:h-[560px]"
                    priority
                  />
                </div>

                <div className="mt-4 rounded-[24px] border border-[rgba(31,77,67,0.12)] bg-[rgba(28,59,49,0.9)] px-5 py-5 text-white md:absolute md:bottom-4 md:left-4 md:right-4 md:mt-0 md:border-white/25 md:bg-[rgba(28,59,49,0.74)] md:backdrop-blur-md">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d7e7de]">
                    Was das Quartier zusammenhält
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#f5efe6]">
                    Räume, Routinen und gegenseitige Unterstützung sollen nicht nebeneinander
                    existieren, sondern im Alltag spürbar ineinandergreifen.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {pathways.map((path) => (
                <Link
                  key={path.title}
                  href={path.href}
                  className="rounded-[28px] border border-[var(--line)] bg-white/72 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c56842]/28"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8b7b6c]">
                    {path.eyebrow}
                  </div>
                  <h3 className="mb-2 mt-3 text-[26px] leading-[1.08]">{path.title}</h3>
                  <p className="mb-0 text-[15px] leading-[1.7] text-[#665f56]">{path.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="gemeinschaften" className="section scroll-mt-20 pt-6">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow mb-4">Die Gemeinschaften</span>
              <h2 className="max-w-[13ch]">Drei Projekte mit eigener Haltung.</h2>
            </div>
            <p className="max-w-[520px] mb-0 text-[16px] leading-[1.75] text-[#665f56]">
              Jedes Haus setzt andere Akzente: gemeinschaftlich, genossenschaftlich, offen für das
              Viertel. Zusammen entsteht ein Quartier mit erkennbarer Vielfalt statt Einheitslogik.
            </p>
          </div>

          <div className="space-y-8">
            {communities.map((community, index) => (
              <article
                key={community.id}
                className={`editorial-panel grid grid-cols-1 overflow-hidden lg:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.1fr)] ${
                  index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative min-h-[260px] md:min-h-[340px]">
                  <Image src={community.image} alt={community.title} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between p-6 md:p-9">
                  <div>
                    <div className="mb-5 flex items-center gap-3">
                      <CommunityBadge community={community.id} />
                      <span className="text-[12px] uppercase tracking-[0.08em] text-[#8b7b6c]">{community.stat}</span>
                    </div>
                    <h3 className="mb-4 text-[30px] md:text-[40px] leading-[1.02]">{community.title}</h3>
                    <p className="mb-3 text-[17px] text-[#3d342d]">{community.tone}</p>
                    <p className="max-w-[56ch] text-[16px] leading-[1.8] text-[#665f56]">{community.description}</p>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12px] uppercase tracking-[0.08em] text-[#8b7b6c]">Projektporträt</span>
                    <Link href={community.href} className="btn-secondary">
                      Mehr erfahren
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plattform" className="section scroll-mt-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="editorial-panel p-6 md:p-9">
              <span className="eyebrow mb-4">Warum diese Plattform?</span>
              <h2 className="max-w-[12ch]">Weniger Zettel, weniger Chat-Streuung, mehr gemeinsamer Überblick.</h2>
              <p className="text-[17px] text-[#584f45]">
                Die Plattform verbindet Projektinformationen, interne Organisation und nachbarschaftliche Hilfe,
                ohne sich nach Verwaltung anzufühlen. Sie soll alltagstauglich sein und gleichzeitig Ruhe in die Kommunikation bringen.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  ['Neuigkeiten', 'Entwicklungen mit Kontext statt vereinzelter Hinweise.'],
                  ['Brett & Skills', 'Suchen, anbieten und gegenseitige Hilfe sichtbar machen.'],
                  ['Kalender & Räume', 'Termine, Nutzung und gemeinsame Infrastruktur zentral ordnen.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-4">
                    <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">{title}</div>
                    <p className="mb-0 mt-2 text-[15px] text-[#534b43]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="editorial-panel bg-[linear-gradient(160deg,#1f4d43_0%,#305f54_100%)] p-6 md:p-9 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#dbcbbd]">
                Für Bewohnerinnen und Bewohner
              </span>
              <h2 className="mt-5 max-w-[14ch] text-white">Der interne Bereich ist auf nützliche Routine statt technische Komplexität gebaut.</h2>
              <p className="text-[16px] md:text-[17px] leading-[1.8] text-[#d9cec3]">
                Schwarzes Brett, Skills, Verleihpool, Kalender und Raumbuchungen liegen an einem Ort.
                Damit der Alltag weniger Sucharbeit braucht und mehr in Beziehung, Planung und gegenseitige Hilfe fließen kann.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  'Schwarzes Brett',
                  'Skills',
                  'Verleihpool',
                  'Kalender',
                  'Raumbuchungen',
                  'Gemeinsame Orientierung',
                ].map((item) => (
                  <div key={item} className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 text-[14px] md:text-[15px] text-[#f2e9df] backdrop-blur-sm">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className="btn-primary">
                  Intern anmelden
                </Link>
                <Link href="/neuigkeiten" className="btn-secondary border-white/20 bg-white/8 text-white hover:bg-white/12 hover:text-white">
                  Öffentliche Neuigkeiten
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {blogPosts && blogPosts.length > 0 && (
        <section id="neuigkeiten" className="section scroll-mt-20 pt-10">
          <div className="container-custom">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow mb-4">Aktuell im Quartier</span>
                <h2 className="max-w-[14ch]">Neue Entwicklungen und Geschichten aus den Gemeinschaften.</h2>
              </div>
              <p className="max-w-[500px] mb-0 text-[16px] leading-[1.75] text-[#665f56]">
                Die öffentliche Ebene der Plattform zeigt, was die drei Projekte verbindet,
                verändert und nach außen sichtbar macht.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
              {featuredPost && (
                <Link href={`/neuigkeiten/${featuredPost.slug}`} className="editorial-panel block p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <CommunityBadge community={featuredPost.community} size="sm" />
                    <span className="text-[12px] uppercase tracking-[0.08em] text-[#8b7b6c]">
                      {formatDate(featuredPost.published_at)}
                    </span>
                  </div>
                  <h3 className="mb-4 text-[36px] md:text-[44px] leading-[0.98]">{featuredPost.title}</h3>
                  {featuredPost.excerpt && (
                    <p className="max-w-[52ch] text-[17px] leading-[1.8] text-[#665f56]">{featuredPost.excerpt}</p>
                  )}
                  <div className="mt-8 subtle-link">Beitrag lesen</div>
                </Link>
              )}

              <div className="space-y-4">
                {secondaryPosts.map((post) => (
                  <Link key={post.id} href={`/neuigkeiten/${post.slug}`} className="block rounded-[28px] border border-[var(--line)] bg-white/72 px-5 py-5 shadow-[0_18px_44px_rgba(38,82,62,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c56842]/28">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <CommunityBadge community={post.community} size="sm" />
                      <span className="text-[12px] uppercase tracking-[0.08em] text-[#8b7b6c]">
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <h3 className="mb-2 text-[26px] leading-[1.08]">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mb-0 text-[15px] leading-[1.7] text-[#665f56] line-clamp-3">{post.excerpt}</p>
                    )}
                  </Link>
                ))}

                <div className="rounded-[28px] border border-[var(--line)] bg-[rgba(241,246,239,0.86)] px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">Weiterlesen</div>
                  <p className="mb-4 mt-3 text-[15px] leading-[1.7] text-[#665f56]">
                    Alle veröffentlichten Beiträge aus dem Quartier gesammelt an einem Ort.
                  </p>
                  <Link href="/neuigkeiten" className="subtle-link">
                    Alle Beiträge ansehen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
