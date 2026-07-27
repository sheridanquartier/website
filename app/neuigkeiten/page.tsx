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
    <>
      <div className="app-screen md:hidden">
        <section className="px-4 pt-6">
          <p className="app-kicker">Aus den Gemeinschaften</p>
          <h1 className="mb-2 font-sans text-[34px] font-bold leading-[1.04] tracking-[-0.045em]">
            Was gerade passiert.
          </h1>
          <p className="mb-0 max-w-[32ch] text-[14px] leading-[1.55] text-[var(--muted)]">
            Fortschritte, Einblicke und Geschichten aus dem Sheridan Quartier.
          </p>
        </section>

        {!posts || posts.length === 0 ? (
          <div className="app-group mx-4 mt-7 px-5 py-10 text-center">
            <p className="mb-1 text-[15px] font-bold">Noch keine Beiträge</p>
            <p className="mb-0 text-[13px] text-[var(--muted)]">Schau bald wieder vorbei.</p>
          </div>
        ) : (
          <section className="mt-6 px-4">
            {featuredPost && (
              <Link href={`/neuigkeiten/${featuredPost.slug}`} className="app-news-feature">
                {featuredPost.image_url && (
                  <div className="relative h-[225px] overflow-hidden">
                    <Image
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <CommunityBadge community={featuredPost.community} size="sm" />
                    <span className="text-[11px] font-medium text-[var(--muted)]">
                      {formatDateLong(featuredPost.published_at)}
                    </span>
                  </div>
                  <h2 className="mb-2 font-sans text-[22px] font-bold leading-[1.18] tracking-[-0.035em]">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="mb-0 line-clamp-3 text-[14px] leading-[1.55] text-[var(--muted)]">
                      {featuredPost.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )}

            {remainingPosts.length > 0 && (
              <div className="app-group mt-4">
                {remainingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/neuigkeiten/${post.slug}`}
                    className="app-list-row !min-h-[98px] !px-3.5"
                  >
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[16px] bg-[#e5e5ea]">
                      {post.image_url && (
                        <Image src={post.image_url} alt="" fill sizes="82px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-[10px] font-medium text-[var(--app-ios-accent)]">
                        {formatDateLong(post.published_at)}
                      </div>
                      <h2 className="mb-1 line-clamp-2 font-sans text-[15px] font-semibold leading-[1.3] tracking-[-0.02em]">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mb-0 line-clamp-1 text-[12px] text-[var(--muted)]">{post.excerpt}</p>
                      )}
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-[#c7c7cc]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <div className="hidden min-h-screen pt-16 md:block">
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
                      {post.image_url && (
                        <div className="relative mb-5 h-[180px] w-full overflow-hidden rounded-[22px] bg-[#f5f5f7]">
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
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
    </>
  )
}
