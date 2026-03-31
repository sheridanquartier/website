import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Logout-Endpoint für Admin-Bereich
 * Meldet User bei Supabase ab und leitet zu Login weiter
 */
export async function POST() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
}
