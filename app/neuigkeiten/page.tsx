import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import CommunityBadge from '@/components/CommunityBadge'
import { formatDateLong } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  published_at: string
  community: CommunityId
}

export const revalidate = 60

export default async function NeuigkeitenPage() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, image_url, published_at, community')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) console.error('Error fetching blog posts:', error)

  const featuredPost = posts?.[0] as BlogPost | undefined
  const remainingPosts = (posts?.slice(1) || []) as BlogPost[]

  return (
    <div className="pt-16 min-h-screen">
      <section className="section">
        <div className="container-custom">
          <div className="mb-12 section-shell">
            <span className="eyebrow mb-5">Öffentliche Neuigkeiten</span>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <h1 className="max-w-[12ch]">Neuigkeiten aus dem Quartier</h1>
              </div>
              <p className="mb-0 max-w-[620px] text-[18px] leading-[1.8] text-[var(--muted)]">
                Beiträge, Entwicklungen und Einblicke aus Sheridan Park & Junia, wagnisSHARE und WOGENAU.
                Die Übersicht bündelt, was im Quartier öffentlich sichtbar wird.
              </p>
            </div>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-[17px] text-[#6e6e73]">Noch keine Beiträge vorhanden.</p>
              <p className="mt-2 text-[14px] text-[#6e6e73]">Schauen Sie bald wieder vorbei.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              {featuredPost && (
                <Link href={`/neuigkeiten/${featuredPost.slug}`} className="editorial-panel block overflow-hidden">
                  {featuredPost.image_url && (
                    <div className="relative h-[240px] w-full bg-[#f5f5f7] md:h-[420px]">
                      <Image
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <CommunityBadge community={featuredPost.community} size="sm" />
                      <span className="text-[13px] text-[#6e6e73]">{formatDateLong(featuredPost.published_at)}</span>
                    </div>
                    <h2 className="mb-4 text-[31px] md:text-[44px] leading-[0.98]">{featuredPost.title}</h2>
                    {featuredPost.excerpt && (
                      <p className="max-w-[56ch] text-[17px] leading-[1.8] text-[#665f56]">{featuredPost.excerpt}</p>
                    )}
                    <div className="mt-8 subtle-link">Beitrag lesen</div>
                  </div>
                </Link>
              )}

              <div className="space-y-5">
                {remainingPosts.map((post) => (
                  <Link key={post.id} href={`/neuigkeiten/${post.slug}`} className="block">
                    <article className="card group cursor-pointer">
                      <div className="mb-3 flex items-center gap-3">
                        <CommunityBadge community={post.community} size="sm" />
                        <span className="text-[13px] text-[#6e6e73]">{formatDateLong(post.published_at)}</span>
                      </div>
                      <h3 className="mb-3 text-[25px] md:text-[28px] leading-[1.04] transition-colors group-hover:text-[#8e4b31]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mb-0 text-[15px] leading-[1.7] text-[#665f56] line-clamp-3">{post.excerpt}</p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
