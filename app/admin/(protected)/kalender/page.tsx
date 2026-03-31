'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import EventCard from '@/components/EventCard'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  starts_at: string
  ends_at: string | null
  community: CommunityId
}

export default function AdminKalenderPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [community, setCommunity] = useState<CommunityId>('sheridan-junia')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [accessResolved, setAccessResolved] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    starts_at_date: '',
    starts_at_time: '',
    ends_at_date: '',
    ends_at_time: ''
  })

  const [supabase] = useState(() => createClient())

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const access = getAdminAccess(data.user)
      setIsSuperadmin(access.isSuperadmin)
      if (access.isSuperadmin) {
        setCommunityFilter('alle')
      } else if (access.community) {
        setCommunity(access.community)
        setCommunityFilter(access.community)
      }
      setAccessResolved(true)
    })
  }, [supabase])

  const fetchEvents = useCallback(async () => {
    if (!accessResolved) {
      return
    }

    setLoading(true)

    let query = supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: false })

    if (!isSuperadmin) {
      query = query.eq('community', community)
    } else if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setEvents(data || [])
    }

    setLoading(false)
  }, [supabase, communityFilter, community, isSuperadmin, accessResolved])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const openCreateModal = () => {
    setEditingEvent(null)
    setFormData({
      title: '',
      description: '',
      location: '',
      starts_at_date: '',
      starts_at_time: '',
      ends_at_date: '',
      ends_at_time: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setCommunity(event.community)
    const startsAt = new Date(event.starts_at)
    const endsAt = event.ends_at ? new Date(event.ends_at) : null

    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      starts_at_date: startsAt.toISOString().split('T')[0],
      starts_at_time: startsAt.toTimeString().substring(0, 5),
      ends_at_date: endsAt ? endsAt.toISOString().split('T')[0] : '',
      ends_at_time: endsAt ? endsAt.toTimeString().substring(0, 5) : ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const startsAt = new Date(`${formData.starts_at_date}T${formData.starts_at_time}`)
    const endsAt = formData.ends_at_date && formData.ends_at_time
      ? new Date(`${formData.ends_at_date}T${formData.ends_at_time}`)
      : null

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      location: formData.location || null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt ? endsAt.toISOString() : null,
      community
    }

    if (editingEvent) {
      // Update
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editingEvent.id)

      if (error) {
        console.error('Error updating event:', error)
        alert('Fehler beim Aktualisieren')
        return
      }
    } else {
      // Create
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from('events').insert({
        ...eventData,
        created_by: user?.id
      })

      if (error) {
        console.error('Error creating event:', error)
        alert('Fehler beim Erstellen')
        return
      }
    }

    setIsModalOpen(false)
    fetchEvents()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Event wirklich löschen?')) return

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting event:', error)
      alert('Fehler beim Löschen')
      return
    }

    fetchEvents()
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Kalender verwalten</h1>
          <button onClick={openCreateModal} className="btn-primary">
            + Neues Event
          </button>
        </div>

        {isSuperadmin && (
          <div className="card mb-8">
            <label className="block text-sm font-medium mb-2">Gemeinschaft</label>
            <select
              value={communityFilter}
              onChange={(e) => setCommunityFilter(e.target.value)}
              className="input max-w-md"
            >
              <option value="alle">Alle</option>
              <option value="sheridan-junia">Sheridan Park & Junia</option>
              <option value="wagnisshare">wagnisSHARE</option>
              <option value="wogenau">WOGENAU</option>
            </select>
          </div>
        )}

        {!accessResolved || loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Lädt...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Noch keine Events erstellt</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="relative">
                <EventCard
                  title={event.title}
                  description={event.description || undefined}
                  location={event.location || undefined}
                  startsAt={event.starts_at}
                  endsAt={event.ends_at || undefined}
                  community={event.community}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(event)}
                    className="btn-secondary text-sm"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="btn bg-[#ff3b30] text-white hover:bg-[#ff2d1f] text-sm px-4 py-2 rounded-full transition-colors"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingEvent ? 'Event bearbeiten' : 'Neues Event'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titel *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Beschreibung</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ort</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
              />
            </div>

            {isSuperadmin && (
              <div>
                <label className="block text-sm font-medium mb-2">Gemeinschaft *</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value as CommunityId)}
                  className="input"
                  required
                >
                  {Object.entries(COMMUNITIES).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Startdatum *</label>
                <input
                  type="date"
                  value={formData.starts_at_date}
                  onChange={(e) => setFormData({ ...formData, starts_at_date: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Startzeit *</label>
                <input
                  type="time"
                  value={formData.starts_at_time}
                  onChange={(e) => setFormData({ ...formData, starts_at_time: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Enddatum</label>
                <input
                  type="date"
                  value={formData.ends_at_date}
                  onChange={(e) => setFormData({ ...formData, ends_at_date: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Endzeit</label>
                <input
                  type="time"
                  value={formData.ends_at_time}
                  onChange={(e) => setFormData({ ...formData, ends_at_time: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                {editingEvent ? 'Aktualisieren' : 'Erstellen'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
