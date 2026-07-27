import Link from 'next/link'
import AppIcon from '@/components/AppIcon'
import CommunityBadge from '@/components/CommunityBadge'
import type { CommunityId } from '@/lib/constants'

interface SharedSpace {
  name: string
  description: string
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
        link: '/intern/raumbuchungen/gemeinschaftsraum',
        price: '8 € pro Stunde',
      },
      {
        name: 'Gästeappartement',
        description: 'Unterkunft für bis zu vier Gäste mit Bad, Schlafsofa, Hochbett und WLAN.',
        link: '/intern/raumbuchungen/gaesteappartement',
        price: '30 € pro Nacht',
      },
      {
        name: 'Werkstatt',
        description: 'Geteilte Fläche für handwerkliche Arbeiten und gemeinschaftliche Projekte.',
      },
      {
        name: 'Kulturschuppen',
        description: 'Ort für Kultur, Veranstaltungen und Begegnung innerhalb der Gemeinschaft.',
      },
      {
        name: 'Fahrradwerkstatt',
        description: 'Gemeinsam genutzte Werkstatt mit Werkzeug für Pflege und Reparatur von Fahrrädern.',
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
      },
      {
        name: 'Gästeappartement',
        description: 'Geteilte Unterkunft für den Besuch von Bewohnerinnen und Bewohnern.',
      },
      {
        name: 'Werkstatt',
        description: 'Gemeinschaftlich ausgestattete Fläche für Reparaturen und eigene Projekte.',
      },
      {
        name: 'Dachgärten und Dachterrassen',
        description: 'Gemeinsame Freiflächen über den Häusern für Aufenthalt, Garten und Begegnung.',
      },
      {
        name: 'Offener Quartiersplatz',
        description: 'Nach Süden geöffneter Platz als Treffpunkt zwischen Haus und Quartier.',
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
      },
      {
        name: 'Gästeappartement',
        description: 'Geteilte Unterkunft für Gäste aus dem persönlichen Umfeld der Bewohner.',
      },
      {
        name: 'Dachterrasse',
        description: 'Gemeinsame Freifläche mit Blick über das Quartier.',
      },
      {
        name: 'Gemeinschaftsgarten',
        description: 'Grüne Fläche für gemeinsames Gärtnern, Aufenthalt und nachbarschaftliche Aktivitäten.',
      },
      {
        name: 'Innenhof und Vorplatz',
        description: 'Offene Begegnungsorte, die das Haus mit dem umliegenden Quartier verbinden.',
      },
    ],
  },
]

const communityThemes: Record<CommunityId, {
  panel: string
  card: string
  marker: string
  divider: string
  action: string
}> = {
  'sheridan-junia': {
    panel: 'border-[#b9cdf6] bg-[#edf3ff]',
    card: 'border-[#c4d4f3] border-l-[#2563eb] bg-white/80',
    marker: 'bg-[#2563eb]',
    divider: 'border-[#d6e1f7]',
    action: 'bg-[#1a56db] text-white',
  },
  wagnisshare: {
    panel: 'border-[#f0c5ad] bg-[#fff3ea]',
    card: 'border-[#f0cfba] border-l-[#e4572e] bg-white/80',
    marker: 'bg-[#e4572e]',
    divider: 'border-[#f3ded0]',
    action: 'bg-[#c94c28] text-white',
  },
  wogenau: {
    panel: 'border-[#b9d8bd] bg-[#edf7ee]',
    card: 'border-[#c7dfca] border-l-[#299447] bg-white/80',
    marker: 'bg-[#299447]',
    divider: 'border-[#d8e9da]',
    action: 'bg-[#247b3b] text-white',
  },
}

function SpaceCard({
  space,
  theme,
}: {
  space: SharedSpace
  theme: (typeof communityThemes)[CommunityId]
}) {
  return (
    <details className={`group overflow-hidden rounded-[18px] border border-l-4 ${theme.card}`}>
      <summary className="space-summary flex min-h-[58px] cursor-pointer list-none items-center gap-3 px-3.5 py-3 md:min-h-[60px] md:px-4">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.marker}`} aria-hidden="true" />
        <h3 className="mb-0 min-w-0 flex-1 font-sans text-[15px] font-bold leading-[1.25] tracking-[-0.015em] md:text-[16px]">
          {space.name}
        </h3>
        <AppIcon
          name="chevron"
          className="h-[18px] w-[18px] shrink-0 text-[var(--muted)] transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className={`border-t px-4 pb-4 pt-3 ${theme.divider}`}>
        <p className="mb-0 text-[13px] leading-[1.55] text-[var(--muted)]">
          {space.description}
        </p>

        {space.link ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] font-bold text-[#31594c]">{space.price}</span>
            <Link
              href={space.link}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[12px] font-bold shadow-sm transition-transform active:scale-[0.97] ${theme.action}`}
            >
              Details & Buchung
              <AppIcon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <p className="mb-0 mt-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            Noch keine Online-Buchung verfügbar
          </p>
        )}
      </div>
    </details>
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

      <div className="container-custom mt-9 space-y-6 md:mt-14 md:space-y-8">
        {communitySpaces.map((community) => {
          const availableCount = community.spaces.filter((space) => Boolean(space.link)).length
          const theme = communityThemes[community.id]

          return (
            <section
              key={community.id}
              className={`rounded-[28px] border p-4 shadow-[0_12px_32px_rgba(28,64,49,0.04)] md:p-6 ${theme.panel}`}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
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

              <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {community.spaces.map((space) => (
                  <SpaceCard key={space.name} space={space} theme={theme} />
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
