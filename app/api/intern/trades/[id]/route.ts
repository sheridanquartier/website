import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'
import { validateTradePayload } from '@/lib/security/internalContent'

async function assertOwnership(id: string) {
  const session = await getInternalSession()
  const ownerId = await getInternalOwner()

  if (!session || !ownerId) {
    return { error: NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 }) }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('trades')
    .select('id, creator_session_id')
    .eq('id', id)
    .single()

  if (error || !data) {
    return { error: NextResponse.json({ error: 'Eintrag nicht gefunden' }, { status: 404 }) }
  }

  if (!data.creator_session_id || data.creator_session_id !== ownerId) {
    return { error: NextResponse.json({ error: 'Keine Berechtigung für diesen Eintrag' }, { status: 403 }) }
  }

  return { supabase }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const access = await assertOwnership(params.id)
  if ('error' in access) {
    return access.error
  }

  const body = validateTradePayload(await request.json())
  if (!body.success) {
    return NextResponse.json({ error: body.error }, { status: 400 })
  }

  const { error } = await access.supabase
    .from('trades')
    .update(body.data)
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const access = await assertOwnership(params.id)
  if ('error' in access) {
    return access.error
  }

  const { error } = await access.supabase
    .from('trades')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
