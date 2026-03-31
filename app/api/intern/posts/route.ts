import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getInternalOwner, getInternalSession } from '@/lib/auth/internal'

export async function POST(request: NextRequest) {
  const session = await getInternalSession()
  const ownerId = await getInternalOwner()

  if (!session || !ownerId) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const body = await request.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      offer: body.offer ?? null,
      seek: body.seek ?? null,
      community: body.community,
      contact_name: body.contact_name,
      contact_info: body.contact_info,
      expires_at: body.expires_at,
      image_url: body.image_url ?? null,
      creator_session_id: ownerId,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ id: data.id })
}
