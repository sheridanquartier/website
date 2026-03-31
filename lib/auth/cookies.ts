import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.COOKIE_SECRET!)

export interface SignedCookiePayload extends jose.JWTPayload {
  authenticated?: boolean
  sid?: string
  ownerId?: string
}

/**
 * Signiert ein Cookie-Payload mit JWT
 */
export async function signCookie(payload: SignedCookiePayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('90d') // 90 Tage wie maxAge
    .setIssuedAt()
    .sign(SECRET)
}

/**
 * Verifiziert und dekodiert ein signiertes Cookie
 */
export async function verifyCookie(token: string): Promise<SignedCookiePayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET)
    return payload as SignedCookiePayload
  } catch (error) {
    return null
  }
}
