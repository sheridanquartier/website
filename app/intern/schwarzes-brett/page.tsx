'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import PostCard from '@/components/PostCard'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { uploadImage } from '@/lib/utils/imageUpload'
import { COMMUNITIES, CATEGORIES, type CommunityId } from '@/lib/constants'

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
  image_url?: string | null
}

interface PostFormData {
  title: string
  description: string
  type: Post['type']
  category: string
  offer: string
  seek: string
  community: CommunityId
  contact_name: string
  contact_info: string
  expires_days: string
}

const OWNED_POSTS_KEY = 'quartier_owned_posts'

export default function SchwarzesBrettPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [ownedPostIds, setOwnedPostIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('alle')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    type: 'angebot' as 'angebot' | 'gesuch' | 'tausch',
    category: CATEGORIES[0],
    offer: '',
    seek: '',
    community: 'sheridan-junia' as CommunityId,
    contact_name: '',
    contact_info: '',
    expires_days: '30',
  })

  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const stored = window.localStorage.getItem(OWNED_POSTS_KEY)
    if (stored) {
      setOwnedPostIds(JSON.parse(stored))
    }
  }, [])

  const persistOwnedPost = (id: string) => {
    const nextIds = Array.from(new Set([...ownedPostIds, id]))
    setOwnedPostIds(nextIds)
    window.localStorage.setItem(OWNED_POSTS_KEY, JSON.stringify(nextIds))
  }

  const removeOwnedPost = (id: string) => {
    const nextIds = ownedPostIds.filter((postId) => postId !== id)
    setOwnedPostIds(nextIds)
    window.localStorage.setItem(OWNED_POSTS_KEY, JSON.stringify(nextIds))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'angebot',
      category: CATEGORIES[0],
      offer: '',
      seek: '',
      community: 'sheridan-junia',
      contact_name: '',
      contact_info: '',
      expires_days: '30',
    })
    setImageFile(null)
    setEditingPost(null)
    setFormError('')
    setFormSuccess('')
  }

  const fetchPosts = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('posts')
      .select('id, title, description, type, category, offer, seek, community, contact_name, contact_info, expires_at, created_at, image_url')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (typeFilter !== 'alle') {
      query = query.eq('type', typeFilter)
    }

    if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts((data || []) as Post[])
    }

    setLoading(false)
  }, [supabase, typeFilter, communityFilter])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (post: Post) => {
    setEditingPost(post)
    setImageFile(null)
    const expiresDays = Math.max(
      1,
      Math.ceil((new Date(post.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    )

    setFormData({
      title: post.title,
      description: post.description,
      type: post.type,
      category: post.category,
      offer: post.offer || '',
      seek: post.seek || '',
      community: post.community,
      contact_name: post.contact_name,
      contact_info: post.contact_info,
      expires_days: String(expiresDays),
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    try {
      let imageUrl: string | null = editingPost?.image_url || null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_days, 10))

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        offer: formData.type === 'tausch' ? formData.offer : null,
        seek: formData.type === 'tausch' ? formData.seek : null,
        community: formData.community,
        contact_name: formData.contact_name,
        contact_info: formData.contact_info,
        expires_at: expiresAt.toISOString(),
        image_url: imageUrl,
      }

      const response = await fetch(
        editingPost ? `/api/intern/posts/${editingPost.id}` : '/api/intern/posts',
        {
          method: editingPost ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || 'Fehler beim Speichern des Eintrags')
        return
      }

      if (!editingPost) {
        const data = await response.json()
        persistOwnedPost(data.id)
      }

      resetForm()
      setFormSuccess(editingPost ? 'Eintrag wurde aktualisiert.' : 'Eintrag wurde erstellt.')
      setIsModalOpen(false)
      fetchPosts()
    } catch (error) {
      console.error('Error:', error)
      setFormError('Fehler beim Speichern des Eintrags')
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return

    const response = await fetch(`/api/intern/posts/${postId}`, { method: 'DELETE' })
    if (!response.ok) {
      const data = await response.json()
      alert(data.error || 'Fehler beim Löschen')
      return
    }

    removeOwnedPost(postId)
    fetchPosts()
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Schwarzes Brett</h1>
            <p className="text-gray-600">Angebote, Gesuche und Tauschangebote aus dem Quartier</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary w-full md:w-auto">
            + Neuer Eintrag
          </button>
        </div>

        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Art</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
                <option value="alle">Alle</option>
                <option value="angebot">Angebote</option>
                <option value="gesuch">Gesuche</option>
                <option value="tausch">Tauschangebote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gemeinschaft</label>
              <select value={communityFilter} onChange={(e) => setCommunityFilter(e.target.value)} className="input">
                <option value="alle">Alle</option>
                {Object.entries(COMMUNITIES).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Lädt...</p></div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-700">Für diese Auswahl gibt es aktuell keine Einträge.</p>
            <p className="text-sm text-gray-500 mt-2">Sie können die Filter zurücksetzen oder direkt einen neuen Eintrag erstellen.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => { setTypeFilter('alle'); setCommunityFilter('alle') }} className="btn-secondary">
                Filter zurücksetzen
              </button>
              <button onClick={openCreateModal} className="btn-primary">
                Ersten Eintrag erstellen
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="space-y-3">
                <PostCard
                  title={post.title}
                  description={post.description}
                  type={post.type}
                  category={post.category}
                  offer={post.offer}
                  seek={post.seek}
                  community={post.community}
                  contactName={post.contact_name}
                  contactInfo={post.contact_info}
                  expiresAt={post.expires_at}
                  createdAt={post.created_at}
                  imageUrl={post.image_url}
                />
                {ownedPostIds.includes(post.id) && (
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(post)} className="btn-secondary flex-1 text-sm">
                      Bearbeiten
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="btn-danger flex-1 text-sm">
                      Löschen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingPost ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-2xl border border-[#ff3b30] bg-[#ff3b30]/10 px-4 py-3 text-[14px] text-[#b42318]">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Titel *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" required />
              <p className="mt-2 text-[13px] text-[var(--muted)]">Beschreiben Sie kurz und konkret, worum es geht.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Beschreibung *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[120px]" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Art *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Post['type'] })} className="input" required>
                <option value="angebot">Angebot</option>
                <option value="gesuch">Gesuch</option>
                <option value="tausch">Zum Tausch anbieten</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kategorie *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input" required>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {formData.type === 'tausch' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ich biete</label>
                  <input type="text" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ich suche</label>
                  <input type="text" value={formData.seek} onChange={(e) => setFormData({ ...formData, seek: e.target.value })} className="input" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Bild (optional)</label>
              <ImageUpload onImageSelect={setImageFile} currentImage={editingPost?.image_url || null} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Gemeinschaft *</label>
                <select value={formData.community} onChange={(e) => setFormData({ ...formData, community: e.target.value as CommunityId })} className="input" required>
                  {Object.entries(COMMUNITIES).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gültig für *</label>
                <select value={formData.expires_days} onChange={(e) => setFormData({ ...formData, expires_days: e.target.value })} className="input" required>
                  <option value="7">7 Tage</option>
                  <option value="14">14 Tage</option>
                  <option value="30">30 Tage</option>
                  <option value="60">60 Tage</option>
                  <option value="90">90 Tage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ihr Name *</label>
                <input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kontakt *</label>
                <input type="text" value={formData.contact_info} onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })} className="input" required />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">
                {editingPost ? 'Aktualisieren' : 'Erstellen'}
              </button>
              <button type="button" onClick={() => { setIsModalOpen(false); resetForm() }} className="btn-secondary">
                Abbrechen
              </button>
            </div>
          </form>
        </Modal>

        {formSuccess && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-[14px] text-[var(--ink)] shadow-[0_16px_36px_rgba(38,82,62,0.12)]">
            {formSuccess}
          </div>
        )}
      </div>
    </div>
  )
}
