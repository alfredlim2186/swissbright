'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Draw {
  id: string
  title: string
  description: string | null
  status: string
  maxWinners: number
  createdAt: string
  hasEntered: boolean
  totalEntries: number
}

export default function LuckyDrawPage() {
  const [enabled, setEnabled] = useState(false)
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(true)
  const [entering, setEntering] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDraws()
  }, [])

  const fetchDraws = async () => {
    try {
      const res = await fetch('/api/draws')
      const data = await res.json()
      
      setEnabled(data.enabled || false)
      setDraws(data.draws || [])
    } catch (err) {
      console.error('Failed to fetch draws:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEnter = async (drawId: string) => {
    setEntering(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/draws/${drawId}/enter`, {
        method: 'POST',
      })

      const data = await res.json()

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to enter draw')
      }

      setMessage('You\'ve successfully entered the draw! Good luck! 🍀')
      await fetchDraws()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setEntering(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  if (!enabled) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '10vh' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎲</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            color: '#F8F8F8',
            marginBottom: '1rem',
          }}>
            Lucky Draw
          </h1>
          <p style={{ color: '#B8B8B8', fontSize: '1.125rem', marginBottom: '2rem' }}>
            No active draws at the moment. Check back soon!
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.875rem 2rem',
              backgroundColor: '#C9A86A',
              color: '#0A0A0A',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const activeDraws = draws.filter(d => d.status === 'OPEN')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/account" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Account
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎲</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            color: '#F8F8F8',
            marginBottom: '1rem',
          }}>
            Lucky Draw
          </h1>
          <p style={{ color: '#B8B8B8', fontSize: '1.125rem' }}>
            Enter for a chance to win exclusive prizes
          </p>
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

        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#FCA5A5',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {activeDraws.length === 0 ? (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <p style={{ color: '#B8B8B8' }}>
              No active draws right now. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeDraws.map((draw) => (
              <div
                key={draw.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  padding: '2rem',
                }}
              >
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.75rem',
                  color: '#C9A86A',
                  marginBottom: '1rem',
                }}>
                  {draw.title}
                </h2>

                {draw.description && (
                  <p style={{
                    color: '#B8B8B8',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                  }}>
                    {draw.description}
                  </p>
                )}

                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                }}>
                  <div>
                    <span style={{ color: '#B8B8B8', fontSize: '0.875rem' }}>Total Entries: </span>
                    <span style={{ color: '#F8F8F8', fontWeight: 'bold' }}>{draw.totalEntries}</span>
                  </div>
                  <div>
                    <span style={{ color: '#B8B8B8', fontSize: '0.875rem' }}>Winners: </span>
                    <span style={{ color: '#F8F8F8', fontWeight: 'bold' }}>{draw.maxWinners}</span>
                  </div>
                </div>

                {draw.hasEntered ? (
                  <div style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#86EFAC',
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                  }}>
                    ✅ You've already entered this draw
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnter(draw.id)}
                    disabled={entering}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: entering ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
                      color: '#0A0A0A',
                      border: 'none',
                      fontSize: '1.125rem',
                      fontWeight: '500',
                      cursor: entering ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {entering ? 'Entering...' : 'Enter Draw'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

