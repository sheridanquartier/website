'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import { formatDate } from '@/lib/utils/dateFormat'
import { COMMUNITIES, type CommunityId } from '@/lib/constants'
import { getAdminAccess } from '@/lib/auth/admin'

interface Skill {
  id: string
  title: string
  description: string
  type: 'skill-angebot' | 'skill-gesuch'
  offer?: string | null
  seek?: string | null
  community: CommunityId
  contact_name: string
  contact_info: string
  created_at: string
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('alle')
  const [communityFilter, setCommunityFilter] = useState<string>('alle')
  const [community, setCommunity] = useState<CommunityId>('sheridan-junia')
  const [isSuperadmin, setIsSuperadmin] = useState(false)
  const [accessResolved, setAccessResolved] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'skill-angebot' as Skill['type'],
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

  const fetchSkills = useCallback(async () => {
    if (!accessResolved) {
      return
    }

    setLoading(true)

    let query = supabase
      .from('trades')
      .select('id, title, description, type, offer, seek, community, contact_name, contact_info, created_at')
      .in('type', ['skill-angebot', 'skill-gesuch'])
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
      console.error('Error fetching skills:', error)
    } else {
      setSkills((data || []) as Skill[])
    }

    setLoading(false)
  }, [supabase, typeFilter, communityFilter, community, isSuperadmin, accessResolved])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill)
    setCommunity(skill.community)
    setFormData({
      title: skill.title,
      description: skill.description,
      type: skill.type,
      offer: skill.offer || '',
      seek: skill.seek || '',
      contact_name: skill.contact_name,
      contact_info: skill.contact_info,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSkill) return

    const { error } = await supabase
      .from('trades')
      .update({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        offer: formData.type === 'skill-angebot' ? formData.offer || null : null,
        seek: formData.type === 'skill-gesuch' ? formData.seek || null : null,
        community,
        contact_name: formData.contact_name,
        contact_info: formData.contact_info,
      })
      .eq('id', editingSkill.id)

    if (error) {
      alert(`Fehler beim Aktualisieren: ${error.message}`)
      return
    }

    setIsModalOpen(false)
    setEditingSkill(null)
    fetchSkills()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eintrag wirklich löschen?')) return

    const { error } = await supabase.from('trades').delete().eq('id', id)

    if (error) {
      alert(`Fehler beim Löschen: ${error.message}`)
      return
    }

    fetchSkills()
  }

  const typeLabels: Record<string, string> = {
    'skill-angebot': 'Skill-Angebot',
    'skill-gesuch': 'Skill-Gesuch',
  }

  const typeStyles: Record<string, string> = {
    'skill-angebot': 'bg-[#e8f5e9] text-[#166534]',
    'skill-gesuch': 'bg-[#e8f0fe] text-[#1a56db]',
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skills verwalten</h1>
          <p className="text-gray-600">Skill-Einträge Ihrer Community bearbeiten und löschen</p>
        </div>

        <div className="card mb-8">
          <div className={`grid grid-cols-1 gap-4 ${isSuperadmin ? 'md:grid-cols-2' : ''}`}>
            <div>
              <label className="block text-sm font-medium mb-2">Art</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
                <option value="alle">Alle</option>
                <option value="skill-angebot">Skill-Angebote</option>
                <option value="skill-gesuch">Skill-Gesuche</option>
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
        ) : skills.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-500">Keine Einträge gefunden</p></div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${typeStyles[skill.type]}`}>
                        {typeLabels[skill.type]}
                      </span>
                      <span className="text-[12px] text-[#6e6e73]">{COMMUNITIES[skill.community].name}</span>
                      <span className="text-[12px] text-[#6e6e73]">{formatDate(skill.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{skill.description}</p>
                    {(skill.offer || skill.seek) && (
                      <div className="bg-[#f5f5f7] rounded-lg p-3 mb-2 text-sm">
                        {skill.offer && <p><strong>Bietet:</strong> {skill.offer}</p>}
                        {skill.seek && <p><strong>Sucht:</strong> {skill.seek}</p>}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      <strong>Kontakt:</strong> {skill.contact_name} ({skill.contact_info})
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => openEditModal(skill)} className="btn-secondary text-sm">Bearbeiten</button>
                    <button onClick={() => handleDelete(skill.id)} className="btn-danger text-sm">Löschen</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Skill bearbeiten" size="lg">
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" placeholder="Titel" required />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input min-h-[120px]" placeholder="Beschreibung" required />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Skill['type'] })} className="input">
              <option value="skill-angebot">Skill-Angebot</option>
              <option value="skill-gesuch">Skill-Gesuch</option>
            </select>
            {formData.type === 'skill-angebot' && (
              <input type="text" value={formData.offer} onChange={(e) => setFormData({ ...formData, offer: e.target.value })} className="input" placeholder="Ich biete" />
            )}
            {formData.type === 'skill-gesuch' && (
              <input type="text" value={formData.seek} onChange={(e) => setFormData({ ...formData, seek: e.target.value })} className="input" placeholder="Ich suche" />
            )}
            {isSuperadmin && (
              <select value={community} onChange={(e) => setCommunity(e.target.value as CommunityId)} className="input">
                {Object.entries(COMMUNITIES).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
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
