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
  if (pathname.startsWith('/intern/skills')) return { title: 'Skills', subtitle: 'Wissen teilen', parent: null }
  if (pathname.startsWith('/intern/verleihpool')) return { title: 'Verleihpool', subtitle: 'Gemeinsam nutzen', parent: null }
  if (pathname.startsWith('/intern/kalender')) return { title: 'Kalender', subtitle: 'Was ansteht', parent: null }
  if (pathname.startsWith('/intern/raumbuchungen')) return { title: 'Räume', subtitle: 'Buchen & planen', parent: null }
  return { title: 'Sheridan Quartier', subtitle: 'Augsburg', parent: '/' }
}

export default function MobileAppHeader({ isLoggedIn = false }: MobileAppHeaderProps) {
  const pathname = usePathname()
  const screen = getScreen(pathname)
  const isInternal = pathname.startsWith('/intern')

  return (
    <header className="app-header md:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
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

          <div className="min-w-0">
            <div className="truncate text-[16px] font-bold leading-[1.05] tracking-[-0.025em] text-[var(--ink)]">
              {screen.title}
            </div>
            <div className="mt-1 truncate text-[10px] font-semibold uppercase leading-none tracking-[0.13em] text-[var(--muted)]">
              {screen.subtitle}
            </div>
          </div>
        </div>

        <Link
          href={isLoggedIn ? '/intern/dashboard' : '/login'}
          className={`app-header-button relative ${isInternal ? 'bg-[var(--surface-deep)] text-white' : ''}`}
          aria-label={isLoggedIn ? 'Interner Bereich' : 'Anmelden'}
        >
          <AppIcon name={isLoggedIn ? 'people' : 'lock'} className="h-[19px] w-[19px]" />
          {isLoggedIn && (
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#f5f6f1] bg-[#58a870]" />
          )}
        </Link>
      </div>
    </header>
  )
}
