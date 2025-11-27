'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FeatureFlag {
  key: string
  enabled: boolean
  updatedAt: string
}

export default function AdminFlagsPage() {
  const router = useRouter()
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    try {
      const res = await fetch('/api/admin/flags')
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setFlags(data.flags || [])
    } catch (err) {
      console.error('Failed to fetch flags:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Toggle failed')
      }

      setMessage(`Feature "${key}" ${enabled ? 'enabled' : 'disabled'}`)
      await fetchFlags()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const flagDescriptions: Record<string, string> = {
    lucky_draw_enabled: 'Allow users to enter lucky draws on the /lucky-draw page',
    random_draw_enabled: 'Enable random selection algorithm for lucky draw winners',
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#F8F8F8',
          marginBottom: '2rem',
        }}>
          Feature Flags
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {flags.map((flag) => (
            <div
              key={flag.key}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '500', 
                  color: '#F8F8F8',
                  marginBottom: '0.5rem',
                  fontFamily: 'monospace',
                }}>
                  {flag.key}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#B8B8B8', lineHeight: '1.5' }}>
                  {flagDescriptions[flag.key] || 'No description available'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#B8B8B8', marginTop: '0.5rem' }}>
                  Last updated: {new Date(flag.updatedAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleToggle(flag.key, !flag.enabled)}
                style={{
                  position: 'relative',
                  width: '60px',
                  height: '32px',
                  backgroundColor: flag.enabled ? '#C9A86A' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(201, 168, 106, 0.5)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  backgroundColor: flag.enabled ? '#0A0A0A' : '#B8B8B8',
                  borderRadius: '50%',
                  top: '3px',
                  left: flag.enabled ? 'calc(100% - 28px)' : '4px',
                  transition: 'all 0.3s ease',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

