import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import { formatDateLong } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'
import { COMMUNITIES } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const access = getAdminAccess(user)
  const community = access.community as CommunityId | null

  // Nächste 3 Events
  let eventsQuery = supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(3)

  if (!access.isSuperadmin && community) {
    eventsQuery = eventsQuery.eq('community', community)
  }

  const { data: events } = await eventsQuery

  // Letzte 3 Blog-Posts
  let postsQuery = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (!access.isSuperadmin && community) {
    postsQuery = postsQuery.eq('community', community)
  }

  const { data: posts } = await postsQuery

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Hallo, {access.isSuperadmin ? 'Superadmin' : (community ? COMMUNITIES[community]?.name : 'Admin')}</h1>
          <p className="text-[17px] text-[#6e6e73]">Verwalten Sie die Bereiche Ihrer Gemeinschaft</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Link href="/admin/schwarzes-brett">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#0071e3]">
              <h3 className="text-[20px] font-medium mb-2">Schwarzes Brett verwalten</h3>
              <p className="text-[14px] text-[#6e6e73]">Angebote, Gesuche und Tauschangebote moderieren</p>
            </div>
          </Link>

          <Link href="/admin/kalender">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#0071e3]">
              <h3 className="text-[20px] font-medium mb-2">Kalender verwalten</h3>
              <p className="text-[14px] text-[#6e6e73]">Events erstellen und bearbeiten</p>
            </div>
          </Link>

          <Link href="/admin/blog">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#0071e3]">
              <h3 className="text-[20px] font-medium mb-2">Blog verwalten</h3>
              <p className="text-[14px] text-[#6e6e73]">Beiträge verfassen und veröffentlichen</p>
            </div>
          </Link>

          <Link href="/admin/verleihpool">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#0071e3]">
              <h3 className="text-[20px] font-medium mb-2">Verleihpool verwalten</h3>
              <p className="text-[14px] text-[#6e6e73]">Artikel hinzufügen und bearbeiten</p>
            </div>
          </Link>
        </div>

        {/* Nächste Events */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nächste Events</h2>
            <Link href="/admin/kalender" className="text-sheridan-blue hover:underline">
              Alle ansehen →
            </Link>
          </div>

          {!events || events.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">Keine kommenden Events</p>
              <Link href="/admin/kalender" className="btn-primary mt-4 inline-block">
                Event erstellen
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  startsAt={event.starts_at}
                  endsAt={event.ends_at}
                  community={event.community}
                  compact
                />
              ))}
            </div>
          )}
        </section>

        {/* Letzte Blog-Posts */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Ihre Blog-Beiträge</h2>
            <Link href="/admin/blog" className="text-sheridan-blue hover:underline">
              Alle ansehen →
            </Link>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">Noch keine Beiträge verfasst</p>
              <Link href="/admin/blog" className="btn-primary mt-4 inline-block">
                Ersten Beitrag erstellen
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <div key={post.id} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    {post.published ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        Veröffentlicht
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        Entwurf
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {post.published_at ? formatDateLong(post.published_at) : formatDateLong(post.created_at)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
