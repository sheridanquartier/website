import Link from 'next/link'

const mapUrl = 'https://www.google.com/maps/d/embed?mid=1Dz434-txDg-1hLHDC7vnuVMrJMy6gJY'
const sharedMapUrl =
  'https://www.google.com/maps/d/edit?mid=1Dz434-txDg-1hLHDC7vnuVMrJMy6gJY&usp=sharing'

const projectLegend = [
  { name: 'Sheridan Park & Junia', color: '#2f6fd6', colorName: 'Blau' },
  { name: 'wagnisSHARE', color: '#d34a42', colorName: 'Rot' },
  { name: 'WOGENAU', color: '#3a8b55', colorName: 'Grün' },
]

export default function QuartierPage() {
  return (
    <>
      <div className="app-screen md:hidden">
        <section className="px-4 pt-6">
          <p className="app-kicker">Orientierung</p>
          <h1 className="mb-2 font-sans text-[34px] font-bold leading-[1.04] tracking-[-0.045em]">
            Alles in der Nähe.
          </h1>
          <p className="mb-0 text-[14px] leading-[1.55] text-[var(--muted)]">
            Projekte, Gemeinschaftsräume und Gästeappartements auf einen Blick.
          </p>
        </section>

        <section className="mt-5 px-4">
          <div className="relative overflow-hidden rounded-[22px] bg-[#dfe7df] shadow-[0_3px_14px_rgba(20,24,23,0.08)]">
            <iframe
              src={mapUrl}
              title="Quartierskarte Sheridan Quartier"
              className="h-[55svh] min-h-[430px] w-full"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(19,47,39,0.72))]" />
            <Link
              href={sharedMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 flex min-h-[50px] items-center justify-between rounded-[14px] bg-white/92 px-4 text-[13px] font-semibold text-[var(--app-ios-accent)] shadow-sm backdrop-blur-xl"
            >
              In Google Maps öffnen
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="mt-7 px-4">
          <p className="app-kicker">Kartenlegende</p>
          <div className="app-group mt-3">
            {projectLegend.map((project) => (
              <div key={project.name} className="app-list-row">
                <span
                  className="h-10 w-10 shrink-0 rounded-[12px] border-4 border-white shadow-sm"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-[14px] font-semibold">{project.name}</span>
                  <span className="mt-0.5 block text-[11px] text-[var(--app-ios-muted)]">{project.colorName} markiert</span>
                </span>
              </div>
            ))}
            {[
              ['A', 'Gästeappartements', 'für Besuch im Quartier'],
              ['R', 'Gemeinschaftsräume', 'für Begegnung und Termine'],
            ].map(([mark, title, detail]) => (
              <div key={title} className="app-list-row">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--app-ios-accent-soft)] text-[13px] font-semibold text-[var(--app-ios-accent)]">
                  {mark}
                </span>
                <span>
                  <span className="block text-[14px] font-semibold">{title}</span>
                  <span className="mt-0.5 block text-[11px] text-[var(--app-ios-muted)]">{detail}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-[18px] bg-[var(--app-ios-accent-soft)] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--app-ios-accent)]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 21s6-4.2 6-10a6 6 0 1 0-12 0c0 5.8 6 10 6 10Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="2.3" strokeWidth="1.8" />
              </svg>
            </span>
            <p className="mb-0 text-[12px] leading-[1.55] text-[var(--app-ios-muted)]">
              Tippe auf einen Pin in der Karte, um weitere Informationen zum jeweiligen Ort zu erhalten.
            </p>
          </div>
        </section>
      </div>

      <div className="hidden min-h-screen pt-16 md:block">
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
                <div className="rounded-[24px] border border-[var(--line)] bg-white/[0.72] px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Farben der Projekte
                  </div>
                  <div className="mt-4 space-y-3">
                    {projectLegend.map((project) => (
                      <div key={project.name} className="flex items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white"
                          style={{ backgroundColor: project.color }}
                          aria-hidden="true"
                        />
                        <span className="text-[14px] text-[#4f5b54]">
                          <strong className="font-semibold text-[var(--ink)]">{project.colorName}:</strong> {project.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/[0.72] px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Gästeappartements
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">
                    Unterkünfte im Quartier lassen sich räumlich schneller zuordnen.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/[0.72] px-5 py-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8b7b6c]">
                    Gemeinschaftsräume
                  </div>
                  <p className="mb-0 mt-3 text-[15px] leading-[1.7] text-[#4f5b54]">
                    Gemeinsame Orte werden sichtbar und erleichtern die Orientierung vor Ort.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-[#e3ece5] px-5 py-4 text-[14px] leading-[1.6] text-[#345b4f]">
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 21s6-4.2 6-10a6 6 0 1 0-12 0c0 5.8 6 10 6 10Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="11" r="2.3" strokeWidth="1.8" />
                </svg>
                Klicke auf einen Pin in der Karte, um weitere Informationen zum jeweiligen Ort zu erhalten.
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
    </>
  )
}
