import type { User } from '@supabase/supabase-js'
import type { CommunityId } from '@/lib/constants'

export type AdminRole = 'community_admin' | 'superadmin'

export interface AdminAccess {
  role: AdminRole | null
  community: CommunityId | null
  isSuperadmin: boolean
  isCommunityAdmin: boolean
}

export function getAdminAccess(user: User | null): AdminAccess {
  const appMeta = user?.app_metadata ?? {}
  const userMeta = user?.user_metadata ?? {}

  const role = (appMeta.role || userMeta.role || null) as AdminRole | null
  const community = (appMeta.community || userMeta.community || null) as CommunityId | null

  if (role === 'superadmin') {
    return {
      role,
      community,
      isSuperadmin: true,
      isCommunityAdmin: false,
    }
  }

  if (community) {
    return {
      role: 'community_admin',
      community,
      isSuperadmin: false,
      isCommunityAdmin: true,
    }
  }

  return {
    role: null,
    community: null,
    isSuperadmin: false,
    isCommunityAdmin: false,
  }
}
