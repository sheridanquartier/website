import ProjectShowcasePage from '@/components/ProjectShowcasePage'

export default function WagnissharePage() {
  return (
    <ProjectShowcasePage
      eyebrow="Genossenschaft · Teilen · Urbane Nachbarschaft"
      title="wagnisSHARE"
      subtitle="Ein genossenschaftliches Wohnprojekt, das Ressourcen, Räume und Verantwortung bewusst teilt."
      heroImage={{
        src: '/images/Wagnis/250516_wagnisSHARE_Richtfest von oben_Foto Holger Gollan-Brink (5).png',
        alt: 'wagnisSHARE im Sheridan Quartier',
      }}
      address="Siegfried-Aufhäuser-Str. 21, 23, 25 · 86157 Augsburg"
      intro={[
        'wagnisSHARE ist das neunte Projekt der Münchner Wohnbaugenossenschaft wagnis eG und ihr erstes außerhalb Münchens. Im Sheridanpark entsteht ein Ensemble aus drei Häusern mit 46 Wohnungen, geplant von N-V-O Nuyken von Oefele Architekten.',
        'Der Name ist Programm: SHARE steht für den Sheridanpark und für die Idee, durch solidarisches Teilen bewusster mit Ressourcen umzugehen. Werkstatt, Dachterrassen, Gästeapartment und ein offener Platz im Süden des Grundstücks schaffen Räume für Nachbarschaft und Begegnung.',
      ]}
      highlights={[
        {
          label: 'Teilen',
          text: 'Geteilte Räume und gemeinsame Infrastruktur sind hier nicht Zusatz, sondern Kern des Konzepts.',
        },
        {
          label: 'Durchmischung',
          text: 'Freifinanzierte und geförderte Wohnungen bringen unterschiedliche Lebensrealitäten zusammen.',
        },
        {
          label: 'Quartiersbezug',
          text: 'Ein offener Platz und gemeinschaftliche Nutzungen wirken bewusst über das Haus hinaus.',
        },
      ]}
      facts={[
        { label: 'Umfang', value: '3 Häuser · 46 Wohnungen · Werkstatt · Dachgärten · Gästeapartment' },
        { label: 'Planung', value: 'N-V-O Nuyken von Oefele Architekten und Stadtplaner' },
        { label: 'Fertigstellung', value: 'Voraussichtlich 2026' },
      ]}
      website={{
        href: 'https://www.wagnis.org/projekte/neubauprojekte/wagnisshare.html',
        label: 'wagnis.org/projekte/wagnisshare',
      }}
      cta={{
        title: 'Freie Wohnungen',
        text: 'Für das Projekt gibt es aktuell noch freie Wohnungen, darunter auch geförderte Angebote.',
        href: 'https://www.wagnis.org/aktuelles/freie-wohnungen.html',
        label: 'Zur Ausschreibung',
      }}
      gallery={[
        { src: '/images/Wagnis/250516_wagnisSHARE_Richtfest von oben_Foto Holger Gollan-Brink (5).png', alt: 'wagnisSHARE beim Richtfest' },
        { src: '/images/Wagnis/wagnis_share_fsf0301_Ausschnitt.jpeg', alt: 'Visualisierung von wagnisSHARE' },
        { src: '/images/Wagnis/240705_wSHARE_Grundsteinlegung_Baugruppe_Architekten2.jpeg', alt: 'Grundsteinlegung von wagnisSHARE' },
        { src: '/images/Wagnis/250516_Richtfest_Gäste_a.jpeg', alt: 'Richtfest mit Gästen bei wagnisSHARE' },
      ]}
    />
  )
}
