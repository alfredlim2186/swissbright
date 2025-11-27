'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Gift {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
  inventory?: number
  createdAt: string
  updatedAt: string
}

export default function AdminGiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<Gift | null>(null)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [sortOrder, setSortOrder] = useState('0')
  const [inventory, setInventory] = useState('0')
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<Array<{ filename: string; url: string; size: number }>>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/admin/gifts')
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setGifts(data.gifts || [])
    } catch (err) {
      console.error('Failed to fetch gifts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedia = async () => {
    setLoadingMedia(true)
    try {
      const res = await fetch('/api/admin/media')
      if (!res.ok) {
        throw new Error('Failed to load media')
      }
      const data = await res.json()
      setMediaFiles(data.media || [])
    } catch (err) {
      console.error('Failed to fetch media:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  const openMediaLibrary = () => {
    setShowMediaLibrary(true)
    fetchMedia()
  }

  const selectImageFromLibrary = (url: string) => {
    setImageUrl(url)
    setImagePreview(url)
    setShowMediaLibrary(false)
  }

  const openCreateModal = () => {
    setCreating(true)
    setName('')
    setDescription('')
    setImageUrl('')
    setIsActive(true)
    setSortOrder('0')
    setInventory('0')
    setImagePreview(null)
    setError('')
  }

  const openEditModal = (gift: Gift) => {
    setEditing(gift)
    setName(gift.name)
    setDescription(gift.description || '')
    setImageUrl(gift.imageUrl || '')
    setIsActive(gift.isActive)
    setSortOrder(gift.sortOrder.toString())
    setInventory((gift as any).inventory?.toString() || '0')
    setImagePreview(gift.imageUrl || null)
    setError('')
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Gift name is required')
      return
    }

    setError('')

    try {
      const url = editing ? `/api/admin/gifts/${editing.id}` : '/api/admin/gifts'
      const method = editing ? 'PATCH' : 'POST'

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        isActive,
        sortOrder: parseInt(sortOrder) || 0,
      inventory: Math.max(0, parseInt(inventory) || 0),
      }

      console.log('Sending gift data:', payload)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error('Save gift error response:', data)
        const errorMsg = data.message || 
                        (data.details && Array.isArray(data.details) ? data.details.map((d: any) => d.message || JSON.stringify(d)).join(', ') : '') ||
                        data.error || 
                        `Save failed (${res.status})`
        throw new Error(errorMsg)
      }

      setMessage(editing ? 'Gift updated successfully' : 'Gift created successfully')
      await fetchGifts()
      setCreating(false)
      setEditing(null)
      setName('')
      setDescription('')
      setImageUrl('')
      setImagePreview(null)
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gift? This cannot be undone if the gift has been used in redemptions.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/gifts/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }

      setMessage('Gift deleted successfully')
      await fetchGifts()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            color: '#F8F8F8',
          }}>
            Gift Catalog
          </h1>
          <button
            onClick={openCreateModal}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#C9A86A',
              color: '#0A0A0A',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            + Create New Gift
          </button>
        </div>

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

        {/* Gifts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {gifts.map((gift) => (
            <div
              key={gift.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '1.5rem',
                borderRadius: '8px',
              }}
            >
              {gift.imageUrl && (
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                  }}
                />
              )}
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem',
                color: '#F8F8F8',
                marginBottom: '0.5rem',
              }}>
                {gift.name}
              </h3>
              {gift.description && (
                <p style={{ color: '#B8B8B8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {gift.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: gift.isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: gift.isActive ? '#86EFAC' : '#D1D5DB',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                }}>
                  {gift.isActive ? 'Active' : 'Inactive'}
                </span>
                <span style={{ color: '#B8B8B8', fontSize: '0.75rem' }}>
                  Order: {gift.sortOrder}
                </span>
                <span style={{ color: '#B8B8B8', fontSize: '0.75rem' }}>
                  Inventory: {(gift.inventory || 0).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={() => openEditModal(gift)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: 'rgba(201, 168, 106, 0.2)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#C9A86A',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gift.id)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    color: '#FCA5A5',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {gifts.length === 0 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
            <p style={{ color: '#B8B8B8', marginBottom: '1.5rem' }}>
              No gifts created yet
            </p>
            <button
              onClick={openCreateModal}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#C9A86A',
                color: '#0A0A0A',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Create Your First Gift
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(creating || editing) && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1100,
          }}>
            <div style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              padding: '2rem',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
              }}>
                {editing ? 'Edit Gift' : 'Create New Gift'}
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Gift Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Premium Gift Box"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the gift..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Gift Image
                </label>
                {imagePreview && (
                  <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('')
                        setImagePreview(null)
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(220, 38, 38, 0.8)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={openMediaLibrary}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(201, 168, 106, 0.2)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#C9A86A',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  {imagePreview ? 'Change Image' : 'Select from Media Library'}
                </button>
                <p style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Choose an image from your media library
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Sort Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                  }}
                />
                <p style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Lower numbers appear first
                </p>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Inventory
                </label>
                <input
                  type="number"
                  min={0}
                  value={inventory}
                  onChange={(e) => setInventory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                  }}
                />
                <p style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Set how many units of this gift can be redeemed.
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F8F8F8', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Active (visible to customers)
                </label>
              </div>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#FCA5A5',
                  padding: '0.85rem',
                  marginBottom: '1rem',
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: '#C9A86A',
                    color: '#0A0A0A',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {editing ? 'Update Gift' : 'Create Gift'}
                </button>
                <button
                  onClick={() => {
                    setCreating(false)
                    setEditing(null)
                    setName('')
                    setDescription('')
                    setImageUrl('')
                    setImagePreview(null)
                    setError('')
                    setShowMediaLibrary(false)
                  }}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(201, 168, 106, 0.4)',
                    color: '#C9A86A',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Library Modal */}
        {showMediaLibrary && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1200,
          }}>
            <div style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              padding: '2rem',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  color: '#C9A86A',
                }}>
                  Select Image from Media Library
                </h3>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#C9A86A',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>

              {loadingMedia ? (
                <div style={{ textAlign: 'center', color: '#B8B8B8', padding: '2rem' }}>
                  Loading media library...
                </div>
              ) : mediaFiles.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#B8B8B8', padding: '2rem' }}>
                  <p>No images in media library.</p>
                  <Link
                    href="/admin/media"
                    style={{
                      display: 'inline-block',
                      marginTop: '1rem',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#C9A86A',
                      color: '#0A0A0A',
                      textDecoration: 'none',
                      fontWeight: '500',
                    }}
                  >
                    Go to Media Library
                  </Link>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '1rem',
                }}>
                  {mediaFiles.map((file) => (
                    <div
                      key={file.filename}
                      onClick={() => selectImageFromLibrary(file.url)}
                      style={{
                        border: imageUrl === file.url ? '2px solid #C9A86A' : '1px solid rgba(201, 168, 106, 0.3)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (imageUrl !== file.url) {
                          e.currentTarget.style.borderColor = 'rgba(201, 168, 106, 0.5)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (imageUrl !== file.url) {
                          e.currentTarget.style.borderColor = 'rgba(201, 168, 106, 0.3)'
                        }
                      }}
                    >
                      <img
                        src={file.url}
                        alt={file.filename}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {imageUrl === file.url && (
                        <div style={{
                          padding: '0.5rem',
                          backgroundColor: 'rgba(201, 168, 106, 0.2)',
                          textAlign: 'center',
                          color: '#C9A86A',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}>
                          Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

