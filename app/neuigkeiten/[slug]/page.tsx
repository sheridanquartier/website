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
    <>
      <div className="app-screen md:hidden">
        {post.image_url && (
          <div className="relative h-[285px] overflow-hidden rounded-b-[28px] bg-[#dce5dd]">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(15,37,30,0.45))]" />
          </div>
        )}

        <section className={`px-4 ${post.image_url ? 'pt-6' : 'pt-4'}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CommunityBadge community={post.community} size="sm" />
            <span className="text-[11px] font-semibold text-[var(--muted)]">
              {formatDateLong(post.published_at)}
            </span>
          </div>
          <h1 className="mb-0 font-sans text-[34px] font-bold leading-[1.06] tracking-[-0.045em]">
            {post.title}
          </h1>
        </section>

        <article className="app-article article-copy mt-6 border-t border-[var(--app-ios-line)] px-4 pt-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        <div className="mx-4 mt-8 border-t border-[var(--app-ios-line)] pt-5">
          <Link href="/neuigkeiten" className="app-group flex min-h-[50px] items-center justify-between px-4 text-[13px] font-semibold text-[var(--app-ios-accent)]">
            Alle Neuigkeiten
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M14 7l5 5-5 5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="hidden min-h-screen pt-16 md:block">
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
    </>
  )
}
