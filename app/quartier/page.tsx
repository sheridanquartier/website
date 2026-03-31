import Link from 'next/link'

const mapUrl = 'https://www.google.com/maps/d/embed?mid=1xdpRbdo5OWIAp8XpLsEbszotEqB1Hw0'
const sharedMapUrl =
  'https://www.google.com/maps/d/u/0/edit?mid=1xdpRbdo5OWIAp8XpLsEbszotEqB1Hw0&usp=sharing'

export default function QuartierPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="section pb-14 md:pb-18">
        <div className="container-custom">
          <div className="section-shell">
            <span className="eyebrow mb-5">Quartierskarte</span>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div>
                <h1 className="max-w-[11ch]">Das Quartier auf einen Blick.</h1>
              </div>
              <p className="mb-0 max-w-[620px] text-[18px] leading-[1.8] text-[var(--muted)]">
                Die Karte zeigt die drei Projekte im Sheridan Quartier farblich hervorgehoben.
                Zusätzlich sind Gästeappartements und Gemeinschaftsräume als Markierungen
                sichtbar, damit räumliche Zusammenhänge schnell verständlich werden.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="container-custom">
          <div className="editorial-panel overflow-hidden p-3 md:p-4">
            <div className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-white/70">
              <iframe
                src={mapUrl}
                title="Quartierskarte Sheridan Quartier"
                className="h-[420px] w-full md:h-[680px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.02fr)_360px]">
            <div className="editorial-panel p-6 md:p-8">
              <span className="eyebrow mb-4">Was die Karte zeigt</span>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Projekte
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">
                    Sheridan Park & Junia, wagnisSHARE und WOGENAU sind farblich hervorgehoben.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Gästeappartements
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">
                    Unterkünfte im Quartier lassen sich räumlich schneller zuordnen.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/72 px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Gemeinschaftsräume
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">
                    Gemeinsame Orte werden sichtbar und erleichtern die Orientierung vor Ort.
                  </p>
                </div>
              </div>
            </div>

            <aside className="editorial-panel p-6 md:p-8">
              <span className="eyebrow mb-4">Direkt öffnen</span>
              <p className="text-[16px] leading-[1.8] text-[#4f5b54]">
                Die eingebettete Karte lässt sich auch direkt in Google Maps öffnen, wenn du
                sie größer ansehen oder dort weiter navigieren möchtest.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href={sharedMapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
                  Karte in Google Maps öffnen
                </Link>
                <Link href="/" className="btn-secondary w-full sm:w-auto">
                  Zur Startseite
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
