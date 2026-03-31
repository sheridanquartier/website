import { cookies } from 'next/headers'
import { verifyCookie } from '@/lib/auth/cookies'

interface InternalCookiePayload {
  authenticated?: boolean
  sid?: string
  ownerId?: string
}

async function readPayload(cookieName: string): Promise<InternalCookiePayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(cookieName)?.value

  if (!token) {
    return null
  }

  return await verifyCookie(token) as InternalCookiePayload | null
}

export async function getInternalSession() {
  const payload = await readPayload('quartier_session')

  if (!payload?.authenticated || !payload.sid) {
    return null
  }

  return payload
}

export async function getInternalOwner() {
  const payload = await readPayload('quartier_owner')

  if (!payload?.ownerId) {
    return null
  }

  return payload.ownerId
}
