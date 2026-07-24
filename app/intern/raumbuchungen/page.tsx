import Link from 'next/link'
import AppIcon from '@/components/AppIcon'
import CommunityBadge from '@/components/CommunityBadge'
import type { CommunityId } from '@/lib/constants'

type SpaceIcon = 'rooms' | 'home' | 'skills' | 'people'

interface SharedSpace {
  name: string
  description: string
  icon: SpaceIcon
  link?: string
  price?: string
}

interface CommunitySpaces {
  id: CommunityId
  intro: string
  spaces: SharedSpace[]
}

const communitySpaces: CommunitySpaces[] = [
  {
    id: 'sheridan-junia',
    intro: 'Bereits genutzte Gemeinschaftsflächen in den drei Häusern von Sheridan Park & Junia.',
    spaces: [
      {
        name: 'Gemeinschaftsraum mit Lesenest',
        description: 'Großer Raum mit Küche und Lesenest für Treffen, Feiern und gemeinsame Aktivitäten.',
        icon: 'rooms',
        link: '/intern/raumbuchungen/gemeinschaftsraum',
        price: '8 € pro Stunde',
      },
      {
        name: 'Gästeappartement',
        description: 'Unterkunft für bis zu vier Gäste mit Bad, Schlafsofa, Hochbett und WLAN.',
        icon: 'home',
        link: '/intern/raumbuchungen/gaesteappartement',
        price: '30 € pro Nacht',
      },
      {
        name: 'Werkstatt',
        description: 'Geteilte Fläche für handwerkliche Arbeiten und gemeinschaftliche Projekte.',
        icon: 'skills',
      },
      {
        name: 'Kulturschuppen',
        description: 'Ort für Kultur, Veranstaltungen und Begegnung innerhalb der Gemeinschaft.',
        icon: 'people',
      },
      {
        name: 'Fahrradwerkstatt',
        description: 'Gemeinsam genutzte Werkstatt mit Werkzeug für Pflege und Reparatur von Fahrrädern.',
        icon: 'skills',
      },
    ],
  },
  {
    id: 'wagnisshare',
    intro: 'Gemeinschaftlich geplante Orte von wagnisSHARE für Teilen, Begegnung und Nachbarschaft.',
    spaces: [
      {
        name: 'Gemeinschaftsraum',
        description: 'Gemeinsamer Raum für Treffen, Veranstaltungen und Aktivitäten im Haus.',
        icon: 'rooms',
      },
      {
        name: 'Gästeappartement',
        description: 'Geteilte Unterkunft für den Besuch von Bewohnerinnen und Bewohnern.',
        icon: 'home',
      },
      {
        name: 'Werkstatt',
        description: 'Gemeinschaftlich ausgestattete Fläche für Reparaturen und eigene Projekte.',
        icon: 'skills',
      },
      {
        name: 'Dachgärten und Dachterrassen',
        description: 'Gemeinsame Freiflächen über den Häusern für Aufenthalt, Garten und Begegnung.',
        icon: 'people',
      },
      {
        name: 'Offener Quartiersplatz',
        description: 'Nach Süden geöffneter Platz als Treffpunkt zwischen Haus und Quartier.',
        icon: 'people',
      },
    ],
  },
  {
    id: 'wogenau',
    intro: 'Mehr als 300 Quadratmeter gemeinschaftliche Innen- und Außenflächen bei WOGENAU.',
    spaces: [
      {
        name: 'Gemeinschaftsraum',
        description: 'Große gemeinschaftlich nutzbare Innenfläche für Treffen und Veranstaltungen.',
        icon: 'rooms',
      },
      {
        name: 'Gästeappartement',
        description: 'Geteilte Unterkunft für Gäste aus dem persönlichen Umfeld der Bewohner.',
        icon: 'home',
      },
      {
        name: 'Dachterrasse',
        description: 'Gemeinsame Freifläche mit Blick über das Quartier.',
        icon: 'people',
      },
      {
        name: 'Gemeinschaftsgarten',
        description: 'Grüne Fläche für gemeinsames Gärtnern, Aufenthalt und nachbarschaftliche Aktivitäten.',
        icon: 'people',
      },
      {
        name: 'Innenhof und Vorplatz',
        description: 'Offene Begegnungsorte, die das Haus mit dem umliegenden Quartier verbinden.',
        icon: 'people',
      },
    ],
  },
]

