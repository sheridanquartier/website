import Link from 'next/link'
import Image from 'next/image'

export default function GaesteappartementPage() {
  return (
    <div className="min-h-screen pb-24 pt-[calc(4.5rem+env(safe-area-inset-top))] md:pt-28">
      <section className="py-4 md:bg-white md:py-24">
        <div className="container-custom max-w-4xl">
          <Link
            href="/intern/raumbuchungen"
            className="mb-8 hidden items-center text-[14px] text-[var(--app-ios-accent)] hover:text-[#125c46] md:inline-flex"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zu Gemeinschaftsflächen
          </Link>

          <h1 className="mb-8 hidden md:block">Gästeappartement Sheridan Park & Junia</h1>

          {/* Hero-Bild */}
          <div className="relative mb-3 h-[300px] w-full overflow-hidden rounded-[22px] bg-[#e5e5ea] md:mb-6 md:h-[500px]">
            <Image
              src="/images/SheridanParkUndJunia/IMG_9667_hero.jpg"
              alt="Gästeappartement innen"
              fill
              className="object-cover"
            />
          </div>

          {/* Impressionen */}
          <div className="mb-10 grid grid-cols-3 gap-2 md:mb-12 md:gap-6">
            <div className="relative h-[104px] w-full overflow-hidden rounded-[14px] bg-[#e5e5ea] md:h-[200px] md:rounded-2xl">
              <Image
                src="/images/SheridanParkUndJunia/IMG_9665_gallery.jpg"
                alt="Gästeappartement Bad"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[104px] w-full overflow-hidden rounded-[14px] bg-[#e5e5ea] md:h-[200px] md:rounded-2xl">
              <Image
                src="/images/SheridanParkUndJunia/IMG_8499_gallery.jpg"
                alt="Gästeappartement von Außen mit Garten"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[104px] w-full overflow-hidden rounded-[14px] bg-[#e5e5ea] md:h-[200px] md:rounded-2xl">
              <Image
                src="/images/SheridanParkUndJunia/IMG_9669_gallery.jpg"
                alt="Gästeappartement Garten"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Google Calendar Embed */}
          <div className="mb-12">
            <h2 className="mb-4 text-[25px] font-semibold text-[#1d1d1f] md:text-[28px]">Verfügbarkeit</h2>
            <div className="card p-0 overflow-hidden">
              <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FBerlin&showPrint=0&showTitle=0&showTabs=0&showCalendars=0&showTz=0&src=262d2e4f6258cf93aa80728074815d5447da2d3a22e39f6fb869c7596d1c8e0a%40group.calendar.google.com&color=%23f09300"
                className="h-[520px] w-full border-0 md:h-[600px]"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>

          {/* Buchungsablauf */}
          <div className="mb-12">
            <h2 className="mb-6 text-[25px] font-semibold text-[#1d1d1f] md:text-[28px]">Buchungsablauf</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="mb-3 text-[42px] font-semibold text-[var(--app-ios-accent)] md:text-[48px]">1.</div>
                <p className="text-[17px] text-[#1d1d1f]">
                  Prüfe im Kalender, ob die gewünschten Tage frei sind
                </p>
              </div>
              <div className="card">
                <div className="mb-3 text-[42px] font-semibold text-[var(--app-ios-accent)] md:text-[48px]">2.</div>
                <p className="text-[17px] text-[#1d1d1f]">
                  Sende eine E-Mail mit deinem Buchungswunsch
                </p>
              </div>
              <div className="card">
                <div className="mb-3 text-[42px] font-semibold text-[var(--app-ios-accent)] md:text-[48px]">3.</div>
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
              <li>• Zeitraum: Von wann bis wann</li>
              <li>• Anzahl der Personen</li>
              <li>• Deine Kontaktdaten</li>
            </ul>
            <p className="text-[17px] text-[#1d1d1f]">
              <span className="font-medium">E-Mail:</span> spuj.gaesteappartement@gmail.com
            </p>
          </div>

          {/* Kosten */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium mb-6 text-[#1d1d1f]">Kosten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[48px] font-semibold text-[#1d1d1f]">30 €</span>
                  <span className="text-[21px] text-[#6e6e73]">pro Nacht</span>
                </div>
              </div>
              <div className="card">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[48px] font-semibold text-[#1d1d1f]">30 €</span>
                  <span className="text-[21px] text-[#6e6e73]">Reinigungspauschale</span>
                </div>
                <p className="text-[14px] text-[#6e6e73]">
                  Einmalig pro Aufenthalt
                </p>
              </div>
            </div>
          </div>

          {/* Ausstattung */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium mb-6 text-[#1d1d1f]">Ausstattung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schlafbereich */}
              <div className="card">
                <h3 className="text-[20px] font-medium mb-4 text-[#1d1d1f]">🛏️ Schlafbereich</h3>
                <ul className="space-y-2 text-[17px] text-[#6e6e73]">
                  <li>• Großes Schlafsofa für 2 Personen</li>
                  <li>• Hochbett für 2 weitere Personen</li>
                  <li>• Bettlaken vorhanden</li>
                  <li>• Kleiderschrank</li>
                  <li>• Tisch mit 2 Stühlen</li>
                </ul>
              </div>

              {/* Badezimmer */}
              <div className="card">
                <h3 className="text-[20px] font-medium mb-4 text-[#1d1d1f]">🚿 Badezimmer</h3>
                <ul className="space-y-2 text-[17px] text-[#6e6e73]">
                  <li>• Dusche/WC</li>
                </ul>
              </div>

              {/* Verpflegung */}
              <div className="card">
                <h3 className="text-[20px] font-medium mb-4 text-[#1d1d1f]">☕ Verpflegung</h3>
                <ul className="space-y-2 text-[17px] text-[#6e6e73]">
                  <li>• Wasserkocher</li>
                  <li>• Kleiner Kühlschrank</li>
                  <li>• 2 Tassen und 2 Gläser</li>
                </ul>
              </div>

              {/* Sonstiges */}
              <div className="card">
                <h3 className="text-[20px] font-medium mb-4 text-[#1d1d1f]">📶 Sonstiges</h3>
                <ul className="space-y-2 text-[17px] text-[#6e6e73]">
                  <li>• Kostenfreies WLAN</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bitte mitbringen */}
          <div className="card bg-[#fff3cd] border-l-4 border-[#ffc107] mb-12">
            <h3 className="text-[20px] font-medium mb-3 text-[#1d1d1f]">📋 Bitte mitbringen</h3>
            <ul className="space-y-2 text-[17px] text-[#6e6e73]">
              <li>• Bettwäsche</li>
              <li>• Handtücher</li>
            </ul>
          </div>

          {/* Wichtige Hinweise */}
          <div className="card bg-[#e8f0fe] border-l-4 border-[#0071e3]">
            <h3 className="text-[20px] font-medium mb-3 text-[#1d1d1f]">ℹ️ Wichtige Hinweise</h3>
            <ul className="space-y-2 text-[17px] text-[#6e6e73]">
              <li>• Bitte hinterlasse das Appartement sauber und aufgeräumt</li>
              <li>• Beachte die Nutzungsordnung (siehe Infos-Seite)</li>
              <li>• Schlüsselübergabe nach Absprache</li>
              <li>• Bei Schäden oder Problemen das OrgaTeam Gästeappartement informieren</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
