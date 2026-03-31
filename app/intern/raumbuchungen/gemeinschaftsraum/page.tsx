import Link from 'next/link'
import Image from 'next/image'

export default function GemeinschaftsraumPage() {
  return (
    <div className="pt-28 min-h-screen">
      <section className="section bg-white">
        <div className="container-custom max-w-4xl">
          <Link
            href="/intern/raumbuchungen"
            className="inline-flex items-center text-[#0071e3] hover:text-[#0077ed] text-[14px] mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zu Raumbuchungen
          </Link>

          <h1 className="mb-8">Gemeinschaftsraum Sheridan Park & Junia</h1>

          {/* Hero-Bild */}
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-[#f5f5f7] mb-6">
            <Image
              src="/images/SheridanParkUndJunia/IMG_9675_hero.jpg"
              alt="Gemeinschaftsraum Tischgruppe"
              fill
              className="object-contain"
            />
          </div>

          {/* Impressionen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-[#f5f5f7]">
              <Image
                src="/images/SheridanParkUndJunia/IMG_9674_gallery.jpg"
                alt="Gemeinschaftsraum Küche und Lesenest"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-[#f5f5f7]">
              <Image
                src="/images/SheridanParkUndJunia/IMG_9672_gallery.jpg"
                alt="Gemeinschaftsraum Tischgruppe und Lesenest"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-[#f5f5f7]">
              <Image
                src="/images/SheridanParkUndJunia/IMG_9673_gallery.jpg"
                alt="Gemeinschaftsraum Lesenest"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Google Calendar Embed */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium mb-4 text-[#1d1d1f]">Verfügbarkeit</h2>
            <div className="card p-0 overflow-hidden">
              <iframe
                src="https://calendar.google.com/calendar/u/0/embed?src=spuj.gemeinschaftsraum@gmail.com&ctz=Europe/Berlin"
                className="w-full h-[600px] border-0"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>

          {/* Buchungsablauf */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium mb-6 text-[#1d1d1f]">Buchungsablauf</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-[48px] font-semibold text-[#0071e3] mb-3">1.</div>
                <p className="text-[17px] text-[#1d1d1f]">
                  Prüfe im Kalender, ob der gewünschte Termin frei ist
                </p>
              </div>
              <div className="card">
                <div className="text-[48px] font-semibold text-[#0071e3] mb-3">2.</div>
                <p className="text-[17px] text-[#1d1d1f]">
                  Sende deine Buchungsanfrage per E-Mail
                </p>
              </div>
              <div className="card">
                <div className="text-[48px] font-semibold text-[#0071e3] mb-3">3.</div>
                <p className="text-[17px] text-[#1d1d1f]">
                  Warte auf die Bestätigung per E-Mail
                </p>
              </div>
            </div>
          </div>

          {/* Buchungsanfrage */}
          <div className="card bg-[#f5f5f7] mb-12">
            <h3 className="text-[24px] font-medium mb-4 text-[#1d1d1f]">Buchungsanfrage</h3>
            <p className="text-[17px] text-[#6e6e73] mb-4">
              Sende deine Buchungsanfrage mit folgenden Angaben per E-Mail:
            </p>
            <ul className="text-[17px] text-[#6e6e73] mb-6 space-y-2">
              <li>• Gewünschter Termin und Uhrzeit</li>
              <li>• Art der Veranstaltung</li>
              <li>• Anzahl der erwarteten Personen</li>
              <li>• Deine Kontaktdaten</li>
            </ul>
            <p className="text-[17px] text-[#1d1d1f]">
              <span className="font-medium">E-Mail:</span> spuj.gemeinschaftsraum@gmail.com
            </p>
          </div>

          {/* Gebühren */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium mb-6 text-[#1d1d1f]">Gebühren</h2>
            <div className="card">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[48px] font-semibold text-[#1d1d1f]">8 €</span>
                <span className="text-[21px] text-[#6e6e73]">pro Stunde</span>
              </div>
              <p className="text-[14px] text-[#6e6e73]">
                Die Gebühr wird nach der Nutzung abgerechnet.
              </p>
            </div>
          </div>

          {/* Wichtige Hinweise */}
          <div className="card bg-[#e8f0fe] border-l-4 border-[#0071e3]">
            <h3 className="text-[20px] font-medium mb-3 text-[#1d1d1f]">ℹ️ Wichtige Hinweise</h3>
            <ul className="space-y-2 text-[17px] text-[#6e6e73]">
              <li>• Bitte hinterlasse den Raum sauber und aufgeräumt</li>
              <li>• Beachte die Nutzungsordnung (siehe Infos-Seite)</li>
              <li>• Lautstärke nach 22:00 Uhr reduzieren</li>
              <li>• Bei Schäden oder Problemen das OrgaTeam Gemeinschaftsraum informieren</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