function SpaceCard({ space }: { space: SharedSpace }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] ${
          space.link ? 'bg-[#dceadf] text-[#245747]' : 'bg-[#ebece7] text-[#66736b]'
        }`}>
          <AppIcon name={space.icon} className="h-[22px] w-[22px]" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.07em] ${
          space.link
            ? 'bg-[#dceadf] text-[#245747]'
            : 'bg-[#eeeee9] text-[#737c76]'
        }`}>
          {space.link ? 'Buchbar' : 'Noch nicht online buchbar'}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 font-sans text-[18px] font-bold leading-[1.2] tracking-[-0.025em]">
          {space.name}
        </h3>
        <p className="mb-0 text-[13px] leading-[1.55] text-[var(--muted)]">
          {space.description}
        </p>
      </div>

      {space.link && (
        <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
          <span className="text-[11px] font-bold text-[#31594c]">{space.price}</span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent)]">
            Details & Buchung
            <AppIcon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      )}
    </>
  )

  const className = `block rounded-[26px] border p-4 transition-transform duration-150 md:p-5 ${
    space.link
      ? 'border-[#9ebcad]/45 bg-white shadow-[0_14px_34px_rgba(28,64,49,0.07)] active:scale-[0.98]'
      : 'border-[var(--line)] bg-white/[0.62]'
  }`

  return space.link ? (
    <Link href={space.link} className={className}>
      {content}
    </Link>
  ) : (
    <article className={className}>
      {content}
    </article>
  )
}

export default function GemeinschaftsflaechenPage() {
  const totalSpaces = communitySpaces.reduce((sum, community) => sum + community.spaces.length, 0)
  const bookableSpaces = communitySpaces.reduce(
    (sum, community) => sum + community.spaces.filter((space) => Boolean(space.link)).length,
    0
  )

  return (
    <div className="min-h-screen pb-24 pt-[calc(4.5rem+env(safe-area-inset-top))] md:pt-28">
      <section className="container-custom pt-4 md:pt-12">
        <div className="max-w-[760px]">
          <p className="app-kicker">Gemeinsam nutzen</p>
          <h1 className="mb-3 max-w-[13ch] font-sans text-[30px] font-bold leading-[1.07] tracking-[-0.045em] md:text-[48px]">
            Räume und Flächen, die wir teilen.
          </h1>
          <p className="mb-0 max-w-[58ch] text-[14px] leading-[1.65] text-[var(--muted)] md:text-[17px]">
            Diese Übersicht zeigt, welche Gemeinschaftsflächen in den drei Projekten vorhanden oder geplant sind.
            Wo bereits eine Online-Buchung möglich ist, führt die Fläche direkt zu den Details.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-[var(--line)] rounded-[24px] bg-white/[0.78] py-4 shadow-[0_12px_30px_rgba(28,64,49,0.05)] md:max-w-[520px]">
          {[
            [communitySpaces.length, 'Projekte'],
            [totalSpaces, 'Flächen'],
            [bookableSpaces, 'buchbar'],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-[22px] font-bold leading-none tracking-[-0.04em] text-[#245245]">{value}</div>
              <div className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.07em] text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-custom mt-9 space-y-10 md:mt-14 md:space-y-16">
        {communitySpaces.map((community) => {
          const availableCount = community.spaces.filter((space) => Boolean(space.link)).length

          return (
            <section key={community.id}>
              <div className="mb-4 flex items-start justify-between gap-4 md:mb-6">
                <div>
                  <CommunityBadge community={community.id} />
                  <p className="mb-0 mt-2 max-w-[54ch] text-[12px] leading-[1.55] text-[var(--muted)] md:text-[14px]">
                    {community.intro}
                  </p>
                </div>
                <span className="shrink-0 pt-1 text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--muted)]">
                  {availableCount > 0 ? `${availableCount} buchbar` : 'Übersicht'}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                {community.spaces.map((space) => (
                  <SpaceCard key={space.name} space={space} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section className="container-custom mt-10 md:mt-16">
        <div className="flex items-start gap-3 rounded-[24px] bg-[#ebe6d8] p-4 md:max-w-[760px] md:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.72] text-[#6e633e]">
            <AppIcon name="people" className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[13px] font-bold">Die Übersicht wächst mit dem Quartier.</div>
            <p className="mb-0 mt-1 text-[12px] leading-[1.55] text-[var(--muted)] md:text-[13px]">
              Buchungswege und weitere Details werden ergänzt, sobald sie von den jeweiligen Projekten bereitgestellt werden.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
