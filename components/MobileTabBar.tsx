'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileTabBarProps {
  isLoggedIn?: boolean
}

interface TabItem {
  href: string
  label: string
  icon: React.ReactNode
}

function TabLink({ href, label, icon, active }: TabItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-2 text-center transition-colors ${
        active ? 'bg-white text-[var(--surface-deep)] shadow-sm' : 'text-[var(--muted)]'
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="truncate text-[11px] font-semibold leading-none">{label}</span>
    </Link>
  )
}

export default function MobileTabBar({ isLoggedIn = false }: MobileTabBarProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return null
  }

  const internalTabs: TabItem[] = [
    {
      href: '/intern/dashboard',
      label: 'Start',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13V10.5" /></svg>,
    },
    {
      href: '/intern/schwarzes-brett',
      label: 'Brett',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 5h12a1 1 0 0 1 1 1v12H5V6a1 1 0 0 1 1-1Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 9h8M8 13h5" /></svg>,
    },
    {
      href: '/intern/skills',
      label: 'Skills',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14 7a3 3 0 1 1 3 3h-2l-8 8a2 2 0 1 1-2-2l8-8V7Z" /></svg>,
    },
    {
      href: '/intern/kalender',
      label: 'Kalender',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 3v3M17 3v3M4.5 9.5h15M6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 6 5Z" /></svg>,
    },
    {
      href: '/intern/raumbuchungen',
      label: 'Räume',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 20V7.5A1.5 1.5 0 0 1 5.5 6H11v14M11 4h7.5A1.5 1.5 0 0 1 20 5.5V20M8 10h0M8 14h0M15.5 10h0M15.5 14h0" /></svg>,
    },
  ]

  const publicTabs: TabItem[] = [
    {
      href: '/',
      label: 'Start',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13V10.5" /></svg>,
    },
    {
      href: '/quartier',
      label: 'Quartier',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" /><circle cx="12" cy="11" r="2.5" strokeWidth="1.8" /></svg>,
    },
    {
      href: '/neuigkeiten',
      label: 'News',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 6.5A1.5 1.5 0 0 1 6.5 5H18v12.5A1.5 1.5 0 0 1 16.5 19H8a3 3 0 0 1-3-3V6.5Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 9h7M8 12h7M8 15h4" /></svg>,
    },
    {
      href: isLoggedIn ? '/intern/dashboard' : '/login',
      label: isLoggedIn ? 'Intern' : 'Login',
      icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 8V6.5A3.5 3.5 0 0 0 11.5 3 3.5 3.5 0 0 0 8 6.5V8M7 8h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /></svg>,
    },
  ]

  const tabs = isLoggedIn ? internalTabs : publicTabs

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[60] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[30rem] items-stretch gap-1 rounded-[28px] border border-[rgba(31,77,67,0.12)] bg-[rgba(251,248,241,0.95)] p-2 shadow-[0_-12px_40px_rgba(31,77,67,0.12)] backdrop-blur-[20px]">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          return <TabLink key={tab.href} {...tab} active={active} />
        })}
      </div>
    </div>
  )
}
