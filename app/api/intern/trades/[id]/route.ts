import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'

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

  const body = await request.json()
  const { error } = await access.supabase
    .from('trades')
    .update({
      title: body.title,
      description: body.description,
      type: body.type,
      offer: body.offer ?? null,
      seek: body.seek ?? null,
      image_url: body.image_url ?? null,
      community: body.community,
      contact_name: body.contact_name,
      contact_info: body.contact_info,
      expires_at: body.expires_at,
    })
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
