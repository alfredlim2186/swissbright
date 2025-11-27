'use client'

import { useEffect, useState } from 'react'

type Courier = {
  id: string
  name: string
  description?: string | null
  fee: number
  feeCents: number
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const formatCurrency = (value: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(value)

export default function CouriersManager() {
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    fee: '',
    isActive: true,
    sortOrder: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/couriers')

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load couriers')
      }

      const data = await res.json()
      setCouriers(data.couriers || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load couriers')
    } finally {
      setLoading(false)
    }
  }

  const setBannerMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      fee: '',
      isActive: true,
      sortOrder: 0,
    })
    setEditingId(null)
  }

  const handleEdit = (courier: Courier) => {
    setForm({
      name: courier.name,
      description: courier.description || '',
      fee: courier.fee.toString(),
      isActive: courier.isActive,
      sortOrder: courier.sortOrder,
    })
    setEditingId(courier.id)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      const url = editingId ? `/api/admin/couriers/${editingId}` : '/api/admin/couriers'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          fee: Number(form.fee),
          isActive: form.isActive,
          sortOrder: form.sortOrder,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} courier`)
      }

      resetForm()
      await fetchData()
      setBannerMessage(`Courier ${editingId ? 'updated' : 'created'} successfully.`)
    } catch (err: any) {
      setError(err.message || `Failed to ${editingId ? 'update' : 'create'} courier`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this courier? This cannot be undone if it has been used in orders.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/couriers/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete courier')
      }

      await fetchData()
      setBannerMessage('Courier deleted.')
    } catch (err: any) {
      setError(err.message || 'Failed to delete courier')
    }
  }

  const handleToggleActive = async (courier: Courier) => {
    try {
      const res = await fetch(`/api/admin/couriers/${courier.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !courier.isActive,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update courier')
      }

      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to update courier')
    }
  }

  return (
    <div style={{ padding: '1rem 0 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#B8B8B8', fontSize: '0.8rem' }}>
            Logistics
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F8F8F8', marginBottom: '0.5rem' }}>
            Courier Management
          </h1>
          <p style={{ color: '#B8B8B8', maxWidth: '680px' }}>
            Manage available couriers and their shipping fees. Customers can select these during checkout.
          </p>
        </header>

        {(error || message) && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: `1px solid ${error ? '#FCA5A5' : 'rgba(201,168,106,0.4)'}`,
              color: error ? '#FCA5A5' : '#C9A86A',
              backgroundColor: error ? 'rgba(248,113,113,0.08)' : 'rgba(201,168,106,0.08)',
            }}
          >
            {error || message}
          </div>
        )}

        <section
          style={{
            border: '1px solid rgba(201,168,106,0.25)',
            borderRadius: '16px',
            padding: '2rem',
            background: 'rgba(0,0,0,0.35)',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#F8F8F8', marginBottom: '1rem' }}>
            {editingId ? 'Edit Courier' : 'Add New Courier'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
              <label style={labelStyle}>
                <span>Name *</span>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g., Pos Laju, J&T Express"
                />
              </label>
              <label style={labelStyle}>
                <span>Shipping Fee (MYR) *</span>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.fee}
                  onChange={(e) => setForm((prev) => ({ ...prev, fee: e.target.value }))}
                  required
                  placeholder="0.00"
                />
              </label>
              <label style={labelStyle}>
                <span>Sort Order</span>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                />
              </label>
            </div>
            <label style={labelStyle}>
              <span>Description</span>
              <textarea
                style={{ ...inputStyle, minHeight: '80px' }}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description or notes"
              />
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <span style={{ color: '#B8B8B8' }}>Active (visible to customers)</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#C9A86A',
                  color: '#050505',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {editingId ? 'Update Courier' : 'Create Courier'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(201,168,106,0.3)',
                    backgroundColor: 'transparent',
                    color: '#C9A86A',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8', marginBottom: '0.3rem' }}>
              All Couriers ({couriers.length})
            </h3>
            <p style={{ color: '#B8B8B8' }}>Manage courier options available during checkout.</p>
          </div>
          {loading ? (
            <div style={cardStyle}>Loading…</div>
          ) : couriers.length === 0 ? (
            <div style={cardStyle}>No couriers yet. Add one above.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {couriers.map((courier) => (
                <div key={courier.id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#F8F8F8' }}>
                          {courier.name}
                        </h4>
                        {!courier.isActive && (
                          <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(248,113,113,0.2)', color: '#FCA5A5', fontSize: '0.75rem', borderRadius: '4px' }}>
                            Inactive
                          </span>
                        )}
                      </div>
                      {courier.description && <p style={{ color: '#B8B8B8', marginBottom: '0.5rem' }}>{courier.description}</p>}
                      <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
                        Fee: <strong style={{ color: '#F8F8F8' }}>{formatCurrency(courier.fee)}</strong> • Sort: {courier.sortOrder}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleToggleActive(courier)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(201,168,106,0.3)',
                          backgroundColor: courier.isActive ? 'rgba(201,168,106,0.1)' : 'transparent',
                          color: '#C9A86A',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        {courier.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(courier)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(201,168,106,0.3)',
                          backgroundColor: 'transparent',
                          color: '#C9A86A',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(courier.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(248,113,113,0.3)',
                          backgroundColor: 'transparent',
                          color: '#FCA5A5',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.65rem',
  backgroundColor: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(201,168,106,0.25)',
  borderRadius: '6px',
  color: '#F8F8F8',
  fontSize: '0.9rem',
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(201,168,106,0.25)',
  borderRadius: '12px',
  padding: '1.5rem',
  background: 'rgba(0,0,0,0.35)',
}

