'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppIcon from '@/components/AppIcon'

interface MobileAppHeaderProps {
  isLoggedIn?: boolean
}

function getScreen(pathname: string) {
  if (pathname === '/') return { title: 'Sheridan', subtitle: 'Quartier', parent: null }
  if (pathname === '/quartier') return { title: 'Quartierskarte', subtitle: 'Orientierung', parent: null }
  if (pathname === '/neuigkeiten') return { title: 'Neuigkeiten', subtitle: 'Aus den Projekten', parent: null }
  if (pathname.startsWith('/neuigkeiten/')) return { title: 'Beitrag', subtitle: 'Neuigkeiten', parent: '/neuigkeiten' }
  if (pathname.startsWith('/projekte/')) return { title: 'Projektporträt', subtitle: 'Gemeinschaft', parent: '/' }
  if (pathname === '/login') return { title: 'Bewohnerbereich', subtitle: 'Anmelden', parent: '/' }
  if (pathname === '/intern/dashboard') return { title: 'Mein Quartier', subtitle: 'Interner Bereich', parent: null }
  if (pathname.startsWith('/intern/schwarzes-brett')) return { title: 'Schwarzes Brett', subtitle: 'Suchen & anbieten', parent: null }
  if (pathname.startsWith('/intern/skills')) return { title: 'Skillpool', subtitle: 'Wissen teilen', parent: null }
  if (pathname.startsWith('/intern/verleihpool')) return { title: 'Verleihpool', subtitle: 'Gemeinsam nutzen', parent: null }
  if (pathname.startsWith('/intern/kalender')) return { title: 'Kalender', subtitle: 'Was ansteht', parent: null }
  if (pathname === '/intern/raumbuchungen') return { title: 'Gemeinschaftsflächen', subtitle: 'Räume & Orte', parent: null }
  if (pathname.endsWith('/gaesteappartement')) return { title: 'Gästeappartement', subtitle: 'Sheridan Park & Junia', parent: '/intern/raumbuchungen' }
  if (pathname.endsWith('/gemeinschaftsraum')) return { title: 'Gemeinschaftsraum', subtitle: 'Sheridan Park & Junia', parent: '/intern/raumbuchungen' }
  return { title: 'Sheridan Quartier', subtitle: 'Augsburg', parent: '/' }
}

export default function MobileAppHeader({ isLoggedIn = false }: MobileAppHeaderProps) {
  const pathname = usePathname()
  const screen = getScreen(pathname)
  const isInternal = pathname.startsWith('/intern')

  return (
    <header className="app-header md:hidden">
      <div className="grid h-14 grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 px-4">
        <div className="flex items-center justify-start">
          {screen.parent ? (
            <Link
              href={screen.parent}
              className="app-header-button"
              aria-label="Zurück"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m14.5 6-6 6 6 6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <Link href="/" className="app-mark" aria-label="Sheridan Quartier Startseite">
              <span />
              <span />
              <span />
            </Link>
          )}
        </div>

        <div className="min-w-0 text-center">
          <div className="truncate text-[15px] font-semibold leading-[1.1] tracking-[-0.015em] text-[var(--app-ios-ink)]">
            {screen.title}
          </div>
          <div className="mt-0.5 truncate text-[10px] font-medium leading-none text-[var(--app-ios-muted)]">
            {screen.subtitle}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href={isLoggedIn ? '/intern/dashboard' : '/login'}
            className={`app-header-button relative ${isInternal ? '!bg-[var(--app-ios-accent)] !text-white' : ''}`}
            aria-label={isLoggedIn ? 'Interner Bereich' : 'Anmelden'}
          >
            <AppIcon name={isLoggedIn ? 'people' : 'lock'} className="h-[18px] w-[18px]" />
            {isLoggedIn && !isInternal && (
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#f8f8fa] bg-[#34c759]" />
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
