'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { slugify } from '@/lib/utils/slugify'
import { formatDate } from '@/lib/utils/dateFormat'
import { uploadImage, deleteImage } from '@/lib/utils/imageUpload'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  published: boolean
  published_at: string | null
  community: CommunityId
  created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [community, setCommunity] = useState<CommunityId>('sheridan-junia')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [accessResolved, setAccessResolved] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
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
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!isSuperadmin) {
      query = query.eq('community', community)
    } else if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }

    setLoading(false)
  }, [supabase, communityFilter, community, isSuperadmin, accessResolved])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openCreateModal = () => {
    setEditingPost(null)
    setImageFile(null)
    setFormData({
      title: '',
      content: '',
      excerpt: ''
    })
    setIsModalOpen(true)
  }

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post)
    setCommunity(post.community)
    setImageFile(null)
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || ''
    })
    setIsModalOpen(true)
  }

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault()
    await savePost(false)
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    await savePost(true)
  }

  const savePost = async (publish: boolean) => {
    try {
      let imageUrl: string | null = editingPost?.image_url || null

      // Wenn neues Bild hochgeladen wurde
      if (imageFile) {
        // Altes Bild löschen falls vorhanden
        if (editingPost?.image_url) {
          try {
            await deleteImage(editingPost.image_url)
          } catch (error) {
            console.error('Error deleting old image:', error)
          }
        }
        // Neues Bild hochladen
        imageUrl = await uploadImage(imageFile)
      }

      const slug = slugify(formData.title)

      const postData = {
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt || null,
        image_url: imageUrl,
        published: publish,
        community
      }

      if (editingPost) {
        // Update
        const updateData: any = { ...postData }

        // Wenn von Entwurf zu published wechseln, setze published_at
        if (publish && !editingPost.published) {
          updateData.published_at = new Date().toISOString()
        }

        const { error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', editingPost.id)

        if (error) {
          console.error('Error updating post:', error)
          alert(`Fehler beim Aktualisieren: ${error.message}`)
          return
        }
      } else {
        // Create
        const { data: { user } } = await supabase.auth.getUser()

        const insertData: any = {
          ...postData,
          created_by: user?.id
        }

        if (publish) {
          insertData.published_at = new Date().toISOString()
        }

        const { error } = await supabase.from('blog_posts').insert(insertData)

        if (error) {
          console.error('Error creating post:', error)
          if (error.code === '23505') {
            alert('Ein Beitrag mit diesem Titel existiert bereits')
          } else {
            alert(`Fehler beim Erstellen: ${error.message}`)
          }
          return
        }
      }

      setIsModalOpen(false)
      setImageFile(null)
      fetchPosts()
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Ein unerwarteter Fehler ist aufgetreten')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Beitrag wirklich löschen?')) return

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      alert('Fehler beim Löschen')
      return
    }

    fetchPosts()
  }

  const togglePublish = async (post: BlogPost) => {
    const newPublished = !post.published

    const updateData: any = {
      published: newPublished
    }

    if (newPublished && !post.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', post.id)

    if (error) {
      console.error('Error toggling publish:', error)
      alert('Fehler beim Aktualisieren')
      return
    }

    fetchPosts()
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Blog verwalten</h1>
          <button onClick={openCreateModal} className="btn-primary">
            + Neuer Beitrag
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
        ) : posts.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Noch keine Beiträge erstellt</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.published ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          Veröffentlicht
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          Entwurf
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <button
                      onClick={() => togglePublish(post)}
                      className={post.published ? 'btn-secondary text-sm' : 'btn bg-green-600 text-white hover:bg-green-700 text-sm'}
                    >
                      {post.published ? 'Zurückziehen' : 'Veröffentlichen'}
                    </button>
                    <button
                      onClick={() => openEditModal(post)}
                      className="btn-secondary text-sm"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="btn-danger text-sm"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPost ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
          size="full"
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titel *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                required
              />
              {formData.title && (
                <p className="text-xs text-gray-500 mt-1">
                  Slug: {slugify(formData.title)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt (Kurzbeschreibung)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="input min-h-[80px]"
                placeholder="Kurze Zusammenfassung für die Übersicht..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titelbild (optional)</label>
              <ImageUpload
                onImageSelect={setImageFile}
                currentImage={editingPost?.image_url || null}
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Inhalt (Markdown unterstützt) *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input min-h-[400px] font-mono text-sm"
                required
                placeholder="Markdown-Text hier eingeben...

Beispiele:
# Überschrift
## Unterüberschrift

**fett** und *kursiv*

- Liste
- Punkt 2

[Link](https://example.com)"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn-secondary flex-1"
              >
                Als Entwurf speichern
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="btn bg-green-600 text-white hover:bg-green-700 flex-1"
              >
                {editingPost?.published ? 'Aktualisieren' : 'Veröffentlichen'}
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
