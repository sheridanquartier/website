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
    <>
      <div className="app-screen px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] md:hidden">
        <div className="mx-auto max-w-[28rem]">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#183f36] text-[#f1c895] shadow-[0_14px_30px_rgba(24,63,54,0.2)]">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 10V7.5a4 4 0 0 1 8 0V10M6.5 10h11a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M12 14v2" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <p className="app-kicker">Bewohnerbereich</p>
          <h1 className="mb-3 font-sans text-[32px] font-bold leading-[1.06] tracking-[-0.045em]">
            Willkommen zurück.
          </h1>
          <p className="mb-7 max-w-[32ch] text-[14px] leading-[1.6] text-[var(--muted)]">
            Mit dem gemeinsamen Passwort gelangst du zu Brett, Kalender, Verleihpool und Räumen.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="mobile-password" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
              Passwort
            </label>
            <input
              id="mobile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input min-h-[58px] rounded-[19px] bg-white text-[17px] shadow-[0_12px_28px_rgba(28,64,49,0.06)]"
              placeholder="Passwort eingeben"
              required
              autoFocus
            />

            {error && (
              <div className="mt-3 rounded-[18px] border border-[#c95c50]/25 bg-[#c95c50]/10 px-4 py-3 text-[13px] text-[#a93e34]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-[19px] bg-[#183f36] text-[15px] font-bold text-white shadow-[0_16px_32px_rgba(24,63,54,0.2)] disabled:opacity-60"
            >
              {loading ? 'Wird geprüft...' : 'Mein Quartier öffnen'}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-3 rounded-[20px] bg-[#e7ece4] p-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-[#31594c]">?</span>
            <p className="mb-0 text-[12px] leading-[1.55] text-[var(--muted)]">
              Passwort nicht bekannt? Bitte frag in deiner Hausgemeinschaft nach.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden min-h-screen px-4 pb-24 pt-20 md:block md:px-6 md:pb-12">
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
                    className="btn-primary min-h-[56px] w-full rounded-[20px] text-[15px]"
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
    </>
  )
}
