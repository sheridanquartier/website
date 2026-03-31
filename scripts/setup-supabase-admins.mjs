import { createClient } from '@supabase/supabase-js'

const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Fehlende Umgebungsvariable: ${key}`)
    process.exit(1)
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

const ADMIN_LOGIN_DOMAIN = 'quartier-admin.local'

function readPassword(key) {
  return process.env[key] || process.env.ADMIN_PASSWORD || null
}

const admins = [
  {
    username: 'WagnisShare',
    loginKey: 'wagnisshare',
    password: readPassword('ADMIN_PASSWORD_WAGNISSHARE'),
    app_metadata: {
      role: 'community_admin',
      community: 'wagnisshare',
    },
  },
  {
    username: 'Wogenau',
    loginKey: 'wogenau',
    password: readPassword('ADMIN_PASSWORD_WOGENAU'),
    app_metadata: {
      role: 'community_admin',
      community: 'wogenau',
    },
  },
  {
    username: 'SPuJ',
    loginKey: 'spuj',
    password: readPassword('ADMIN_PASSWORD_SPUJ'),
    app_metadata: {
      role: 'community_admin',
      community: 'sheridan-junia',
    },
  },
  {
    username: 'Admin',
    loginKey: 'admin',
    password: readPassword('ADMIN_PASSWORD_SUPERADMIN'),
    app_metadata: {
      role: 'superadmin',
    },
  },
]

for (const admin of admins) {
  if (!admin.password) {
    console.error(
      `Fehlendes Passwort fuer ${admin.username}. Setze ADMIN_PASSWORD oder ${`ADMIN_PASSWORD_${admin.loginKey.toUpperCase()}`}.`
    )
    process.exit(1)
  }
}

function toLoginIdentity(loginKey) {
  return `${loginKey}@${ADMIN_LOGIN_DOMAIN}`
}

async function listAllUsers() {
  const users = []
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })

    if (error) {
      throw error
    }

    const batch = data?.users || []
    users.push(...batch)

    if (batch.length < 1000) {
      break
    }

    page += 1
  }

  return users
}

async function upsertAdmin(admin) {
  const loginIdentity = toLoginIdentity(admin.loginKey)
  const allUsers = await listAllUsers()
  const existingUser = allUsers.find((user) => user.email === loginIdentity)

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: admin.password,
      email_confirm: true,
      user_metadata: {
        username: admin.username,
      },
      app_metadata: admin.app_metadata,
    })

    if (error) {
      throw error
    }

    console.log(`Aktualisiert: ${admin.username}`)
    return
  }

  const { error } = await supabase.auth.admin.createUser({
    email: loginIdentity,
    password: admin.password,
    email_confirm: true,
    user_metadata: {
      username: admin.username,
    },
    app_metadata: admin.app_metadata,
  })

  if (error) {
    throw error
  }

  console.log(`Erstellt: ${admin.username}`)
}

async function main() {
  for (const admin of admins) {
    await upsertAdmin(admin)
  }

  console.log('')
  console.log('Fertig. Verwendbare Admin-Benutzernamen:')
  for (const admin of admins) {
    console.log(`- ${admin.username}`)
  }
}

main().catch((error) => {
  console.error('Setup fehlgeschlagen:')
  console.error(error.message || error)
  process.exit(1)
})
