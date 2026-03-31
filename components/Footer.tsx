import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-[var(--line)] bg-[linear-gradient(180deg,rgba(247,244,238,0.96)_0%,rgba(232,240,232,0.96)_100%)] py-18">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.85fr_0.85fr_0.9fr]">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              Sheridan Quartier
            </div>
            <h3 className="mb-4 mt-3 text-[34px] leading-[1]">Drei Gemeinschaften. Ein gemeinsamer Rhythmus.</h3>
            <p className="max-w-[440px] text-[15px] leading-[1.8] text-[var(--muted)]">
              Die Plattform verbindet die drei Projekte im Sheridanpark mit einer ruhigen,
              verständlichen Struktur für Neuigkeiten, Orientierung und den Alltag im Quartier.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Schnellzugriff</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/quartier" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Quartierskarte
                </Link>
              </li>
              <li>
                <Link href="/neuigkeiten" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Neuigkeiten
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Interner Bereich
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Projekte</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/projekte/sheridan-junia" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Sheridan Park & Junia
                </Link>
              </li>
              <li>
                <Link href="/projekte/wagnisshare" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  wagnisSHARE
                </Link>
              </li>
              <li>
                <Link href="/projekte/wogenau" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  WOGENAU
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Rechtliches</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/impressum" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-[15px] text-[var(--ink)] hover:text-[var(--accent)]">
                  Projekt-Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--line)] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="mb-0 text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
            © {new Date().getFullYear()} Sheridan Quartier
          </p>
          <p className="mb-0 text-[13px] text-[var(--muted)]">
            Gemeinschaftlich wohnen, organisieren und sichtbar bleiben.
          </p>
        </div>
      </div>
    </footer>
  )
}
