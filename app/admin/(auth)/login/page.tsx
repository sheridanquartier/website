'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Anmeldung fehlgeschlagen')
        setLoading(false)
        return
      }

      // Erfolg - Hard Redirect für vollständigen Page-Reload
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white px-4 pb-24 pt-20 md:pb-12">
      <div className="container-custom max-w-5xl">
        <div className="section-shell overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
            <div>
              <span className="eyebrow mb-5">Projektverwaltung</span>
              <h1 className="max-w-[9ch]">Admin-Bereich</h1>
              <p className="max-w-[44ch] text-[16px] leading-[1.75] text-[var(--muted)] md:text-[17px] md:leading-[1.8]">
                Zugang für Community-Admins und Superadmin. Bitte melden Sie sich mit Ihrem
                Admin-Benutzernamen an, nicht mit dem normalen Bewohnerzugang.
              </p>
            </div>

            <div className="editorial-panel p-4 md:p-8">
              <div className="mb-5 rounded-[24px] border border-[var(--line)] bg-white/74 px-4 py-4 md:hidden">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Admin-Zugang
                </p>
                <p className="mb-0 text-[14px] leading-[1.55] text-[var(--ink)]">
                  Bitte mit Admin-Benutzername anmelden, nicht mit dem normalen Bewohnerzugang.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.06em] text-[#1d1d1f]">
                    Benutzername
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input min-h-[56px] rounded-[20px] text-[17px]"
                    placeholder="WagnisShare"
                    required
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.06em] text-[#1d1d1f]">
                    Passwort
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input min-h-[56px] rounded-[20px] text-[17px]"
                    placeholder="Passwort"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full min-h-[56px] rounded-[20px] text-[15px]"
                >
                  {loading ? 'Wird angemeldet...' : 'Anmelden'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
