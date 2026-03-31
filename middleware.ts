import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyCookie } from '@/lib/auth/cookies'

/**
 * Next.js Middleware für Auth-Checks
 * Schützt /intern/* Routen mit Cookie-basierter Auth
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Schutz für /intern/* Routen
  if (pathname.startsWith('/intern')) {
    const cookie = request.cookies.get('quartier_session')

    if (!cookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = await verifyCookie(cookie.value)

    if (!payload) {
      // Cookie ist ungültig oder abgelaufen
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('quartier_session')
      return response
    }

    // Cookie ist valide, Request durchlassen
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/intern/:path*']
}
