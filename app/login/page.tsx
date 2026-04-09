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
    <div className="min-h-screen px-6 pt-20 pb-12">
      <div className="container-custom max-w-5xl">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow mb-5">Für Bewohnerinnen und Bewohner</span>
              <h1 className="max-w-[10ch]">Interner Bereich</h1>
              <p className="max-w-[46ch] text-[17px] leading-[1.8] text-[var(--muted)]">
                Schwarzes Brett, Skills, Verleihpool, Kalender und Raumbuchungen an einem Ort.
                Das gemeinsame Passwort ist nur für Bewohner gedacht.
              </p>
            </div>

            <div className="editorial-panel p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Passwort eingeben"
                required
                autoFocus
              />
              <p className="mt-2 text-[13px] text-[var(--muted)]">
                Wenn Sie das Passwort nicht kennen, wenden Sie sich bitte an Ihre Hausgemeinschaft.
              </p>
            </div>

            {error && (
              <div className="bg-[#ff3b30]/10 border border-[#ff3b30] text-[#ff3b30] px-4 py-3 rounded-xl text-[14px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Wird geprüft...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7] text-center">
            <p className="text-[14px] text-[#6e6e73]">
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
