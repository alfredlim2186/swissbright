'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface ContactLink {
  id: string
  label: string
  url: string
  logoUrl?: string | null
  description?: string | null
  accentColor?: string | null
  sortOrder: number
  isActive: boolean
}

const defaultForm: Partial<ContactLink> = {
  label: '',
  url: '',
  logoUrl: '',
  description: '',
  accentColor: '',
  sortOrder: 0,
  isActive: true,
}

export default function ContactLinksManager() {
  const [links, setLinks] = useState<ContactLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contact-links')
      if (!res.ok) throw new Error('Failed to load contact methods')
      const data = await res.json()
      setLinks(data.links || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (field: keyof ContactLink, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (link: ContactLink) => {
    setEditingId(link.id)
    setForm({
      label: link.label,
      url: link.url,
      logoUrl: link.logoUrl || '',
      description: link.description || '',
      accentColor: link.accentColor || '',
      sortOrder: link.sortOrder,
      isActive: link.isActive,
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(defaultForm)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const method = editingId ? 'PATCH' : 'POST'
      const url = editingId ? `/api/admin/contact-links/${editingId}` : '/api/admin/contact-links'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
          isActive: form.isActive ?? true,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      await fetchLinks()
      resetForm()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact method?')) return
    try {
      const res = await fetch(`/api/admin/contact-links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchLinks()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const activeLinks = useMemo(() => links.filter((l) => l.isActive), [links])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem', color: '#F8F8F8' }}>
        Loading contact methods...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: '#B8B8B8', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F8F8F8', marginBottom: '1rem' }}>
          Contact Methods
        </h1>
        <p style={{ color: '#B8B8B8', marginBottom: '2rem' }}>Add or edit contact buttons shown on the contact page.</p>

        {error && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#FCA5A5', padding: '1rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 400px) 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <h2 style={{ color: '#C9A86A', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
              {editingId ? 'Edit Contact Method' : 'Create Contact Method'}
            </h2>

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>Label</label>
            <input
              required
              value={form.label}
              onChange={(e) => handleInput('label', e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>URL</label>
            <input
              required
              value={form.url}
              onChange={(e) => handleInput('url', e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>Logo URL</label>
            <input
              value={form.logoUrl || ''}
              onChange={(e) => handleInput('logoUrl', e.target.value)}
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handleInput('description', e.target.value)}
              rows={3}
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>Accent Color</label>
            <input
              value={form.accentColor || ''}
              onChange={(e) => handleInput('accentColor', e.target.value)}
              placeholder="#C9A86A"
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => handleInput('sortOrder', Number(e.target.value))}
              style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 168, 106, 0.2)', color: '#F8F8F8' }}
            />

            <label style={{ display: 'flex', gap: '0.5rem', color: '#F8F8F8' }}>
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) => handleInput('isActive', e.target.checked)}
              />
              Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  backgroundColor: '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  letterSpacing: '0.1rem',
                }}
              >
                {saving ? 'Saving...' : editingId ? 'Update Contact' : 'Add Contact'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: 'transparent',
                    color: '#B8B8B8',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.length === 0 && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(201, 168, 106, 0.3)',
                padding: '2rem',
                color: '#B8B8B8',
                textAlign: 'center',
              }}>
                No contact links configured yet.
              </div>
            )}

            {links.map((link) => (
              <div
                key={link.id}
                style={{
                  backgroundColor: link.isActive ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${link.accentColor || 'rgba(201, 168, 106, 0.3)'}`,
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {link.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.logoUrl} alt={link.label} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: link.accentColor || '#fff', fontWeight: '600' }}>
                      {link.label.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#F8F8F8', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
                    {link.label}
                  </div>
                  <div style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{link.url}</div>
                  {link.description && <div style={{ color: '#888', fontSize: '0.8rem' }}>{link.description}</div>}
                  <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: link.isActive ? '#86EFAC' : '#F87171' }}>
                    {link.isActive ? 'Active' : 'Hidden'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(link)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(201, 168, 106, 0.4)',
                      color: '#C9A86A',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#F87171',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

