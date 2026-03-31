'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    <div className="min-h-screen flex items-center justify-center px-6 pt-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="mb-4">Interner Bereich</h1>
          <p className="text-[17px] text-[#6e6e73] content-width mx-auto">
            Bitte geben Sie das Passwort ein, um Zugang zum internen Bereich zu erhalten.
          </p>
        </div>

        <div className="bg-white border border-[#d2d2d7] rounded-[18px] p-8">
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
              Sie kennen das Passwort nicht?<br />
              Bitte wenden Sie sich an Ihre Nachbarschaft.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
