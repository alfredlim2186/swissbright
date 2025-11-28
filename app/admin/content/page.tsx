'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type Language } from '@/lib/i18n-constants'

// Ingredient slugs for management
const INGREDIENT_SLUGS = [
  'korean-red-ginseng',
  'tongkat-ali',
  'maca-root',
  'l-arginine',
  'tribulus-terrestris',
]

const INGREDIENT_LABELS: { [key: string]: string } = {
  'korean-red-ginseng': 'Korean Red Ginseng',
  'tongkat-ali': 'Tongkat Ali',
  'maca-root': 'Maca Root',
  'l-arginine': 'L-Arginine',
  'tribulus-terrestris': 'Tribulus Terrestris',
}

// Ingredient Manager Component
function IngredientManager({ 
  content, 
  activeLanguage, 
  onUpdate, 
  onImageUpload,
  uploading,
  setUploading,
  setMessage,
}: {
  content: ContentItem[]
  activeLanguage: Language
  onUpdate: () => void
  onImageUpload: (key: string, file: File) => Promise<void>
  uploading: string | null
  setUploading: (key: string | null) => void
  setMessage: (msg: string) => void
}) {
  const [editing, setEditing] = useState<{ slug: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const getContentValue = (slug: string, field: string) => {
    const key = `ingredients.${slug}.${field}`
    return content.find((item) => item.key === key && item.language === activeLanguage)?.value || ''
  }

  const handleSave = async (slug: string, field: string, value: string, type: 'TEXT' | 'IMAGE' | 'ICON' = 'TEXT') => {
    try {
      const key = `ingredients.${slug}.${field}`
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key, 
          language: activeLanguage, 
          value,
          type,
          section: 'ingredients',
          // Sync images across all languages
          updateAllLanguages: type === 'IMAGE',
        }),
      })

      if (res.ok) {
        setMessage('✓ Ingredient updated successfully')
        setEditing(null)
        onUpdate()
        setTimeout(() => setMessage(''), 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setMessage(`✗ Failed to save: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage('✗ Error saving ingredient')
    }
  }

  const handleImageUploadForIngredient = async (slug: string, file: File) => {
    const key = `ingredients.${slug}.image`
    await onImageUpload(key, file)
  }

  return (
    <div>
      {INGREDIENT_SLUGS.map((slug) => {
        const name = getContentValue(slug, 'name') || INGREDIENT_LABELS[slug]
        const benefit = getContentValue(slug, 'benefit')
        const icon = getContentValue(slug, 'icon') || '🌿'
        const image = getContentValue(slug, 'image')
        const imageAlt = getContentValue(slug, 'imageAlt') || name

        return (
          <div
            key={slug}
            style={{
              marginBottom: '2.5rem',
              padding: '2rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              borderRadius: '12px',
            }}
          >
            <h4 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.25rem',
              color: '#C9A86A',
              marginBottom: '1.5rem',
            }}>
              {INGREDIENT_LABELS[slug]}
            </h4>

            {/* Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
                Name
              </label>
              {editing?.slug === slug && editing?.field === 'name' ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                      fontSize: '0.9375rem',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleSave(slug, 'name', editValue)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#C9A86A',
                        border: 'none',
                        color: '#0A0A0A',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#C9A86A',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#F8F8F8' }}>{name || 'Not set'}</span>
                  <button
                    onClick={() => {
                      setEditing({ slug, field: 'name' })
                      setEditValue(name)
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#C9A86A',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Benefit */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
                Benefit
              </label>
              {editing?.slug === slug && editing?.field === 'benefit' ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                      fontSize: '0.9375rem',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleSave(slug, 'benefit', editValue)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#C9A86A',
                        border: 'none',
                        color: '#0A0A0A',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#C9A86A',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#F8F8F8' }}>{benefit || 'Not set'}</span>
                  <button
                    onClick={() => {
                      setEditing({ slug, field: 'benefit' })
                      setEditValue(benefit)
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#C9A86A',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Icon */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
                Icon (Emoji)
              </label>
              {editing?.slug === slug && editing?.field === 'icon' ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="🌿"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                      fontSize: '1.25rem',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleSave(slug, 'icon', editValue, 'ICON')}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#C9A86A',
                        border: 'none',
                        color: '#0A0A0A',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#C9A86A',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{icon || '🌿'}</span>
                  <button
                    onClick={() => {
                      setEditing({ slug, field: 'icon' })
                      setEditValue(icon)
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#C9A86A',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Image */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
                Image (Cloudinary)
              </label>
              {image && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={image} 
                    alt={imageAlt}
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUploadForIngredient(slug, file)
                }}
                disabled={uploading === `ingredients.${slug}.image`}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#F8F8F8',
                  fontSize: '0.875rem',
                }}
              />
              {image && (
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    // Update image URL - will sync across all languages
                    handleSave(slug, 'image', e.target.value, 'IMAGE')
                  }}
                  placeholder="Or enter Cloudinary URL"
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    fontSize: '0.875rem',
                  }}
                />
              )}
              {uploading === `ingredients.${slug}.image` && (
                <p style={{ color: '#C9A86A', fontSize: '0.875rem', marginTop: '0.5rem' }}>Uploading...</p>
              )}
            </div>

            {/* Image Alt Text */}
            <div>
              <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
                Image Alt Text
              </label>
              {editing?.slug === slug && editing?.field === 'imageAlt' ? (
                <div>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                      fontSize: '0.9375rem',
                    }}
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleSave(slug, 'imageAlt', editValue)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#C9A86A',
                        border: 'none',
                        color: '#0A0A0A',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#C9A86A',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#F8F8F8' }}>{imageAlt || 'Not set'}</span>
                  <button
                    onClick={() => {
                      setEditing({ slug, field: 'imageAlt' })
                      setEditValue(imageAlt)
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#C9A86A',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface ContentItem {
  id: string
  key: string
  type: string
  value: string
  language: string
  page?: string | null
  section?: string | null
  label?: string | null
  description?: string | null
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [activeLanguage, setActiveLanguage] = useState<Language>('en')

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🎬' },
    { id: 'product', label: 'Product Showcase', icon: '📦' },
    { id: 'ingredients', label: 'Ingredients', icon: '🌿' },
    { id: 'safety', label: 'Safety Section', icon: '🛡️' },
    { id: 'popup', label: 'Popup/Modal', icon: '🎁' },
    { id: 'banking', label: 'Banking Details', icon: '🏦' },
    { id: 'terms', label: 'Terms & Conditions', icon: '📋' },
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'product-verification', label: 'Product Verification', icon: '✓' },
  ]

  useEffect(() => {
    fetchContent()
  }, [activeSection, activeLanguage])

  const fetchContent = async () => {
    try {
      // For terms, privacy, and product-verification, filter by page; for FAQ, filter by section
      let url = ''
      if (activeSection === 'terms' || activeSection === 'privacy' || activeSection === 'product-verification') {
        url = `/api/admin/content?page=${activeSection}&language=${activeLanguage}`
      } else if (activeSection === 'faq') {
        url = `/api/admin/content?section=faq&language=${activeLanguage}`
      } else {
        url = `/api/admin/content?section=${activeSection}&language=${activeLanguage}`
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: ContentItem) => {
    setEditing(item.key)
    setEditValue(item.value)
  }

  const handleSave = async (key: string) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key, 
          language: activeLanguage, 
          value: editValue,
          section: activeSection,
          type: 'TEXT',
        }),
      })

      if (res.ok) {
        setMessage('✓ Content saved successfully')
        setEditing(null)
        fetchContent()
        setTimeout(() => setMessage(''), 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setMessage(`✗ Failed to save content: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage('✗ Error saving content')
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setEditValue('')
  }

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(key)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/admin/content/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Upload failed')
      }

      const { path } = await uploadRes.json()

      // Update content with new image path for all languages
      const updateRes = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key, 
          language: activeLanguage, 
          value: path,
          type: 'IMAGE',
          updateAllLanguages: true, // Sync image across all languages
        }),
      })

      if (updateRes.ok) {
        setMessage('✓ Image uploaded and saved')
        fetchContent()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('✗ Failed to save image path')
      }
    } catch (error) {
      setMessage('✗ Error uploading image')
    } finally {
      setUploading(null)
    }
  }

  const getContentByKey = (key: string) => {
    return content.find((item) => item.key === key)
  }

  const renderContentField = (key: string, label: string, type: 'TEXT' | 'IMAGE' | 'ICON', description?: string) => {
    const item = getContentByKey(key)
    const value = item?.value || ''
    const isEditing = editing === key

    if (type === 'IMAGE') {
      return (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
        }}>
          <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
            {label}
          </label>
          {description && (
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '1rem' }}>{description}</p>
          )}
          {value && (
            <div style={{ marginBottom: '1rem' }}>
              <img 
                src={value} 
                alt={label}
                style={{ 
                  maxWidth: '300px', 
                  maxHeight: '200px', 
                  objectFit: 'cover',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(key, file)
            }}
            disabled={uploading === key}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              color: '#F8F8F8',
              fontSize: '0.875rem',
            }}
          />
          {value && (
            <input
              type="text"
              value={value}
              onChange={(e) => {
                fetch('/api/admin/content', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    key, 
                    value: e.target.value,
                    type: 'IMAGE',
                    language: activeLanguage,
                    updateAllLanguages: true, // Sync image across all languages
                  }),
                }).then(() => fetchContent())
              }}
              placeholder="Or enter image URL/path"
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '0.875rem',
              }}
            />
          )}
          {uploading === key && (
            <p style={{ color: '#C9A86A', fontSize: '0.875rem', marginTop: '0.5rem' }}>Uploading...</p>
          )}
        </div>
      )
    }

    if (type === 'ICON') {
      return (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
        }}>
          <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
            {label}
          </label>
          {description && (
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '1rem' }}>{description}</p>
          )}
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter emoji or icon (e.g., 🌿, ✦)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#F8F8F8',
                  fontSize: '1.25rem',
                }}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleSave(key)}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#C9A86A',
                    border: 'none',
                    color: '#0A0A0A',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#C9A86A',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{value || 'No icon'}</span>
              <button
                onClick={() => handleEdit({ key, value, type: 'ICON' } as ContentItem)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#C9A86A',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )
    }

    // TEXT type
    return (
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(201, 168, 106, 0.3)',
      }}>
        <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
          {label}
        </label>
        {description && (
          <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '1rem' }}>{description}</p>
        )}
        {isEditing ? (
          <div>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={label.includes('Description') ? 4 : 2}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button
                onClick={() => handleSave(key)}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#C9A86A',
                  border: 'none',
                  color: '#0A0A0A',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#C9A86A',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: '#F8F8F8', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
              {value || <span style={{ color: '#666' }}>No content set</span>}
            </p>
            <button
              onClick={() => handleEdit({ key, value, type: 'TEXT' } as ContentItem)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#C9A86A',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A86A' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/admin" style={{ color: '#C9A86A', textDecoration: 'none' }}>
            ← Back to Dashboard
          </Link>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#F8F8F8',
          marginBottom: '0.5rem',
        }}>
          Content Management
        </h1>
        <p style={{ color: '#B8B8B8', marginBottom: '2rem' }}>
          Edit text, images, and icons across your website
        </p>

        {/* Language Selector */}
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          borderRadius: '4px',
        }}>
          <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.75rem', fontWeight: '500' }}>
            Edit Language:
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setActiveLanguage(lang)
                  setEditing(null)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeLanguage === lang 
                    ? '#C9A86A' 
                    : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: activeLanguage === lang ? '#0A0A0A' : '#F8F8F8',
                  fontSize: '0.9375rem',
                  fontWeight: activeLanguage === lang ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '4px',
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>
                  {lang === 'en' ? '🇬🇧' : lang === 'ms' ? '🇲🇾' : '🇨🇳'}
                </span>
                {LANGUAGE_NAMES[lang]}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: message.includes('✓') 
              ? 'rgba(134, 239, 172, 0.1)' 
              : 'rgba(252, 165, 165, 0.1)',
            border: `1px solid ${message.includes('✓') ? '#86EFAC' : '#FCA5A5'}`,
            color: message.includes('✓') ? '#86EFAC' : '#FCA5A5',
          }}>
            {message}
          </div>
        )}

        {/* Section Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id)
                setEditing(null)
              }}
              style={{
                padding: '1rem 2rem',
                backgroundColor: activeSection === section.id 
                  ? '#C9A86A' 
                  : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: activeSection === section.id ? '#0A0A0A' : '#F8F8F8',
                fontSize: '1rem',
                fontWeight: activeSection === section.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Hero Section
            </h2>
            {renderContentField('hero.headline', 'Headline', 'TEXT', 'Main headline text')}
            {renderContentField('hero.subheadline', 'Subheadline', 'TEXT', 'Subheadline text below headline')}
            {renderContentField('hero.cta.primary', 'Primary CTA Button', 'TEXT', 'Text for primary button')}
            {renderContentField('hero.cta.secondary', 'Secondary CTA Button', 'TEXT', 'Text for secondary button')}
          </div>
        )}

        {/* Product Section */}
        {activeSection === 'product' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Product Showcase
            </h2>
            {renderContentField('product.eyebrow', 'Eyebrow Text', 'TEXT', 'Small text above title')}
            {renderContentField('product.title', 'Title', 'TEXT', 'Main product title')}
            {renderContentField('product.description', 'Description', 'TEXT', 'Product description text')}
            {renderContentField('product.image1', 'Product Image 1', 'IMAGE', 'First product lifestyle image')}
            {renderContentField('product.image2', 'Product Image 2', 'IMAGE', 'Second product lifestyle image')}
            
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#F8F8F8',
                marginBottom: '1.5rem',
              }}>
                Product Highlight Tiles
              </h3>
              {renderContentField('product.highlight.discreetFormat.title', 'Discreet Format - Title', 'TEXT', 'Title for "Discreet Format" tile')}
              {renderContentField('product.highlight.discreetFormat.description', 'Discreet Format - Description', 'TEXT', 'Description for "Discreet Format" tile')}
              {renderContentField('product.highlight.naturalBotanicals.title', 'Natural Botanicals - Title', 'TEXT', 'Title for "Natural Botanicals" tile')}
              {renderContentField('product.highlight.naturalBotanicals.description', 'Natural Botanicals - Description', 'TEXT', 'Description for "Natural Botanicals" tile')}
              {renderContentField('product.highlight.lastingEffects.title', 'Lasting Effects - Title', 'TEXT', 'Title for "Lasting Effects" tile')}
              {renderContentField('product.highlight.lastingEffects.description', 'Lasting Effects - Description', 'TEXT', 'Description for "Lasting Effects" tile')}
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        {activeSection === 'ingredients' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Ingredients Section
            </h2>
            {renderContentField('ingredients.title', 'Section Title', 'TEXT', 'Title for ingredients section')}
            {renderContentField('ingredients.description', 'Section Description', 'TEXT', 'Description for ingredients section')}
            
            <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                color: '#F8F8F8',
                marginBottom: '1rem',
              }}>
                Manage Ingredients
              </h3>
              <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
                Edit individual ingredients. Each ingredient needs a name, benefit, icon, and image. Images are uploaded to Cloudinary.
              </p>

              {/* Ingredient Management */}
              <IngredientManager 
                content={content}
                activeLanguage={activeLanguage}
                onUpdate={fetchContent}
                onImageUpload={handleImageUpload}
                uploading={uploading}
                setUploading={setUploading}
                setMessage={setMessage}
              />
            </div>
          </div>
        )}

        {/* Safety Section */}
        {activeSection === 'safety' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Safety Section
            </h2>
            {renderContentField('safety.title', 'Section Title', 'TEXT', 'Title for safety section')}
            {renderContentField('safety.description', 'Section Description', 'TEXT', 'Description for safety section')}
            {renderContentField('safety.closing', 'Closing Statement', 'TEXT', 'Closing statement text')}
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginTop: '2rem' }}>
              Note: Individual certification cards (icons, codes, titles, descriptions) are managed in the Safety component code.
            </p>
          </div>
        )}

        {/* Popup/Modal Section */}
        {activeSection === 'popup' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Popup/Modal Content
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Edit the content that appears in the promotional popup shown on page load. The popup appears once per user session.
              <br />
              <span style={{ color: '#C9A86A', fontSize: '0.8125rem', marginTop: '0.5rem', display: 'block' }}>
                Note: Title ("Unlock Member Perks") and icon (🎁) are fixed. Only the message and CTA button text are editable.
              </span>
            </p>
            {renderContentField('promotionalmodal.message', 'Popup Message', 'TEXT', 'Main message text displayed in the popup')}
            {renderContentField('promotionalmodal.cta', 'CTA Button Text', 'TEXT', 'Text for the call-to-action button')}
          </div>
        )}

        {/* Banking Details Section */}
        {activeSection === 'banking' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Banking Details
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Configure the bank account information displayed to customers during checkout. This information will be shown clearly on the shop checkout page.
            </p>
            {renderContentField('banking.bankName', 'Bank Name', 'TEXT', 'Name of the bank (e.g., Maybank, CIMB Bank, Public Bank)')}
            {renderContentField('banking.accountNumber', 'Account Number', 'TEXT', 'Bank account number for customer transfers')}
          </div>
        )}

        {/* Terms and Conditions Section */}
        {activeSection === 'terms' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Terms and Conditions
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Edit all content for the Terms and Conditions page. All sections are editable.
            </p>
            {content
              .filter(item => item.key.startsWith('terms.'))
              .sort((a, b) => a.key.localeCompare(b.key))
              .map(item => (
                <div key={item.key}>
                  {renderContentField(
                    item.key,
                    item.label || item.key.replace('terms.', '').replace(/\./g, ' '),
                    item.type as 'TEXT' | 'IMAGE' | 'ICON',
                    item.description || undefined
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Privacy Policy Section */}
        {activeSection === 'privacy' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Privacy Policy
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Edit all content for the Privacy Policy page. All sections are editable.
            </p>
            {content
              .filter(item => item.key.startsWith('privacy.'))
              .sort((a, b) => a.key.localeCompare(b.key))
              .map(item => (
                <div key={item.key}>
                  {renderContentField(
                    item.key,
                    item.label || item.key.replace('privacy.', '').replace(/\./g, ' '),
                    item.type as 'TEXT' | 'IMAGE' | 'ICON',
                    item.description || undefined
                  )}
                </div>
              ))}
          </div>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              FAQ
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Edit FAQ questions and answers. Questions are labeled with "q" and answers with "a".
            </p>
            {content
              .filter(item => item.key.startsWith('faq.'))
              .sort((a, b) => {
                // Sort by question/answer number, then by type (q before a)
                const aMatch = a.key.match(/faq\.([qa])(\d+)/)
                const bMatch = b.key.match(/faq\.([qa])(\d+)/)
                if (aMatch && bMatch) {
                  const aNum = parseInt(aMatch[2])
                  const bNum = parseInt(bMatch[2])
                  if (aNum !== bNum) return aNum - bNum
                  return aMatch[1] === 'q' ? -1 : 1
                }
                return a.key.localeCompare(b.key)
              })
              .map(item => (
                <div key={item.key}>
                  {renderContentField(
                    item.key,
                    item.label || item.key.replace('faq.', '').replace(/\./g, ' '),
                    item.type as 'TEXT' | 'IMAGE' | 'ICON',
                    item.description || undefined
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Product Verification Section */}
        {activeSection === 'product-verification' && (
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '2rem',
            }}>
              Product Verification
            </h2>
            <p style={{ color: '#B8B8B8', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Edit all content for the Product Verification page, including hero section, why section, steps, and images. The CTA link can also be edited here.
            </p>
            {content
              .filter(item => item.key.startsWith('productVerification.'))
              .sort((a, b) => {
                // Sort by section: hero, why, steps
                const getSectionOrder = (key: string) => {
                  if (key.includes('.eyebrow') || key.includes('.title') || key.includes('.description') || key.includes('.cta')) return 1
                  if (key.includes('.why') || key.includes('.protected')) return 2
                  if (key.includes('.steps')) return 3
                  return 4
                }
                const aOrder = getSectionOrder(a.key)
                const bOrder = getSectionOrder(b.key)
                if (aOrder !== bOrder) return aOrder - bOrder
                return a.key.localeCompare(b.key)
              })
              .map(item => (
                <div key={item.key}>
                  {renderContentField(
                    item.key,
                    item.label || item.key.replace('productVerification.', '').replace(/\./g, ' '),
                    item.type as 'TEXT' | 'IMAGE' | 'ICON',
                    item.description || undefined
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

