'use client'

import { useState } from 'react'
export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login fehlgeschlagen')
        setLoading(false)
        return
      }

      // Hard Redirect für vollständigen Page-Reload (Navigation wird neu geladen)
      window.location.href = '/intern/dashboard'
    } catch (err) {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-20 md:px-6 md:pb-12">
      <div className="container-custom max-w-5xl">
        <div className="section-shell overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
            <div>
              <span className="eyebrow mb-5">Für Bewohnerinnen und Bewohner</span>
              <h1 className="max-w-[10ch]">Interner Bereich</h1>
              <p className="max-w-[46ch] text-[16px] leading-[1.75] text-[var(--muted)] md:text-[17px] md:leading-[1.8]">
                Schwarzes Brett, Skills, Verleihpool, Kalender und Raumbuchungen an einem Ort.
                Das gemeinsame Passwort ist nur für Bewohner gedacht.
              </p>
            </div>

            <div className="editorial-panel p-4 md:p-8">
              <div className="mb-5 rounded-[24px] border border-[var(--line)] bg-white/74 px-4 py-4 md:hidden">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  App-Zugang
                </p>
                <p className="mb-0 text-[14px] leading-[1.55] text-[var(--ink)]">
                  Mit dem Passwort öffnen Sie alle internen Bereiche direkt auf dem Handy.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Passwort eingeben"
                    required
                    autoFocus
                  />
                  <p className="mt-2 text-[13px] text-[var(--muted)]">
                    Wenn Sie das Passwort nicht kennen, wenden Sie sich bitte an Ihre Hausgemeinschaft.
                  </p>
                </div>

                {error && (
                  <div className="rounded-[20px] border border-[#ff3b30] bg-[#ff3b30]/10 px-4 py-3 text-[14px] text-[#ff3b30]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full min-h-[56px] rounded-[20px] text-[15px]"
                >
                  {loading ? 'Wird geprüft...' : 'Anmelden'}
                </button>
              </form>

              <div className="mt-6 border-t border-[#d2d2d7] pt-5 text-left md:mt-8 md:pt-6 md:text-center">
                <p className="mb-0 text-[13px] leading-[1.6] text-[#6e6e73] md:text-[14px]">
                  Nur für den internen Bewohnerbereich. Der Projekt-Admin meldet sich separat im Admin-Bereich an.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
