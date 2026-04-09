import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'
import { validatePostPayload } from '@/lib/security/internalContent'

export async function POST(request: NextRequest) {
  const session = await getInternalSession()
  const ownerId = await getInternalOwner()

  if (!session || !ownerId) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const body = validatePostPayload(await request.json())
  if (!body.success) {
    return NextResponse.json({ error: body.error }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...body.data,
      creator_session_id: ownerId,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ id: data.id })
}
