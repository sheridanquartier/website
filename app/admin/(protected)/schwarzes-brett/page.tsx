'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import { formatDate } from '@/lib/utils/dateFormat'
import { COMMUNITIES, CATEGORIES, type CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

interface Post {
  id: string
  title: string
  description: string
  type: 'angebot' | 'gesuch' | 'tausch'
  category: string
  offer?: string | null
  seek?: string | null
  community: CommunityId
  contact_name: string
  contact_info: string
  expires_at: string
  created_at: string
}

interface PostFormData {
  title: string
  description: string
  type: Post['type']
  category: string
  offer: string
  seek: string
  contact_name: string
  contact_info: string
}

export default function AdminSchwarzesBrettPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('alle')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [community, setCommunity] = useState<CommunityId>('sheridan-junia')
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [accessResolved, setAccessResolved] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    type: 'angebot' as Post['type'],
    category: CATEGORIES[0],
    offer: '',
    seek: '',
    contact_name: '',
    contact_info: '',
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

  const fetchPosts = useCallback(async () => {
    if (!accessResolved) {
      return
    }

    setLoading(true)

    let query = supabase
      .from('posts')
      .select('id, title, description, type, category, offer, seek, community, contact_name, contact_info, expires_at, created_at')
      .order('created_at', { ascending: false })

    if (typeFilter !== 'alle') {
      query = query.eq('type', typeFilter)
    }

    if (!isSuperadmin) {
      query = query.eq('community', community)
    } else if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts((data || []) as Post[])
    }

    setLoading(false)
  }, [supabase, typeFilter, communityFilter, community, isSuperadmin, accessResolved])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openEditModal = (post: Post) => {
    setEditingPost(post)
    setCommunity(post.community)
    setFormData({
      title: post.title,
      description: post.description,
      type: post.type,
      category: post.category,
      offer: post.offer || '',
      seek: post.seek || '',
      contact_name: post.contact_name,
      contact_info: post.contact_info,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return

    const { error } = await supabase
      .from('posts')
      .update({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        offer: formData.type === 'tausch' ? formData.offer || null : null,
        seek: formData.type === 'tausch' ? formData.seek || null : null,
        community,
        contact_name: formData.contact_name,
        contact_info: formData.contact_info,
      })
      .eq('id', editingPost.id)

    if (error) {
      alert(`Fehler beim Aktualisieren: ${error.message}`)
      return
    }

    setIsModalOpen(false)
    setEditingPost(null)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return

    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) {
      alert(`Fehler beim Löschen: ${error.message}`)
      return
    }

    fetchPosts()
  }

  const typeLabels: Record<string, string> = {
    angebot: 'Angebot',
    gesuch: 'Gesuch',
    tausch: 'Tauschangebot',
  }

  const typeStyles: Record<string, string> = {
    angebot: 'bg-[#e8f5e9] text-[#166534]',
    gesuch: 'bg-[#e8f0fe] text-[#1a56db]',
    tausch: 'bg-[#f3e8ff] text-[#7c3aed]',
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Schwarzes Brett verwalten</h1>
          <p className="text-gray-600">Angebote, Gesuche und Tauschangebote Ihrer Community bearbeiten und löschen</p>
        </div>

        <div className="card mb-8">
          <div className={`grid grid-cols-1 gap-4 ${isSuperadmin ? 'md:grid-cols-2' : ''}`}>
            <div>
              <label className="block text-sm font-medium mb-2">Art</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
                <option value="alle">Alle</option>
                <option value="angebot">Angebote</option>
                <option value="gesuch">Gesuche</option>
                <option value="tausch">Tauschangebote</option>
              </select>
            </div>
            {isSuperadmin && (
              <div>
                <label className="block text-sm font-medium mb-2">Gemeinschaft</label>
                <select value={communityFilter} onChange={(e) => setCommunityFilter(e.target.value)} className="input">
                  <option value="alle">Alle</option>
                  {Object.entries(COMMUNITIES).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {!accessResolved || loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Lädt...</p></div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-500">Keine Einträge gefunden</p></div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${typeStyles[post.type]}`}>
                        {typeLabels[post.type]}
                      </span>
                      <span className="text-[12px] px-3 py-1 rounded-full bg-[#f5f5f7] text-[#6e6e73] font-medium">
                        {post.category}
                      </span>
                      <span className="text-[12px] text-[#6e6e73]">{COMMUNITIES[post.community].name}</span>
                      <span className="text-[12px] text-[#6e6e73]">{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
                    {post.type === 'tausch' && (post.offer || post.seek) && (
                      <div className="bg-[#f5f5f7] rounded-lg p-3 mb-2 text-sm">
                        {post.offer && <p><strong>Bietet:</strong> {post.offer}</p>}
                        {post.seek && <p><strong>Sucht:</strong> {post.seek}</p>}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      <strong>Kontakt:</strong> {post.contact_name} ({post.contact_info})
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => openEditModal(post)} className="btn-secondary text-sm">Bearbeiten</button>
                    <button onClick={() => handleDelete(post.id)} className="btn-danger text-sm">Löschen</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Eintrag bearbeiten"
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titel *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beschreibung *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[120px]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Art *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Post['type'] })} className="input">
                <option value="angebot">Angebot</option>
                <option value="gesuch">Gesuch</option>
                <option value="tausch">Tauschangebot</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kategorie *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {formData.type === 'tausch' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value })} className="input" placeholder="Ich biete" />
                <input type="text" value={formData.seek} onChange={(e) => setFormData({ ...formData, seek: e.target.value })} className="input" placeholder="Ich suche" />
              </div>
            )}
            {isSuperadmin && (
              <div>
                <label className="block text-sm font-medium mb-2">Gemeinschaft *</label>
                <select value={community} onChange={(e) => setCommunity(e.target.value as CommunityId)} className="input">
                  {Object.entries(COMMUNITIES).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="input" placeholder="Name" required />
              <input type="text" value={formData.contact_info} onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })} className="input" placeholder="Kontakt" required />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Speichern</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Abbrechen</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
