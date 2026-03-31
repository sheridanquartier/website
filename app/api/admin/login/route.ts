import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminAccess } from '@/lib/auth/admin'
import { findAdminByUsername, toAdminLoginIdentity } from '@/lib/auth/adminUsernames'
import { consumeRateLimit, getClientIp, resetRateLimit } from '@/lib/security/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const normalizedUsername = typeof username === 'string' ? username.trim().toLowerCase() : ''
    const ip = getClientIp(request.headers)
    const rateLimitKey = `admin-login:${ip}:${normalizedUsername || 'unknown'}`
    const rateLimit = consumeRateLimit(rateLimitKey, { windowMs: 15 * 60 * 1000, max: 5 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      )
    }

    const adminConfig = findAdminByUsername(normalizedUsername)
    if (!adminConfig || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: toAdminLoginIdentity(adminConfig.loginKey),
      password,
    })

    if (error) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const access = getAdminAccess(data.user)
    if (!access.role) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    resetRateLimit(rateLimitKey)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
