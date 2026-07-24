import { createClient } from '@/lib/supabase/server'
import CalendarView from '@/components/CalendarView'
import type { CommunityId } from '@/lib/constants'

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  starts_at: string
  ends_at: string | null
  community: CommunityId
}

export const revalidate = 0 // Immer frische Daten

export default async function KalenderPage() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
  }

  return (
    <div className="pt-24 pb-24 md:pt-28">
      <div className="container-custom space-y-6 md:space-y-8">
        <div className="section-shell">
          <span className="eyebrow mb-4">Gemeinsam planen</span>
          <h1 className="mb-3 max-w-[12ch]">Termine im Quartier auf einen Blick.</h1>
          <p className="mb-0 max-w-[38rem] text-[16px] leading-[1.7] text-[var(--muted)] md:text-[18px]">
            Sehen, was in den Gemeinschaften ansteht, und zwischen Listen- und Monatsansicht wechseln.
          </p>
        </div>

        <div className="editorial-panel p-4 md:p-6">
          <CalendarView events={events || []} viewMode="list" />
        </div>
      </div>
    </div>
  )
}
