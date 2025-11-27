'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type MediaFile = {
  filename: string
  url: string
  size: number
  createdAt: string
  modifiedAt: string
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/media')

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load media')
      }

      const data = await res.json()
      setMedia(data.media || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load media')
    } finally {
      setLoading(false)
    }
  }

  const setBannerMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setMessage(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/content/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      setBannerMessage('✓ Image uploaded successfully')
      await fetchMedia()
      // Reset file input
      event.target.value = ''
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(filename)
      setError(null)

      const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete file')
      }

      setBannerMessage('✓ Image deleted successfully')
      await fetchMedia()
    } catch (err: any) {
      setError(err.message || 'Failed to delete image')
    } finally {
      setDeleting(null)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setBannerMessage('✓ URL copied to clipboard')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading media library…
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem 0 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#B8B8B8', fontSize: '0.8rem' }}>
            Assets
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F8F8F8', marginBottom: '0.5rem' }}>
            Media Library
          </h1>
          <p style={{ color: '#B8B8B8', maxWidth: '680px' }}>
            Upload and manage all images for your website. Use these images in products, content sections, and throughout your site.
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

        {/* Upload Section */}
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
            Upload New Image
          </h2>
          <p style={{ color: '#B8B8B8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Supported formats: JPEG, PNG, WebP, GIF. Maximum file size: 5MB.
          </p>
          <label
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#C9A86A',
              color: '#050505',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: uploading ? 0.6 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </label>
        </section>

        {/* Media Grid */}
        <section>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8', marginBottom: '0.3rem' }}>
              All Images ({media.length})
            </h3>
          </div>

          {media.length === 0 ? (
            <div
              style={{
                border: '1px dashed rgba(201,168,106,0.4)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#B8B8B8',
                borderRadius: '12px',
              }}
            >
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No images yet</p>
              <p style={{ fontSize: '0.9rem' }}>Upload your first image using the form above</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {media.map((file) => (
                <div
                  key={file.filename}
                  style={{
                    border: '1px solid rgba(201,168,106,0.25)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={file.url}
                      alt={file.filename}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p
                      style={{
                        color: '#F8F8F8',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        marginBottom: '0.5rem',
                        wordBreak: 'break-word',
                      }}
                    >
                      {file.filename}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
                      <p style={{ color: '#B8B8B8', fontSize: '0.8rem' }}>Size: {formatFileSize(file.size)}</p>
                      <p style={{ color: '#B8B8B8', fontSize: '0.8rem' }}>Uploaded: {formatDate(file.createdAt)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(201,168,106,0.3)',
                          backgroundColor: 'transparent',
                          color: '#C9A86A',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          minWidth: '80px',
                        }}
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => handleDelete(file.filename)}
                        disabled={deleting === file.filename}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(248,113,113,0.3)',
                          backgroundColor: 'transparent',
                          color: '#FCA5A5',
                          cursor: deleting === file.filename ? 'not-allowed' : 'pointer',
                          fontSize: '0.85rem',
                          opacity: deleting === file.filename ? 0.6 : 1,
                          minWidth: '80px',
                        }}
                      >
                        {deleting === file.filename ? 'Deleting...' : 'Delete'}
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

