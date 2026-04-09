import { NextRequest } from 'next/server'
import { vi } from 'vitest'

export function createJsonRequest(url: string, body: unknown, init: RequestInit = {}) {
  const requestInit: RequestInit = {
    method: init.method ?? 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    } as HeadersInit,
  }

  if (init.cache !== undefined) requestInit.cache = init.cache
  if (init.credentials !== undefined) requestInit.credentials = init.credentials
  if (init.integrity !== undefined) requestInit.integrity = init.integrity
  if (init.keepalive !== undefined) requestInit.keepalive = init.keepalive
  if (init.mode !== undefined) requestInit.mode = init.mode
  if (init.redirect !== undefined) requestInit.redirect = init.redirect
  if (init.referrer !== undefined) requestInit.referrer = init.referrer
  if (init.referrerPolicy !== undefined) requestInit.referrerPolicy = init.referrerPolicy
  if (init.signal !== undefined && init.signal !== null) requestInit.signal = init.signal

  return new NextRequest(url, requestInit as never)
}

export function createQueryChain() {
  const chain: Record<string, unknown> = {}

  chain.select = vi.fn(() => chain)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  chain.delete = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.gt = vi.fn(() => chain)
  chain.in = vi.fn(() => chain)
  chain.order = vi.fn(() => chain)
  chain.single = vi.fn()

  return chain
}

export function createSupabaseMock() {
  const queryChain = createQueryChain()
  const auth = {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
  }

  return {
    queryChain,
    auth,
    supabase: {
      from: vi.fn(() => queryChain),
      auth,
    },
  }
}
