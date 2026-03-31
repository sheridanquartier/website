'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { uploadImage, deleteImage } from '@/lib/utils/imageUpload'
import CommunityBadge from '@/components/CommunityBadge'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

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

const CATEGORIES = ['werkzeug', 'garten', 'haushalt', 'freizeit', 'sonstiges']
const CATEGORY_LABELS: Record<string, string> = {
  werkzeug: 'Werkzeug',
  garten: 'Garten',
  haushalt: 'Haushalt',
  freizeit: 'Freizeit',
  sonstiges: 'Sonstiges'
}

export default function AdminVerleihpoolPage() {
  const [items, setItems] = useState<LendItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LendItem | null>(null)
  const [community, setCommunity] = useState<CommunityId>('sheridan-junia')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [accessResolved, setAccessResolved] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'werkzeug',
    contact: '',
    available: true
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

  const fetchItems = useCallback(async () => {
    if (!accessResolved) {
      return
    }

    setLoading(true)

    let query = supabase
      .from('lend_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (!isSuperadmin) {
      query = query.eq('community', community)
    } else if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching items:', error)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }, [supabase, communityFilter, community, isSuperadmin, accessResolved])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const openCreateModal = () => {
    setEditingItem(null)
    setImageFile(null)
    setFormData({
      name: '',
      description: '',
      category: 'werkzeug',
      contact: '',
      available: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: LendItem) => {
    setEditingItem(item)
    setCommunity(item.community)
    setImageFile(null)
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      contact: item.contact || '',
      available: item.available
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl: string | null = editingItem?.image_url || null

      // Wenn neues Bild hochgeladen wurde
      if (imageFile) {
        // Altes Bild löschen falls vorhanden
        if (editingItem?.image_url) {
          try {
            await deleteImage(editingItem.image_url)
          } catch (error) {
            console.error('Error deleting old image:', error)
          }
        }
        // Neues Bild hochladen
        imageUrl = await uploadImage(imageFile)
      }

      const itemData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        contact: formData.contact || null,
        image_url: imageUrl,
        available: formData.available,
        community
      }

      if (editingItem) {
        const { error } = await supabase
          .from('lend_items')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) {
          console.error('Error updating item:', error)
          alert(`Fehler beim Aktualisieren: ${error.message}`)
          return
        }
      } else {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          console.error('User error:', userError)
          alert('Fehler: Benutzer nicht authentifiziert')
          return
        }

        const { error } = await supabase.from('lend_items').insert({
          ...itemData,
          created_by: user.id
        })

        if (error) {
          console.error('Error creating item:', error)
          alert(`Fehler beim Erstellen: ${error.message}`)
          return
        }
      }

      setIsModalOpen(false)
      setImageFile(null)
      fetchItems()
    } catch (error) {
      console.error('Unexpected error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler'
      alert(`Ein unerwarteter Fehler ist aufgetreten: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Artikel wirklich löschen?')) return

    const { error } = await supabase
      .from('lend_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting item:', error)
      alert('Fehler beim Löschen')
      return
    }

    fetchItems()
  }

  const toggleAvailable = async (item: LendItem) => {
    const { error } = await supabase
      .from('lend_items')
      .update({ available: !item.available })
      .eq('id', item.id)

    if (error) {
      console.error('Error toggling availability:', error)
      alert('Fehler beim Aktualisieren')
      return
    }

    fetchItems()
  }

  return (
    <div className="pt-12 min-h-screen">
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="mb-0">Verleihpool verwalten</h1>
            <button onClick={openCreateModal} className="btn-primary">
              + Neuer Artikel
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
              <p className="text-[#6e6e73]">Lädt...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-[#6e6e73]">Noch keine Artikel erstellt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-[20px] font-medium text-[#1d1d1f] mb-0">{item.name}</h3>
                      <CommunityBadge community={item.community} size="sm" />
                      <span className="text-[12px] px-3 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] font-medium">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-[#34c759]' : 'bg-[#8e8e93]'}`} />
                        <span className="text-[12px] text-[#6e6e73]">
                          {item.available ? 'Verfügbar' : 'Vergeben'}
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-[14px] text-[#6e6e73] mb-2">{item.description}</p>
                    )}
                    {item.contact && (
                      <p className="text-[14px] text-[#6e6e73]">Kontakt: {item.contact}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleAvailable(item)}
                      className="btn-secondary text-[14px] px-4 py-2"
                    >
                      {item.available ? 'Als vergeben' : 'Als verfügbar'}
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="btn-secondary text-[14px] px-4 py-2"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn bg-[#ff3b30] text-white hover:bg-[#ff2d1f] text-[14px] px-4 py-2 rounded-full transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingItem ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            size="lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Kategorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Kontaktinfo</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="input"
                  placeholder="E-Mail oder Name"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Bild (optional, max. 1 MB)</label>
                <ImageUpload
                  onImageSelect={setImageFile}
                  currentImage={editingItem?.image_url || null}
                />
              </div>

              {isSuperadmin && (
                <div>
                  <label className="block text-[14px] font-medium mb-2 text-[#1d1d1f]">Gemeinschaft *</label>
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

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5 rounded border-[#d2d2d7]"
                  />
                  <span className="text-[14px] font-medium text-[#1d1d1f]">Verfügbar</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Aktualisieren' : 'Erstellen'}
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
      </section>
    </div>
  )
}
