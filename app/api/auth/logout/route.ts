import { NextResponse } from 'next/server'

/**
 * Logout-Endpoint für internen Bereich
 * Löscht Cookie und leitet zu Startseite weiter
 */
export async function POST() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  response.cookies.delete('quartier_session')
  response.cookies.delete('quartier_owner')

  return response
}
