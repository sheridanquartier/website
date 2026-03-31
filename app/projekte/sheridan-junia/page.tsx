import ProjectShowcasePage from '@/components/ProjectShowcasePage'

export default function SheridanJuniaPage() {
  return (
    <ProjectShowcasePage
      eyebrow="Baugemeinschaft · Holzbau · Mehrgenerationenwohnen"
      title="Sheridan Park & Junia"
      subtitle="Gemeinsam wohnen, nachhaltig bauen und im Alltag Verantwortung teilen."
      heroImage={{
        src: '/images/SheridanParkUndJunia/Parkansicht.jpg',
        alt: 'Sheridan Park & Junia im Sheridan Quartier',
      }}
      address="Siegfried-Aufhäuser-Str. 15, 17, 19 · 86157 Augsburg"
      intro={[
        'Sheridan Park & Junia ist eine Baugemeinschaft für nachhaltiges Mehrgenerationenwohnen im Herzen des Sheridanparks. In drei Häusern sind 32 Wohnungen in ökologischer Holzbauweise entstanden, geplant von lattkearchitekten und PLAN-Z Architekten.',
        'Das Projekt verbindet private Wohnungen mit bewusst geteilten Ressourcen: Gemeinschaftsraum mit Lesenest, Werkstatt, Kulturschuppen, Fahrradwerkstatt und Gästeappartement entlasten den Alltag und schaffen Begegnung jenseits der eigenen Wohnung.',
      ]}
      highlights={[
        {
          label: 'Nachhaltigkeit',
          text: 'Holzbau, begrünte Dächer und ein durchdachtes Energiekonzept prägen das Projekt.',
        },
        {
          label: 'Miteinander',
          text: 'Gemeinschaftsräume und geteilte Infrastruktur schaffen eine spürbare Alltagsnähe.',
        },
        {
          label: 'Wohnmix',
          text: 'Von der 1-Zimmer-Wohnung bis zur Familienwohnung ist das Haus bewusst generationenoffen gedacht.',
        },
      ]}
      facts={[
        { label: 'Umfang', value: '3 Häuser · 32 Wohnungen · 4 Gemeinschaftsräume' },
        { label: 'Planung', value: 'lattkearchitekten + PLAN-Z Architekten' },
        { label: 'Schwerpunkt', value: 'Nachhaltiges Mehrgenerationenwohnen in ökologischer Holzbauweise' },
      ]}
      website={{
        href: 'https://www.sheridanparkundjunia.de',
        label: 'sheridanparkundjunia.de',
      }}
      cta={{
        title: 'Gästeappartement buchen',
        text: 'Bewohnerinnen und Bewohner können das Gästeappartement für Besuche direkt online reservieren.',
        href: 'https://sheridanpark-augsburg.de/gaesteappartement',
        label: 'Zur Buchung',
      }}
      gallery={[
        { src: '/images/SheridanParkUndJunia/Parkansicht.jpg', alt: 'Parkansicht des Projekts Sheridan Park & Junia' },
        { src: '/images/SheridanParkUndJunia/IMG_8493_gallery.jpg', alt: 'Außenansicht von Sheridan Park' },
        { src: '/images/SheridanParkUndJunia/IMG_8670_gallery.jpg', alt: 'Gemeinschaftsbereich im Projekt' },
        { src: '/images/SheridanParkUndJunia/IMG_9669_gallery.jpg', alt: 'Innenhof von Sheridan Park & Junia' },
        { src: '/images/SheridanParkUndJunia/IMG_9675_gallery.jpg', alt: 'Architekturansicht des Projekts' },
        { src: '/images/SheridanParkUndJunia/IMG_8505_gallery.jpg', alt: 'Detailansicht der Holzarchitektur' },
      ]}
    />
  )
}
