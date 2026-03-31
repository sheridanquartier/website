import type { CommunityId } from '@/lib/constants'

export interface AdminUsernameConfig {
  username: string
  loginKey: string
  role: 'community_admin' | 'superadmin'
  community: CommunityId | null
}

const ADMIN_LOGIN_DOMAIN = 'quartier-admin.local'

export const ADMIN_USERNAME_CONFIG: AdminUsernameConfig[] = [
  {
    username: 'WagnisShare',
    loginKey: 'wagnisshare',
    role: 'community_admin',
    community: 'wagnisshare',
  },
  {
    username: 'Wogenau',
    loginKey: 'wogenau',
    role: 'community_admin',
    community: 'wogenau',
  },
  {
    username: 'SPuJ',
    loginKey: 'spuj',
    role: 'community_admin',
    community: 'sheridan-junia',
  },
  {
    username: 'Admin',
    loginKey: 'admin',
    role: 'superadmin',
    community: null,
  },
]

export function findAdminByUsername(username: string) {
  const normalized = username.trim().toLowerCase()
  return ADMIN_USERNAME_CONFIG.find((entry) => entry.loginKey === normalized) || null
}

export function toAdminLoginIdentity(loginKey: string) {
  return `${loginKey}@${ADMIN_LOGIN_DOMAIN}`
}
