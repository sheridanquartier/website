import { NextRequest, NextResponse } from 'next/server'

/**
 * Logout-Endpoint für internen Bereich
 * Löscht Cookie und leitet zu Startseite weiter
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url))

  response.cookies.set('quartier_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })

  response.cookies.set('quartier_owner', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })

  return response
}
