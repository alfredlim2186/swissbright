'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string | null
  totalPurchases: number
  totalGifts: number
  createdAt: string
  role: string
  phoneNumber?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  profileUpdatedAt?: string | null
}

const SORTABLE_COLUMNS = ['email', 'name', 'totalPurchases', 'totalGifts', 'createdAt'] as const
type SortColumn = (typeof SORTABLE_COLUMNS)[number]

const DELIVERY_FIELDS: (keyof User)[] = [
  'phoneNumber',
  'addressLine1',
  'city',
  'state',
  'postalCode',
  'country',
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [adjusting, setAdjusting] = useState<string | null>(null)
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  const [sortBy, setSortBy] = useState<SortColumn>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', completeOnly: false })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  useEffect(() => {
    fetchUsers()
  }, [sortBy, sortDirection, appliedFilters])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        direction: sortDirection,
      })
      if (appliedFilters.dateFrom) params.set('from', appliedFilters.dateFrom)
      if (appliedFilters.dateTo) params.set('to', appliedFilters.dateTo)
      if (appliedFilters.completeOnly) params.set('complete', 'true')

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustSales = async (userId: string) => {
    if (!delta || !reason) {
      alert('Please enter both delta and reason')
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/adjust-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          delta: parseInt(delta), 
          reason 
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Adjustment failed')
      }

      setMessage('Sales adjusted successfully')
      setAdjusting(null)
      setDelta('')
      setReason('')
      await fetchUsers()

      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleEdit = (user: User) => {
    setEditing(user.id)
    setEditForm({
      name: user.name || '',
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      addressLine1: user.addressLine1 || '',
      addressLine2: user.addressLine2 || '',
      city: user.city || '',
      state: user.state || '',
      postalCode: user.postalCode || '',
      country: user.country || '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editing) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${editing}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name || null,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber || null,
          addressLine1: editForm.addressLine1 || null,
          addressLine2: editForm.addressLine2 || null,
          city: editForm.city || null,
          state: editForm.state || null,
          postalCode: editForm.postalCode || null,
          country: editForm.country || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Update failed')
      }

      setMessage('User details updated successfully')
      setEditing(null)
      setEditForm({})
      await fetchUsers()

      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSort = (column: SortColumn) => {
    setSortBy(column)
    setSortDirection((prev) => (column === sortBy ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'))
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
  }

  const isProfileComplete = (user: User) =>
    DELIVERY_FIELDS.every((field) => (user[field] as string | null)?.trim())

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#F8F8F8',
          marginBottom: '2rem',
        }}>
          User Management
        </h1>

        {message && (
          <div style={{
            backgroundColor: 'rgba(201, 168, 106, 0.1)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            color: '#C9A86A',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        {/* Search & Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', color: '#B8B8B8', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', color: '#B8B8B8', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.65rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', color: '#B8B8B8', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.65rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B8B8B8', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={filters.completeOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, completeOnly: e.target.checked }))}
              />
              Only show complete profiles
            </label>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={applyFilters}
              style={{
                padding: '0.65rem 1.5rem',
                backgroundColor: '#C9A86A',
                color: '#0A0A0A',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.1rem',
              }}
            >
              Apply Filters
            </button>
            <Link
              href="/admin/exports"
              style={{
                padding: '0.65rem 1.5rem',
                border: '1px solid rgba(201, 168, 106, 0.5)',
                color: '#C9A86A',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Export Data ↗
            </Link>
          </div>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          overflow: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201, 168, 106, 0.3)' }}>
                {[
                  { key: 'email', label: 'Email' },
                  { key: 'name', label: 'Name' },
                  { key: 'totalPurchases', label: 'Purchases' },
                  { key: 'totalGifts', label: 'Gifts' },
                  { key: 'createdAt', label: 'Registered' },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key as SortColumn)}
                    style={{
                      padding: '1rem',
                      textAlign: column.key === 'email' || column.key === 'name' ? 'left' : 'center',
                      color: '#C9A86A',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    {column.label}{' '}
                    {sortBy === column.key && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                ))}
                <th style={{ padding: '1rem', textAlign: 'left', color: '#C9A86A', fontSize: '0.875rem' }}>Contact</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#C9A86A', fontSize: '0.875rem' }}>Address</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Profile</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(201, 168, 106, 0.1)' }}>
                  <td style={{ padding: '1rem', color: '#F8F8F8', fontSize: '0.95rem' }}>{user.email}</td>
                  <td style={{ padding: '1rem', color: '#B8B8B8', fontSize: '0.95rem' }}>{user.name || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#F8F8F8', fontWeight: 'bold' }}>{user.totalPurchases}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#F8F8F8', fontWeight: 'bold' }}>{user.totalGifts}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#B8B8B8', fontSize: '0.85rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', color: '#F8F8F8', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                    {user.phoneNumber || '-'}
                  </td>
                  <td style={{ padding: '1rem', color: '#B8B8B8', fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
                    {[user.addressLine1, user.addressLine2, user.city, user.state, user.postalCode, user.country]
                      .filter(Boolean)
                      .join('\n') || '-'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      backgroundColor: isProfileComplete(user) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.15)',
                      color: isProfileComplete(user) ? '#86EFAC' : '#FDE047',
                    }}>
                      {isProfileComplete(user) ? 'Complete' : 'Missing info'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: user.role === 'ADMIN' ? 'rgba(201, 168, 106, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: user.role === 'ADMIN' ? '#C9A86A' : '#B8B8B8',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(201, 168, 106, 0.5)',
                          color: '#C9A86A',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setAdjusting(user.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(201, 168, 106, 0.5)',
                          color: '#C9A86A',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        Adjust Sales
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
        {editing && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            overflowY: 'auto',
          }}>
            <div style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid rgba(201, 168, 106, 0.5)',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
              }}>
                Edit User Details
              </h3>

              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    placeholder="Phone number"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={editForm.addressLine1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
                    placeholder="Street address"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={editForm.addressLine2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })}
                    placeholder="Apartment, suite, etc. (optional)"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      placeholder="City"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#F8F8F8',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      State
                    </label>
                    <input
                      type="text"
                      value={editForm.state || ''}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      placeholder="State"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#F8F8F8',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={editForm.postalCode || ''}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      placeholder="Postal code"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#F8F8F8',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={editForm.country || ''}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      placeholder="Country"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#F8F8F8',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editForm.email}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: saving || !editForm.email ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
                    color: '#0A0A0A',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: saving || !editForm.email ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(null)
                    setEditForm({})
                  }}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: 'transparent',
                    color: '#B8B8B8',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Adjust Sales Modal */}
        {adjusting && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}>
            <div style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid rgba(201, 168, 106, 0.5)',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
              }}>
                Adjust Sales Count
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Delta (positive or negative number)
                </label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  placeholder="e.g. 5 or -2"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleAdjustSales(adjusting)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: '#C9A86A',
                    color: '#0A0A0A',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setAdjusting(null)
                    setDelta('')
                    setReason('')
                  }}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    backgroundColor: 'transparent',
                    color: '#B8B8B8',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

