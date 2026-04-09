import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Logout-Endpoint für Admin-Bereich
 * Meldet User bei Supabase ab und leitet zu Login weiter
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/admin/login', request.url))
}
