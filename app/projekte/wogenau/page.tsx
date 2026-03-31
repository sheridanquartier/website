import ProjectShowcasePage from '@/components/ProjectShowcasePage'

export default function WogenauPage() {
  return (
    <ProjectShowcasePage
      eyebrow="Augsburger Genossenschaft · Holzhaus · Gemeinschaftsflächen"
      title="WOGENAU"
      subtitle="Eine junge Wohnungsbaugenossenschaft aus Augsburg mit starkem Fokus auf bezahlbares, gemeinschaftliches Wohnen."
      heroImage={{
        src: '/images/Wogenau/modell_wogenau_2024_foto_c_.jpg.webp',
        alt: 'WOGENAU im Sheridan Quartier',
      }}
      address="Siegfried-Aufhäuser-Str. 26 · 86157 Augsburg"
      intro={[
        'WOGENAU eG wurde 2019 gegründet, um die Tradition der Augsburger Wohnungsbaugenossenschaften in sozialer Verantwortung weiterzuführen. Nach einem Konzeptvergabeverfahren erhielt die Genossenschaft den Zuschlag für ein Grundstück im Sheridanpark.',
        'Auf über 4.000 Quadratmetern entsteht ein Holzhaus mit 55 Wohnungen und mehr als 300 Quadratmetern Gemeinschaftsfläche. Gemeinschaftsgarten, Innenhof, Vorplatz und Dachterrasse sind so gedacht, dass sie sowohl das Haus als auch das Quartier stärken.',
      ]}
      highlights={[
        {
          label: 'Lokal verankert',
          text: 'Die Genossenschaft ist in Augsburg entstanden und denkt das Projekt bewusst aus der Stadt heraus.',
        },
        {
          label: 'Gemeinschaft',
          text: 'Große Gemeinschaftsflächen im Inneren und außen schaffen Platz für Begegnung und Aktivitäten.',
        },
        {
          label: 'Bauqualität',
          text: 'Das Holzhaus wird nach QNG-Energieeffizienzstandard entwickelt.',
        },
      ]}
      facts={[
        { label: 'Umfang', value: '1 Haus · 55 Wohnungen · über 300 m² Gemeinschaftsfläche' },
        { label: 'Planung', value: 'ARGE Lattke Architekten + BAYR GLATT GUIMARAES Architekten' },
        { label: 'Standard', value: 'Energieeffizienzhaus nach QNG' },
      ]}
      website={{
        href: 'https://wogenau.haus',
        label: 'wogenau.haus',
      }}
      gallery={[
        { src: '/images/Wogenau/modell_wogenau_2024_foto_c_.jpg.webp', alt: 'Architekturmodell von WOGENAU' },
        { src: '/images/Wogenau/spatenstich_wogenau.jpeg', alt: 'Spatenstich des Projekts WOGENAU' },
      ]}
    />
  )
}
