import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAdminAccess } from '@/lib/auth/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const access = getAdminAccess(user)

  if (!user) {
    redirect('/admin/login')
  }

  if (!access.role) {
    redirect('/admin/login')
  }

  return <div className="bg-warm-white min-h-screen">{children}</div>
}
