'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface SeoSettings {
  siteName: string
  baseUrl: string
  defaultOgImage: string
  twitterHandle: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SeoSettings | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/seo')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      siteName: formData.get('siteName') as string,
      baseUrl: formData.get('baseUrl') as string,
      defaultOgImage: formData.get('defaultOgImage') as string,
      twitterHandle: formData.get('twitterHandle') as string,
    }

    try {
      const res = await fetch('/api/admin/settings/seo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setMessage('✓ Settings saved successfully')
        const updated = await res.json()
        setSettings(updated)
      } else {
        setMessage('✗ Failed to save settings')
      }
    } catch (error) {
      setMessage('✗ Error saving settings')
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A86A' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
          SEO & Domain Settings
        </h1>
        <p style={{ color: '#B8B8B8', marginBottom: '3rem' }}>
          Update base URL and Open Graph settings after domain goes live
        </p>

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '2.5rem 2rem',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              defaultValue={settings?.siteName || 'SweetB'}
              required
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
              Base URL (e.g., https://sweetb.co)
            </label>
            <input
              type="url"
              name="baseUrl"
              defaultValue={settings?.baseUrl || 'https://sweetb.co'}
              required
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <small style={{ color: '#B8B8B8', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
              Used for canonical URLs, sitemap, and Open Graph URLs
            </small>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
              Default Open Graph Image Path
            </label>
            <input
              type="text"
              name="defaultOgImage"
              defaultValue={settings?.defaultOgImage || '/og/default.jpg'}
              required
              placeholder="/og/default.jpg"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <small style={{ color: '#B8B8B8', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
              Path relative to domain (e.g., /og/default.jpg) or full URL
            </small>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', color: '#C9A86A', marginBottom: '0.5rem', fontWeight: '500' }}>
              Twitter Handle (optional)
            </label>
            <input
              type="text"
              name="twitterHandle"
              defaultValue={settings?.twitterHandle || '@sweetb'}
              placeholder="@sweetb"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '1rem 2.5rem',
              backgroundColor: '#C9A86A',
              border: 'none',
              color: '#0A0A0A',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Save SEO Settings
          </button>

          {message && (
            <div style={{
              marginTop: '1.5rem',
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
        </form>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'rgba(201, 168, 106, 0.05)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            color: '#C9A86A',
            marginBottom: '1rem',
          }}>
            Important Notes
          </h2>
          <ul style={{ color: '#B8B8B8', fontSize: '0.9375rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li>Base URL changes affect all canonical URLs, sitemaps, and Open Graph meta tags</li>
            <li>Always use HTTPS protocol in production</li>
            <li>Do not include trailing slashes in base URL</li>
            <li>After changing settings, sitemap will automatically reflect new URLs</li>
            <li>Changes take effect immediately across the entire site</li>
          </ul>
        </div>
      </div>
    </div>
  )
}




