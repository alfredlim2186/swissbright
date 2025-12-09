'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('Admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/basic-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        // Show detailed error in development
        const errorMsg = data.details 
          ? `${data.error}: ${data.details}` 
          : data.error || 'Invalid credentials'
        throw new Error(errorMsg)
      }

      window.location.href = '/admin'
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.25)',
          padding: '2.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            letterSpacing: '0.2rem',
            marginBottom: '1.5rem',
            color: '#C9A86A',
          }}
        >
          Swiss Bright Admin
        </div>

        <p
          style={{
            textAlign: 'center',
            color: '#b8b8b8',
            fontSize: '0.95rem',
            marginBottom: '2rem',
          }}
        >
          Restricted access. Authorized personnel only.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label
              htmlFor="username"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#f8f8f8', fontSize: '0.9rem' }}
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(201, 168, 106, 0.25)',
                color: '#f8f8f8',
                letterSpacing: '0.2rem',
                textTransform: 'uppercase',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '0.5rem', color: '#f8f8f8', fontSize: '0.9rem' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(201, 168, 106, 0.25)',
                color: '#f8f8f8',
                letterSpacing: '0.2rem',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#fca5a5',
                padding: '0.85rem',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.95rem 1.25rem',
              backgroundColor: loading ? 'rgba(201, 168, 106, 0.4)' : '#C9A86A',
              color: '#050505',
              border: 'none',
              fontWeight: 600,
              letterSpacing: '0.2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? 'Authenticating...' : 'Enter Console'}
          </button>
        </form>
      </div>
    </div>
  )
}


