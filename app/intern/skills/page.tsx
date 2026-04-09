'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import TradeCard from '@/components/TradeCard'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { uploadImage } from '@/lib/utils/imageUpload'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'

interface Skill {
  id: string
  title: string
  description: string
  type: 'skill-angebot' | 'skill-gesuch'
  offer?: string | null
  seek?: string | null
  image_url?: string | null
  community: CommunityId
  contact_name: string
  contact_info: string
  expires_at: string
  created_at: string
}

const OWNED_TRADES_KEY = 'quartier_owned_trades'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [ownedTradeIds, setOwnedTradeIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'skill-angebot' as Skill['type'],
    offer: '',
    seek: '',
    community: 'sheridan-junia' as CommunityId,
    contact_name: '',
    contact_info: '',
    expires_days: '90',
  })

  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const stored = window.localStorage.getItem(OWNED_TRADES_KEY)
    if (stored) {
      setOwnedTradeIds(JSON.parse(stored))
    }
  }, [])

  const fetchSkills = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('trades')
      .select('id, title, description, type, offer, seek, image_url, community, contact_name, contact_info, expires_at, created_at')
      .in('type', ['skill-angebot', 'skill-gesuch'])
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (communityFilter !== 'alle') {
      query = query.eq('community', communityFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching skills:', error)
    } else {
      setSkills((data || []) as Skill[])
    }

    setLoading(false)
  }, [supabase, communityFilter])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const persistOwnedTrade = (id: string) => {
    const nextIds = Array.from(new Set([...ownedTradeIds, id]))
    setOwnedTradeIds(nextIds)
    window.localStorage.setItem(OWNED_TRADES_KEY, JSON.stringify(nextIds))
  }

  const removeOwnedTrade = (id: string) => {
    const nextIds = ownedTradeIds.filter((tradeId) => tradeId !== id)
    setOwnedTradeIds(nextIds)
    window.localStorage.setItem(OWNED_TRADES_KEY, JSON.stringify(nextIds))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'skill-angebot',
      offer: '',
      seek: '',
      community: 'sheridan-junia',
      contact_name: '',
      contact_info: '',
      expires_days: '90',
    })
    setImageFile(null)
    setEditingSkill(null)
    setFormError('')
    setFormSuccess('')
  }

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill)
    setImageFile(null)
    const expiresDays = Math.max(
      1,
      Math.ceil((new Date(skill.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    )

    setFormData({
      title: skill.title,
      description: skill.description,
      type: skill.type,
      offer: skill.offer || '',
      seek: skill.seek || '',
      community: skill.community,
      contact_name: skill.contact_name,
      contact_info: skill.contact_info,
      expires_days: String(expiresDays),
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    try {
      let imageUrl: string | null = editingSkill?.image_url || null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_days, 10))

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        offer: formData.type === 'skill-angebot' ? formData.offer : null,
        seek: formData.type === 'skill-gesuch' ? formData.seek : null,
        image_url: imageUrl,
        community: formData.community,
        contact_name: formData.contact_name,
        contact_info: formData.contact_info,
        expires_at: expiresAt.toISOString(),
      }

      const response = await fetch(
        editingSkill ? `/api/intern/trades/${editingSkill.id}` : '/api/intern/trades',
        {
          method: editingSkill ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || 'Fehler beim Speichern des Eintrags')
        return
      }

      if (!editingSkill) {
        const data = await response.json()
        persistOwnedTrade(data.id)
      }

      resetForm()
      setFormSuccess(editingSkill ? 'Skill wurde aktualisiert.' : 'Skill wurde erstellt.')
      setIsModalOpen(false)
      fetchSkills()
    } catch (error) {
      console.error('Unexpected error:', error)
      setFormError('Ein unerwarteter Fehler ist aufgetreten')
    }
  }

  const handleDelete = async (skillId: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return

    const response = await fetch(`/api/intern/trades/${skillId}`, { method: 'DELETE' })
    if (!response.ok) {
      const data = await response.json()
      alert(data.error || 'Fehler beim Löschen')
      return
    }

    removeOwnedTrade(skillId)
    fetchSkills()
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Skills</h1>
            <p className="text-gray-600">Fähigkeiten anbieten und suchen</p>
          </div>
          <button onClick={() => { resetForm(); setIsModalOpen(true) }} className="btn-primary w-full md:w-auto">
            + Neuer Eintrag
          </button>
        </div>

        <div className="card mb-8">
          <label className="block text-sm font-medium mb-2">Gemeinschaft</label>
          <select value={communityFilter} onChange={(e) => setCommunityFilter(e.target.value)} className="input max-w-md">
            <option value="alle">Alle</option>
            {Object.entries(COMMUNITIES).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Lädt...</p></div>
        ) : skills.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-700">Für diese Auswahl gibt es aktuell keine Skills.</p>
            <p className="mt-2 text-sm text-gray-500">Erstellen Sie einen neuen Eintrag oder zeigen Sie wieder alle Gemeinschaften an.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => setCommunityFilter('alle')} className="btn-secondary">
                Filter zurücksetzen
              </button>
              <button onClick={() => { resetForm(); setIsModalOpen(true) }} className="btn-primary">
                Ersten Skill erstellen
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="space-y-3">
                <TradeCard
                  title={skill.title}
                  description={skill.description}
                  type={skill.type}
                  offer={skill.offer || undefined}
                  seek={skill.seek || undefined}
                  imageUrl={skill.image_url}
                  community={skill.community}
                  contactName={skill.contact_name}
                  contactInfo={skill.contact_info}
                  expiresAt={skill.expires_at}
                  createdAt={skill.created_at}
                />
                {ownedTradeIds.includes(skill.id) && (
                  <div className="flex gap-3">
                    <button onClick={() => openEditModal(skill)} className="btn-secondary flex-1 text-sm">
                      Bearbeiten
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="btn-danger flex-1 text-sm">
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
          onClose={() => { setIsModalOpen(false); resetForm() }}
          title={editingSkill ? 'Skill bearbeiten' : 'Neuer Skill-Eintrag'}
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
              <p className="mt-2 text-[13px] text-[var(--muted)]">Formulieren Sie kurz, welche Fähigkeit Sie anbieten oder suchen.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beschreibung *</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[120px]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Art *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Skill['type'] })} className="input" required>
                <option value="skill-angebot">Skill-Angebot</option>
                <option value="skill-gesuch">Skill-Gesuch</option>
              </select>
            </div>

            {formData.type === 'skill-angebot' && (
              <div>
                <label className="block text-sm font-medium mb-2">Ich biete</label>
                <input type="text" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value })} className="input" />
              </div>
            )}

            {formData.type === 'skill-gesuch' && (
              <div>
                <label className="block text-sm font-medium mb-2">Ich suche</label>
                <input type="text" value={formData.seek} onChange={(e) => setFormData({ ...formData, seek: e.target.value })} className="input" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Bild (optional)</label>
              <ImageUpload onImageSelect={setImageFile} currentImage={editingSkill?.image_url || null} />
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
                {editingSkill ? 'Aktualisieren' : 'Erstellen'}
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
