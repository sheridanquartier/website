import { createClient } from '@/lib/supabase/server'
import LendItemCard from '@/components/LendItemCard'
import type { CommunityId } from '@/lib/constants'
import AppEmptyState from '@/components/AppEmptyState'

interface LendItem {
  id: string
  name: string
  description: string | null
  category: string
  image_url: string | null
  community: CommunityId
  available: boolean
  contact: string | null
}

export const revalidate = 0

export default async function VerleihpoolPage() {
  const supabase = await createClient()

  const { data: items, error } = await supabase
    .from('lend_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lend items:', error)
  }

  return (
    <div className="min-h-screen pt-[calc(4.5rem+env(safe-area-inset-top))] pb-24 md:pt-28">
      <section className="section bg-transparent py-4 md:bg-white md:py-24">
        <div className="container-custom">
          <div className="section-shell mb-8 hidden md:block md:mb-12">
            <span className="eyebrow mb-4">Teilen statt doppelt kaufen</span>
            <h1 className="mb-3 max-w-[11ch]">Verleihpool im Quartier.</h1>
            <p className="mb-0 max-w-[38rem] text-[16px] leading-[1.7] text-[var(--muted)] md:text-[18px]">
              Werkzeuge, Haushaltsgeräte und andere Dinge aus den Gemeinschaften direkt auf dem Handy durchsuchen.
            </p>
          </div>

          {!items || items.length === 0 ? (
            <AppEmptyState
              title="Noch keine Dinge im Verleihpool"
              description="Sobald Gegenstände freigegeben werden, erscheinen sie hier gesammelt für das ganze Quartier."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {items.map((item: LendItem) => (
                <LendItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description || undefined}
                  category={item.category}
                  imageUrl={item.image_url}
                  community={item.community}
                  available={item.available}
                  contact={item.contact || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
