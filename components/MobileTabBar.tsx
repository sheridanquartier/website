'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AppIcon from '@/components/AppIcon'

interface MobileTabBarProps {
  isLoggedIn?: boolean
}

interface TabItem {
  href?: string
  label: string
  icon: 'home' | 'map' | 'news' | 'lock' | 'people' | 'board' | 'lend' | 'calendar' | 'more'
  match?: string
  action?: 'more'
}

function TabContent({ label, icon, active }: Pick<TabItem, 'label' | 'icon'> & { active: boolean }) {
  return (
    <>
      <span className={`relative flex h-7 w-10 items-center justify-center rounded-full transition-all duration-200 ${
        active ? 'bg-[#dce9df] text-[#1f5948]' : 'text-[#6f7a73]'
      }`}>
        <AppIcon name={icon} className="h-[20px] w-[20px]" />
      </span>
      <span className={`text-[10px] font-semibold leading-none ${active ? 'text-[#1f5948]' : 'text-[#6f7a73]'}`}>
        {label}
      </span>
    </>
  )
}

export default function MobileTabBar({ isLoggedIn = false }: MobileTabBarProps) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const isInternal = pathname.startsWith('/intern')

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [moreOpen])

  if (pathname.startsWith('/admin')) {
    return null
  }

  const publicTabs: TabItem[] = [
    { href: '/', label: 'Start', icon: 'home', match: '/' },
    { href: '/quartier', label: 'Karte', icon: 'map', match: '/quartier' },
    { href: '/neuigkeiten', label: 'Aktuell', icon: 'news', match: '/neuigkeiten' },
    {
      href: isLoggedIn ? '/intern/dashboard' : '/login',
      label: isLoggedIn ? 'Intern' : 'Login',
      icon: isLoggedIn ? 'people' : 'lock',
      match: isLoggedIn ? '/intern' : '/login',
    },
    { label: 'Mehr', icon: 'more', action: 'more' },
  ]

  const internalTabs: TabItem[] = [
    { href: '/intern/dashboard', label: 'Start', icon: 'home', match: '/intern/dashboard' },
    { href: '/intern/schwarzes-brett', label: 'Brett', icon: 'board', match: '/intern/schwarzes-brett' },
    { href: '/intern/verleihpool', label: 'Leihen', icon: 'lend', match: '/intern/verleihpool' },
    { href: '/intern/kalender', label: 'Kalender', icon: 'calendar', match: '/intern/kalender' },
    { label: 'Mehr', icon: 'more', action: 'more' },
  ]

  const tabs = isInternal ? internalTabs : publicTabs
  const publicMenu = [
    { href: '/projekte/sheridan-junia', title: 'Sheridan Park & Junia', icon: 'projects' as const },
    { href: '/projekte/wagnisshare', title: 'wagnisSHARE', icon: 'projects' as const },
    { href: '/projekte/wogenau', title: 'WOGENAU', icon: 'projects' as const },
    { href: '/impressum', title: 'Impressum', icon: 'news' as const },
    { href: '/datenschutz', title: 'Datenschutz', icon: 'lock' as const },
  ]
  const internalMenu = [
    { href: '/intern/skills', title: 'Skillpool', subtitle: 'Wissen anbieten und finden', icon: 'skills' as const },
    { href: '/intern/raumbuchungen', title: 'Gemeinschaftsflächen', subtitle: 'Geteilte Räume und Flächen', icon: 'rooms' as const },
    { href: '/neuigkeiten', title: 'Neuigkeiten', subtitle: 'Öffentliche Beiträge', icon: 'news' as const },
    { href: '/quartier', title: 'Quartierskarte', subtitle: 'Orte und Projekte', icon: 'map' as const },
  ]

  return (
    <>
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-[#102b24]/35 backdrop-blur-[2px]"
            onClick={() => setMoreOpen(false)}
            aria-label="Menü schließen"
          />
          <div className="app-sheet">
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[#c8cfca]" />
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="app-kicker">{isInternal ? 'Interner Bereich' : 'Sheridan Quartier'}</p>
                <h2 className="mb-0 font-sans text-[25px] font-bold leading-[1.1] tracking-[-0.035em]">
                  {isInternal ? 'Weitere Bereiche' : 'Entdecken'}
                </h2>
              </div>
              <button type="button" onClick={() => setMoreOpen(false)} className="app-header-button" aria-label="Menü schließen">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="m7 7 10 10M17 7 7 17" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] bg-white/80">
              {(isInternal ? internalMenu : publicMenu).map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 border-b border-[var(--line)] p-4 last:border-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#e4ece6] text-[#285849]">
                    <AppIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-bold tracking-[-0.015em]">{item.title}</span>
                    {'subtitle' in item && item.subtitle && (
                      <span className="mt-0.5 block text-[11px] text-[var(--muted)]">{item.subtitle}</span>
                    )}
                  </span>
                  <svg className="h-4 w-4 text-[#8a958e]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>

            {isInternal && (
              <form action="/api/auth/logout" method="POST" className="mt-4">
                <button type="submit" className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#efe4dc] text-[13px] font-bold text-[#914b33]">
                  <AppIcon name="logout" className="h-[18px] w-[18px]" />
                  Abmelden
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <nav className="app-tabbar md:hidden" aria-label="App-Navigation">
        <div className="mx-auto grid max-w-[31rem] grid-cols-5">
          {tabs.map((tab) => {
            const active = tab.action === 'more'
              ? moreOpen
              : tab.match === '/'
                ? pathname === '/'
                : pathname.startsWith(tab.match || '')

            if (tab.action === 'more') {
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className="app-tab"
                  aria-expanded={moreOpen}
                >
                  <TabContent label={tab.label} icon={tab.icon} active={active} />
                </button>
              )
            }

            return (
              <Link key={tab.label} href={tab.href || '/'} className="app-tab">
                <TabContent label={tab.label} icon={tab.icon} active={active} />
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
