import { describe, expect, it } from 'vitest'
import { getAdminAccess } from '@/lib/auth/admin'

describe('getAdminAccess', () => {
  it('uses only app_metadata for admin authorization', () => {
    const access = getAdminAccess({
      app_metadata: {},
      user_metadata: {
        role: 'superadmin',
        community: 'wogenau',
      },
    } as never)

    expect(access.role).toBeNull()
    expect(access.isSuperadmin).toBe(false)
    expect(access.isCommunityAdmin).toBe(false)
  })

  it('accepts valid admin rights from app_metadata', () => {
    const access = getAdminAccess({
      app_metadata: {
        role: 'community_admin',
        community: 'wogenau',
      },
      user_metadata: {},
    } as never)

    expect(access.role).toBe('community_admin')
    expect(access.community).toBe('wogenau')
    expect(access.isCommunityAdmin).toBe(true)
  })
})
