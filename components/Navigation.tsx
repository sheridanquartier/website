'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { COMMUNITIES } from '@/lib/constants'
import type { CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

interface NavigationProps {
  isLoggedIn?: boolean
}

export default function Navigation({ isLoggedIn = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [projekteOpen, setProjekteOpen] = useState(false)
  const [communityName, setCommunityName] = useState<string>('')
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')
  const isInternArea = pathname.startsWith('/intern')
  const isAdminArea = pathname.startsWith('/admin')
  const isHomePage = pathname === '/'
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', exact: true },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/schwarzes-brett', label: 'Schwarzes Brett' },
    { href: '/admin/skills', label: 'Skills' },
    { href: '/admin/verleihpool', label: 'Verleihpool' },
    { href: '/admin/kalender', label: 'Kalender' },
  ]

  // Get community name for admin
  useEffect(() => {
    if (isAdminArea) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        const access = getAdminAccess(data.user)
        const community = access.community as CommunityId | null
        if (access.isSuperadmin) {
          setCommunityName('Superadmin')
        } else if (community && COMMUNITIES[community]) {
          setCommunityName(COMMUNITIES[community].name)
        } else {
          setCommunityName('') // Fallback wenn keine Community gefunden
        }
      }).catch((error) => {
        console.error('Error loading community name:', error)
        setCommunityName('') // Fallback bei Fehler
      })
    }
  }, [isAdminArea])

  // Admin-Navigation
  if (isAdminArea) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[var(--line)] bg-[rgba(252,255,251,0.88)] backdrop-blur-[20px]">
        <div className="container-custom h-full">
          <div className="flex justify-between items-center gap-4 h-full">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="text-[15px] font-medium text-[var(--ink)] whitespace-nowrap">
                Sheridan Quartier
              </Link>
              <span className="text-[var(--line)] text-[13px]">|</span>
              <span className="text-[13px] font-medium text-[var(--muted)] truncate">
                Admin{communityName ? ` — ${communityName}` : ''}
              </span>
            </div>

            <div className="hidden xl:flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-[rgba(230,241,231,0.9)] p-1">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-full text-[12px] font-medium transition-colors ${
                      link.exact
                        ? isActive(link.href) && pathname === link.href
                          ? 'bg-white text-[var(--surface-deep)] shadow-sm'
                          : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'
                        : isActive(link.href)
                          ? 'bg-white text-[var(--surface-deep)] shadow-sm'
                          : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="px-3 py-2 rounded-full text-[12px] font-medium text-[var(--muted)] hover:bg-[rgba(230,241,231,0.9)] hover:text-[var(--ink)] transition-colors"
              >
                Abmelden
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Menü öffnen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="xl:hidden absolute top-14 left-0 right-0 bg-[rgba(252,255,251,0.97)] backdrop-blur-[20px] border-b border-[var(--line)] py-4 px-6">
              <div className="space-y-5">
                <div>
                  <div className="space-y-2">
                    {adminLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block text-[13px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  className="block text-left text-[13px] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Abmelden
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Öffentliche Navigation + optionale zweite Leiste
  return (
    <>
      {/* Hauptnavigation (immer sichtbar) */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-[var(--line)] bg-[rgba(252,255,251,0.88)] backdrop-blur-[20px]">
        <div className="container-custom h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="min-w-0">
              <div className="text-[16px] font-semibold text-[var(--ink)] leading-none">
                Sheridan Quartier
              </div>
              <div className="hidden lg:block mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">
                Drei Gemeinschaften im Sheridanpark
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[rgba(251,248,241,0.8)] p-1">
                <Link
                  href="/quartier"
                  className={`px-3 py-2 rounded-full text-[13px] font-medium transition-colors ${isActive('/quartier') ? 'bg-white text-[var(--surface-deep)] shadow-sm' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Quartier
                </Link>
              {/* Projekte Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProjekteOpen(!projekteOpen)}
                    onBlur={() => setTimeout(() => setProjekteOpen(false), 200)}
                    className={`px-3 py-2 rounded-full text-[13px] font-medium transition-colors ${isActive('/projekte') ? 'bg-white text-[var(--surface-deep)] shadow-sm' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                  >
                    Projekte
                  </button>
                  {projekteOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 rounded-[24px] border border-[var(--line)] bg-[rgba(252,255,251,0.97)] py-2 shadow-[0_16px_36px_rgba(38,82,62,0.08)] backdrop-blur-[20px]">
                      <Link
                        href="/projekte/sheridan-junia"
                        className="block px-4 py-3 text-[14px] text-[var(--ink)] hover:bg-[rgba(230,241,231,0.75)]"
                      >
                        Sheridan Park & Junia
                      </Link>
                      <Link
                        href="/projekte/wagnisshare"
                        className="block px-4 py-3 text-[14px] text-[var(--ink)] hover:bg-[rgba(230,241,231,0.75)]"
                      >
                        wagnisSHARE
                      </Link>
                      <Link
                        href="/projekte/wogenau"
                        className="block px-4 py-3 text-[14px] text-[var(--ink)] hover:bg-[rgba(230,241,231,0.75)]"
                      >
                        WOGENAU
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/neuigkeiten"
                  className={`px-3 py-2 rounded-full text-[13px] font-medium transition-colors ${isActive('/neuigkeiten') ? 'bg-white text-[var(--surface-deep)] shadow-sm' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Neuigkeiten
                </Link>
              </div>

              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="btn-primary text-[14px] px-4 py-2"
                >
                  Interner Bereich
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Menü öffnen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-12 left-0 right-0 border-b border-[var(--line)] bg-[rgba(252,255,251,0.97)] py-4 px-6 backdrop-blur-[20px]">
              <div className="space-y-4">
                <Link href="/quartier" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                  Quartier
                </Link>
                <div>
                  <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Projekte</p>
                  <div className="space-y-2 pl-4">
                    <Link href="/projekte/sheridan-junia" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                      Sheridan Park & Junia
                    </Link>
                    <Link href="/projekte/wagnisshare" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                      wagnisSHARE
                    </Link>
                    <Link href="/projekte/wogenau" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                      WOGENAU
                    </Link>
                  </div>
                </div>
                <Link href="/neuigkeiten" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                  Neuigkeiten
                </Link>

                {!isLoggedIn ? (
                  <Link href="/login" className="block text-[14px] text-[var(--surface-deep)]">
                    Interner Bereich
                  </Link>
                ) : (
                  <>
                    <div className="mt-4 border-t border-[var(--line)] pt-4">
                      <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Interner Bereich</p>
                      <div className="space-y-2 pl-4">
                        <Link href="/intern/dashboard" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Dashboard
                        </Link>
                        <Link href="/intern/schwarzes-brett" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Schwarzes Brett
                        </Link>
                        <Link href="/intern/skills" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Skills
                        </Link>
                        <Link href="/intern/verleihpool" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Verleihpool
                        </Link>
                        <Link href="/intern/kalender" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Kalender
                        </Link>
                        <Link href="/intern/raumbuchungen" className="block text-[14px] text-[var(--ink)] hover:text-[var(--surface-deep)]">
                          Raumbuchungen
                        </Link>
                        <form action="/api/auth/logout" method="POST">
                          <button type="submit" className="block text-[14px] text-[var(--muted)] hover:text-[var(--ink)]">
                            Abmelden
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Zweite Navigation (nur im internen Bereich) */}
      {isLoggedIn && (
        <div className="fixed top-12 left-0 right-0 z-40 h-10 border-b border-[var(--line)] bg-[rgba(230,241,231,0.82)]">
          <div className="container-custom h-full">
            {/* Desktop: normale horizontale Liste */}
            <div className="hidden md:flex items-center justify-between h-full">
              <div className="flex items-center gap-6">
                <Link
                  href="/intern/dashboard"
                  className={`text-[14px] transition-colors ${isActive('/intern/dashboard') && pathname === '/intern/dashboard' ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/intern/schwarzes-brett"
                  className={`text-[14px] transition-colors ${isActive('/intern/schwarzes-brett') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Schwarzes Brett
                </Link>
                <Link
                  href="/intern/skills"
                  className={`text-[14px] transition-colors ${isActive('/intern/skills') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Skills
                </Link>
                <Link
                  href="/intern/verleihpool"
                  className={`text-[14px] transition-colors ${isActive('/intern/verleihpool') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Verleihpool
                </Link>
                <Link
                  href="/intern/kalender"
                  className={`text-[14px] transition-colors ${isActive('/intern/kalender') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Kalender
                </Link>
                <Link
                  href="/intern/raumbuchungen"
                  className={`text-[14px] transition-colors ${isActive('/intern/raumbuchungen') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)] hover:text-[var(--surface-deep)]'}`}
                >
                  Raumbuchungen
                </Link>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-[12px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                  Abmelden
                </button>
              </form>
            </div>

            {/* Mobile: horizontal scrollbar */}
            <div className="md:hidden flex items-center h-full overflow-x-auto whitespace-nowrap gap-6 px-6">
              <Link
                href="/intern/dashboard"
                className={`text-[14px] transition-colors ${isActive('/intern/dashboard') && pathname === '/intern/dashboard' ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Dashboard
              </Link>
              <Link
                href="/intern/schwarzes-brett"
                className={`text-[14px] transition-colors ${isActive('/intern/schwarzes-brett') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Schwarzes Brett
              </Link>
              <Link
                href="/intern/skills"
                className={`text-[14px] transition-colors ${isActive('/intern/skills') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Skills
              </Link>
              <Link
                href="/intern/verleihpool"
                className={`text-[14px] transition-colors ${isActive('/intern/verleihpool') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Verleihpool
              </Link>
              <Link
                href="/intern/kalender"
                className={`text-[14px] transition-colors ${isActive('/intern/kalender') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Kalender
              </Link>
              <Link
                href="/intern/raumbuchungen"
                className={`text-[14px] transition-colors ${isActive('/intern/raumbuchungen') ? 'text-[var(--surface-deep)]' : 'text-[var(--ink)]'}`}
              >
                Raumbuchungen
              </Link>
              <form action="/api/auth/logout" method="POST" className="inline">
                <button type="submit" className="text-[12px] text-[var(--muted)]">
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
