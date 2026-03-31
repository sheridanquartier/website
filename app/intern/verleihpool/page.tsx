import { createClient } from '@/lib/supabase/server'
import LendItemCard from '@/components/LendItemCard'
import type { CommunityId } from '@/lib/constants'

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
    <div className="pt-28 min-h-screen">
      <section className="section bg-white">
        <div className="container-custom">
          <div className="mb-12">
            <h1 className="mb-4">Verleihpool</h1>
            <p className="text-[21px] text-[#6e6e73] content-width">
              Gegenstände aus den drei Gemeinschaften zum Ausleihen
            </p>
          </div>

          {!items || items.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-[17px] text-[#6e6e73]">
                Noch keine Artikel im Verleihpool.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
