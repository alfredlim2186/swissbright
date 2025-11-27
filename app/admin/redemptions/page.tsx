'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Redemption {
  id: string
  user: {
    email: string
    name: string | null
    phoneNumber?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
  }
  giftId?: string | null
  gift?: {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
  } | null
  giftDesc: string | null
  giftImageUrl: string | null
  status: string
  createdAt: string
  updatedAt: string
  courierName?: string | null
  trackingNumber?: string | null
  shippedAt?: string | null
}

export default function AdminRedemptionsPage() {
  const router = useRouter()
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [shipmentEditing, setShipmentEditing] = useState<Redemption | null>(null)
  const [courierName, setCourierName] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipmentError, setShipmentError] = useState('')
  const [shipmentLoading, setShipmentLoading] = useState(false)
  const [giftEditing, setGiftEditing] = useState<Redemption | null>(null)
  const [giftDesc, setGiftDesc] = useState('')
  const [giftImageUrl, setGiftImageUrl] = useState('')
  const [giftImagePreview, setGiftImagePreview] = useState<string | null>(null)
  const [giftImageFile, setGiftImageFile] = useState<File | null>(null)
  const [giftUploading, setGiftUploading] = useState(false)
  const [giftError, setGiftError] = useState('')

  useEffect(() => {
    fetchRedemptions()
  }, [])

  const fetchRedemptions = async () => {
    try {
      const res = await fetch('/api/admin/redemptions')
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setRedemptions(data.redemptions || [])
    } catch (err) {
      console.error('Failed to fetch redemptions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string, extra: Record<string, any> = {}) => {
    try {
      const res = await fetch(`/api/admin/redemptions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Update failed')
      }

      setMessage(`Redemption ${status.toLowerCase()} successfully`)
      await fetchRedemptions()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }


  const openShipmentModal = (redemption: Redemption) => {
    setShipmentEditing(redemption)
    setCourierName(redemption.courierName || '')
    setTrackingNumber(redemption.trackingNumber || '')
    setShipmentError('')
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setGiftError('Image size must be less than 5MB')
      return
    }

    setGiftImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setGiftImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleGiftSave = async () => {
    if (!giftEditing) return
    if (!giftDesc.trim()) {
      setGiftError('Gift description is required')
      return
    }

    setGiftUploading(true)
    setGiftError('')

    try {
      let imageUrl = giftImageUrl

      if (giftImageFile) {
        const formData = new FormData()
        formData.append('file', giftImageFile)
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          throw new Error('Failed to upload image')
        }
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      const res = await fetch(`/api/admin/redemptions/${giftEditing.id}/gift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftDesc,
          giftImageUrl: imageUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save gift details')
      }

      setGiftEditing(null)
      setGiftDesc('')
      setGiftImageUrl('')
      setGiftImagePreview(null)
      setGiftImageFile(null)
      await fetchRedemptions()
      setMessage('Gift details saved successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setGiftError(err.message || 'Failed to save gift details')
    } finally {
      setGiftUploading(false)
    }
  }

  const handleShipmentSave = async () => {
    if (!shipmentEditing) return
    if (!courierName.trim() || !trackingNumber.trim()) {
      setShipmentError('Courier name and tracking number are required.')
      return
    }
    setShipmentLoading(true)
    try {
      await handleUpdateStatus(shipmentEditing.id, 'SHIPPED', {
        courierName: courierName.trim(),
        trackingNumber: trackingNumber.trim(),
      })
      setShipmentEditing(null)
      setCourierName('')
      setTrackingNumber('')
    } catch (err: any) {
      setShipmentError(err.message)
    } finally {
      setShipmentLoading(false)
    }
  }

  const filteredRedemptions = filter === 'ALL'
    ? redemptions
    : redemptions.filter(r => r.status === filter)

  const statusCounts = {
    PENDING: redemptions.filter(r => r.status === 'PENDING').length,
    APPROVED: redemptions.filter(r => r.status === 'APPROVED').length,
    SHIPPED: redemptions.filter(r => r.status === 'SHIPPED').length,
    REJECTED: redemptions.filter(r => r.status === 'REJECTED').length,
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

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#F8F8F8',
          marginBottom: '2rem',
        }}>
          Gift Redemptions
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

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: filter === status ? '#C9A86A' : 'transparent',
                color: filter === status ? '#0A0A0A' : '#C9A86A',
                border: '1px solid #C9A86A',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {status} {status !== 'ALL' && `(${statusCounts[status as keyof typeof statusCounts]})`}
            </button>
          ))}
        </div>

        {/* Redemptions Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          overflow: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201, 168, 106, 0.3)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#C9A86A', fontSize: '0.875rem' }}>User</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#C9A86A', fontSize: '0.875rem' }}>Gift</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#C9A86A', fontSize: '0.875rem' }}>Shipment</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: '#C9A86A', fontSize: '0.875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRedemptions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#B8B8B8' }}>
                    No redemptions found
                  </td>
                </tr>
              ) : (
                filteredRedemptions.map((redemption) => (
                  <tr key={redemption.id} style={{ borderBottom: '1px solid rgba(201, 168, 106, 0.1)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#F8F8F8', fontSize: '0.95rem' }}>{redemption.user.email}</div>
                      {redemption.user.name && (
                        <div style={{ color: '#B8B8B8', fontSize: '0.8rem' }}>{redemption.user.name}</div>
                      )}
                      {redemption.user.phoneNumber && (
                        <div style={{ color: '#B8B8B8', fontSize: '0.8rem' }}>{redemption.user.phoneNumber}</div>
                      )}
                      {[redemption.user.addressLine1, redemption.user.city, redemption.user.country]
                        .filter(Boolean)
                        .length > 0 && (
                        <div style={{ color: '#7e7e7e', fontSize: '0.75rem', marginTop: '0.35rem', whiteSpace: 'pre-line' }}>
                          {[redemption.user.addressLine1, redemption.user.addressLine2, redemption.user.city, redemption.user.state, redemption.user.postalCode, redemption.user.country]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {(redemption.gift?.imageUrl || redemption.giftImageUrl) && (
                          <img
                            src={redemption.gift?.imageUrl || redemption.giftImageUrl || ''}
                            alt="Gift"
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid rgba(201, 168, 106, 0.3)',
                            }}
                          />
                        )}
                        <div style={{ color: '#B8B8B8', fontSize: '0.95rem', flex: 1 }}>
                          {redemption.gift ? (
                            <div>
                              <div style={{ color: '#F8F8F8', fontWeight: '500' }}>{redemption.gift.name}</div>
                              {redemption.gift.description && (
                                <div style={{ fontSize: '0.85rem', color: '#B8B8B8' }}>{redemption.gift.description}</div>
                              )}
                            </div>
                          ) : (
                            redemption.giftDesc || 'No gift selected'
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 
                          redemption.status === 'PENDING' ? 'rgba(234, 179, 8, 0.2)' :
                          redemption.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' :
                          redemption.status === 'SHIPPED' ? 'rgba(59, 130, 246, 0.2)' :
                          'rgba(220, 38, 38, 0.2)',
                        color:
                          redemption.status === 'PENDING' ? '#FDE047' :
                          redemption.status === 'APPROVED' ? '#86EFAC' :
                          redemption.status === 'SHIPPED' ? '#93C5FD' :
                          '#FCA5A5',
                        fontSize: '0.75rem',
                        borderRadius: '4px',
                      }}>
                        {redemption.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#B8B8B8', fontSize: '0.85rem' }}>
                      {new Date(redemption.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#B8B8B8', fontSize: '0.85rem' }}>
                      {redemption.courierName ? (
                        <>
                          <div style={{ color: '#F8F8F8' }}>{redemption.courierName}</div>
                          <div style={{ fontSize: '0.8rem' }}>{redemption.trackingNumber}</div>
                          <div style={{ fontSize: '0.75rem' }}>
                            Updated {new Date(redemption.updatedAt).toLocaleDateString()}
                          </div>
                        </>
                      ) : (
                        <em style={{ color: '#666' }}>No courier info</em>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {redemption.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(redemption.id, 'APPROVED')}
                              style={{
                                padding: '0.375rem 0.75rem',
                                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                color: '#86EFAC',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(redemption.id, 'REJECTED')}
                              style={{
                                padding: '0.375rem 0.75rem',
                                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                                border: '1px solid rgba(220, 38, 38, 0.3)',
                                color: '#FCA5A5',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {redemption.status === 'APPROVED' && (
                          <button
                            onClick={() => openShipmentModal(redemption)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              color: '#93C5FD',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            Update Shipment
                          </button>
                        )}
                        {redemption.status === 'SHIPPED' && (
                          <button
                            onClick={() => openShipmentModal(redemption)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#F8F8F8',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            Edit Courier
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Gift Details Modal - Removed: Gifts are now pre-configured and selected by customers */}
        {false && (
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
                Gift Details
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Gift Description
                </label>
                <textarea
                  value={giftDesc}
                  onChange={(e) => setGiftDesc(e.target.value)}
                  placeholder="e.g., Premium gift box with 10 candies"
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
                {giftImagePreview && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <img
                      src={giftImagePreview || undefined}
                      alt="Gift preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    cursor: 'pointer',
                  }}
                />
                <p style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Upload an image of the gift (JPG, PNG, WebP, max 5MB)
                </p>
              </div>

              {giftError && (
                <div style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#FCA5A5',
                  padding: '0.85rem',
                  marginBottom: '1rem',
                }}>
                  {giftError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleGiftSave}
                  disabled={giftUploading}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: giftUploading ? 'rgba(201, 168, 106, 0.3)' : '#C9A86A',
                    color: '#0A0A0A',
                    border: 'none',
                    fontWeight: 600,
                    cursor: giftUploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {giftUploading ? 'Uploading...' : 'Save Gift Details'}
                </button>
                <button
                  onClick={() => {
                    setGiftEditing(null)
                    setGiftDesc('')
                    setGiftImageUrl('')
                    setGiftImagePreview(null)
                    setGiftImageFile(null)
                    setGiftError('')
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

        {/* Shipment Modal */}
        {shipmentEditing && (
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
              maxWidth: '520px',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
              }}>
                Update Shipment
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  Courier Name
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g., DHL Express"
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
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking ID"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                  }}
                />
              </div>

              {shipmentError && (
                <div style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#FCA5A5',
                  padding: '0.85rem',
                  marginBottom: '1rem',
                }}>
                  {shipmentError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleShipmentSave}
                  disabled={shipmentLoading}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    backgroundColor: shipmentLoading ? 'rgba(59, 130, 246, 0.3)' : '#3B82F6',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: shipmentLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {shipmentLoading ? 'Saving...' : 'Save & Mark Shipped'}
                </button>
                <button
                  onClick={() => {
                    setShipmentEditing(null)
                    setCourierName('')
                    setTrackingNumber('')
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
      </div>
    </div>
  )
}

