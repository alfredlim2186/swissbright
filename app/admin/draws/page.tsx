'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Draw {
  id: string
  title: string
  description: string | null
  status: string
  maxWinners: number
  createdAt: string
  _count: {
    entries: number
    winners: number
  }
}

export default function AdminDrawsPage() {
  const router = useRouter()
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxWinners, setMaxWinners] = useState('1')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDraws()
  }, [])

  const fetchDraws = async () => {
    try {
      const res = await fetch('/api/admin/draws')
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setDraws(data.draws || [])
    } catch (err) {
      console.error('Failed to fetch draws:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDraw = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description: description || null,
          maxWinners: parseInt(maxWinners),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create draw')
      }

      setMessage('Draw created successfully')
      setCreating(false)
      setTitle('')
      setDescription('')
      setMaxWinners('1')
      await fetchDraws()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleChangeStatus = async (id: string, action: 'open' | 'close' | 'draw') => {
    try {
      const res = await fetch(`/api/admin/draws/${id}/${action}`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed to ${action} draw`)
      }

      const data = await res.json()
      
      if (action === 'draw' && data.winners) {
        setMessage(`Winners selected! ${data.winners.length} winner(s) have been notified.`)
      } else {
        setMessage(`Draw ${action === 'open' ? 'opened' : action === 'close' ? 'closed' : 'completed'} successfully`)
      }
      
      await fetchDraws()
      setTimeout(() => setMessage(''), 5000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F8F8F8', padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            color: '#F8F8F8',
          }}>
            Lucky Draws
          </h1>
          <button
            onClick={() => setCreating(true)}
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
            + Create New Draw
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

        {/* Draws List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {draws.map((draw) => (
            <div
              key={draw.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.5rem',
                    color: '#F8F8F8',
                    marginBottom: '0.5rem',
                  }}>
                    {draw.title}
                  </h3>
                  {draw.description && (
                    <p style={{ color: '#B8B8B8', fontSize: '0.95rem', marginBottom: '1rem' }}>
                      {draw.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: '#B8B8B8' }}>Status: </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 
                          draw.status === 'DRAFT' ? 'rgba(156, 163, 175, 0.2)' :
                          draw.status === 'OPEN' ? 'rgba(34, 197, 94, 0.2)' :
                          draw.status === 'CLOSED' ? 'rgba(234, 179, 8, 0.2)' :
                          'rgba(59, 130, 246, 0.2)',
                        color:
                          draw.status === 'DRAFT' ? '#D1D5DB' :
                          draw.status === 'OPEN' ? '#86EFAC' :
                          draw.status === 'CLOSED' ? '#FDE047' :
                          '#93C5FD',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}>
                        {draw.status}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#B8B8B8' }}>Entries: </span>
                      <span style={{ color: '#F8F8F8', fontWeight: 'bold' }}>{draw._count.entries}</span>
                    </div>
                    <div>
                      <span style={{ color: '#B8B8B8' }}>Winners: </span>
                      <span style={{ color: '#F8F8F8', fontWeight: 'bold' }}>{draw._count.winners}/{draw.maxWinners}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {draw.status === 'DRAFT' && (
                    <button
                      onClick={() => handleChangeStatus(draw.id, 'open')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#86EFAC',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Open
                    </button>
                  )}
                  {draw.status === 'OPEN' && (
                    <button
                      onClick={() => handleChangeStatus(draw.id, 'close')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(234, 179, 8, 0.2)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        color: '#FDE047',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                  )}
                  {draw.status === 'CLOSED' && draw._count.winners === 0 && (
                    <button
                      onClick={() => handleChangeStatus(draw.id, 'draw')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(201, 168, 106, 0.2)',
                        border: '1px solid rgba(201, 168, 106, 0.3)',
                        color: '#C9A86A',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      🎲 Draw Winners
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {draws.length === 0 && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
              <p style={{ color: '#B8B8B8', marginBottom: '1.5rem' }}>
                No draws created yet
              </p>
              <button
                onClick={() => setCreating(true)}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Create Your First Draw
              </button>
            </div>
          )}
        </div>

        {/* Create Draw Modal */}
        {creating && (
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
                Create Lucky Draw
              </h3>

              <form onSubmit={handleCreateDraw}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Monthly Giveaway"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description..."
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

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Number of Winners *
                  </label>
                  <input
                    type="number"
                    value={maxWinners}
                    onChange={(e) => setMaxWinners(e.target.value)}
                    required
                    min="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
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
                    Create Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(false)
                      setTitle('')
                      setDescription('')
                      setMaxWinners('1')
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
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

