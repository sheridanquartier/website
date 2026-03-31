import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import CommunityBadge from '@/components/CommunityBadge'
import { createClient } from '@/lib/supabase/server'
import { formatDateLong } from '@/lib/utils/dateFormat'
import type { CommunityId } from '@/lib/constants'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  image_url: string | null
  published_at: string
  community: CommunityId
}

export const revalidate = 60

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single<BlogPost>()

  if (error || !post) notFound()

  return (
    <div className="min-h-screen pt-16">
      <section className="section pb-14 md:pb-18">
        <div className="container-custom">
          <div className="section-shell">
            <Link href="/neuigkeiten" className="subtle-link">
              Zur Übersicht
            </Link>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:items-end">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <CommunityBadge community={post.community} />
                  <span className="text-[12px] uppercase tracking-[0.08em] text-[#8b7b6c]">
                    {formatDateLong(post.published_at)}
                  </span>
                </div>
                <h1 className="max-w-[12ch] text-[clamp(2.7rem,5vw,4.7rem)]">{post.title}</h1>
              </div>

              <p className="mb-0 max-w-[620px] text-[18px] leading-[1.8] text-[var(--muted)]">
                Öffentliche Einblicke, Entwicklungen und Geschichten aus dem Sheridan Quartier.
              </p>
            </div>

            {post.image_url && (
              <div className="mt-8 overflow-hidden rounded-[34px] border border-[var(--line)] shadow-[0_24px_60px_rgba(38,82,62,0.12)]">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  width={1600}
                  height={980}
                  className="h-[220px] w-full object-cover sm:h-[360px] md:h-[480px]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="container-custom">
          <article className="editorial-panel mx-auto max-w-[860px] px-5 py-6 md:px-10 md:py-10">
            <div className="article-copy">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
