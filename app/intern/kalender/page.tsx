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
    <div className="pt-28">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Kalender</h1>
          <p className="text-gray-600">Kommende Events und Termine im Quartier</p>
        </div>

        <CalendarView events={events || []} viewMode="list" />
      </div>
    </div>
  )
}
