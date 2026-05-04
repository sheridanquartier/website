import Link from 'next/link'

const services = {
  'sheridan-junia': [
    {
      name: 'Fahrradwerkstatt',
      description: 'Werkstatt mit Werkzeug für Fahrradreparaturen',
      icon: '🔧',
      link: null
    },
    {
      name: 'Lesenest',
      description: 'Lesenest für Kinder',
      icon: '📚',
      link: null
    }
  ],
  'wagnisshare': [
    {
      name: 'Gästeappartement',
      description: 'Gemütliches Appartement für Gäste',
      icon: '🏠',
      link: null
    },
    {
      name: 'Gemeinschaftsraum',
      description: 'Großer Raum für Treffen und Veranstaltungen',
      icon: '🎉',
      link: null
    },
    {
      name: 'Dachterrasse',
      description: 'Gemeinsame Dachterrasse mit Grillmöglichkeit',
      icon: '🌇',
      link: null
    }
  ],
  'wogenau': [
    {
      name: 'Gästeappartement',
      description: 'Gemütliches Appartement für Gäste',
      icon: '🏠',
      link: null
    },
    {
      name: 'Gemeinschaftsraum',
      description: 'Großer Raum für Treffen und Veranstaltungen',
      icon: '🎉',
      link: null
    },
    {
      name: 'Dachterrasse',
      description: 'Gemeinsame Dachterrasse mit Grillmöglichkeit',
      icon: '🌇',
      link: null
    }
  ]
}

const bookableRooms = [
  {
    community: 'Sheridan Park & Junia',
    name: 'Gästeappartement',
    description: 'Gemütliches Appartement mit Schlafsofa und Hochbett für bis zu 4 Personen. Ausgestattet mit Bad und WLAN.',
    price: '20 €/Nacht',
    link: '/intern/raumbuchungen/gaesteappartement',
    colorClass: 'border-[#2563EB]'
  },
  {
    community: 'Sheridan Park & Junia',
    name: 'Gemeinschaftsraum',
    description: 'Großer Raum für Treffen und Veranstaltungen.',
    price: '8 €/Stunde',
    link: '/intern/raumbuchungen/gemeinschaftsraum',
    colorClass: 'border-[#2563EB]'
  }
]

export default function RaumbuchungenPage() {
  return (
    <div className="pt-28 min-h-screen">
      {/* Raumbuchungen */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="mb-12">
            <h1 className="mb-4">Raumbuchungen</h1>
            <p className="text-[21px] text-[#6e6e73] content-width">
              Buchbare Räume und Unterkünfte im Quartier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {bookableRooms.map((room, idx) => (
              <div key={idx} className={`border ${room.colorClass} rounded-2xl p-6`}>
                <div className="mb-4">
                  <p className="text-[12px] font-medium text-[#6e6e73] mb-1">{room.community}</p>
                  <h3 className="text-[24px] font-medium text-[#1d1d1f] mb-3">{room.name}</h3>
                  <p className="text-[17px] text-[#6e6e73] leading-[1.7] mb-4">
                    {room.description}
                  </p>
                  <p className="text-[20px] font-medium text-[#1d1d1f] mb-6">
                    {room.price}
                  </p>
                </div>
                <Link
                  href={room.link}
                  className="btn-primary w-full"
                >
                  Verfügbarkeit anfragen →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services nach Gemeinschaft */}
      <section className="section bg-[#f5f5f7]">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="mb-4">Gemeinschaftliche Services</h2>
            <p className="text-[17px] text-[#6e6e73]">
              Räume und Angebote der drei Baugemeinschaften
            </p>
          </div>

          {/* Sheridan & Junia */}
          <div className="mb-16">
            <h3 className="text-[24px] font-medium mb-6 text-[#1d1d1f]">Sheridan Park & Junia</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services['sheridan-junia'].map((service, idx) => (
                service.link ? (
                  <Link key={idx} href={service.link} className="card hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </Link>
                ) : (
                  <div key={idx} className="card">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* wagnisSHARE */}
          <div className="mb-16">
            <h3 className="text-[24px] font-medium mb-6 text-[#1d1d1f]">wagnisSHARE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services['wagnisshare'].map((service, idx) => (
                service.link ? (
                  <Link key={idx} href={service.link} className="card hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </Link>
                ) : (
                  <div key={idx} className="card">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* WOGENAU */}
          <div>
            <h3 className="text-[24px] font-medium mb-6 text-[#1d1d1f]">WOGENAU</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services['wogenau'].map((service, idx) => (
                service.link ? (
                  <Link key={idx} href={service.link} className="card hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </Link>
                ) : (
                  <div key={idx} className="card">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">{service.name}</h4>
                    <p className="text-[14px] text-[#6e6e73]">{service.description}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-12 card bg-white border-l-4 border-[#0071e3]">
            <h4 className="text-[17px] font-medium mb-2 text-[#1d1d1f]">Hinweis</h4>
            <p className="text-[14px] text-[#6e6e73]">
              Für einige Services ist eine Buchung oder Reservierung erforderlich.
              Bitte wenden Sie sich an Ihre jeweilige Hausgemeinschaft für weitere Details.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
