import { NextRequest, NextResponse } from 'next/server'
import { signCookie } from '@/lib/auth/cookies'
import { consumeRateLimit, getClientIp, resetRateLimit } from '@/lib/security/rateLimit'

/**
 * Login-Endpoint für internen Bereich
 * Prüft Passwort und setzt signiertes Cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const ip = getClientIp(request.headers)
    const rateLimitKey = `internal-login:${ip}`
    const rateLimit = consumeRateLimit(rateLimitKey, { windowMs: 15 * 60 * 1000, max: 10 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      )
    }

    // Passwort-Vergleich
    if (password !== process.env.INTERNAL_PASSWORD) {
      return NextResponse.json(
        { error: 'Falsches Passwort' },
        { status: 401 }
      )
    }

    const ownerId = crypto.randomUUID()
    const sid = crypto.randomUUID()

    // Cookie signieren
    const token = await signCookie({
      authenticated: true,
      sid,
      ownerId,
      timestamp: Date.now()
    })

    const ownerToken = await signCookie({
      ownerId,
      timestamp: Date.now()
    })

    // Response mit Cookie
    const response = NextResponse.json({ success: true })

    response.cookies.set('quartier_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 90, // 90 Tage
      path: '/'
    })

    response.cookies.set('quartier_owner', ownerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 90,
      path: '/'
    })

    resetRateLimit(rateLimitKey)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
