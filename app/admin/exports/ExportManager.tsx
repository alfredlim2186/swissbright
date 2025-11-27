'use client'

import { useState } from 'react'
import Link from 'next/link'

const FORMATS = [
  { value: 'csv', label: 'CSV (Excel compatible)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
]

export default function ExportManager() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [format, setFormat] = useState('csv')

  const handleDownload = () => {
    const params = new URLSearchParams()
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo) params.set('to', dateTo)
    params.set('format', format)
    const url = `/api/admin/users/export?${params.toString()}`
    window.open(url, '_blank', 'noopener')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/admin" style={{ display: 'inline-block', color: '#B8B8B8', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          color: '#F8F8F8',
          marginBottom: '1rem',
        }}>
          Export User Data
        </h1>
        <p style={{ color: '#B8B8B8', marginBottom: '2rem' }}>
          Download filtered user records including delivery information and registration details.
        </p>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.35)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#B8B8B8', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                From (registration date)
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#F8F8F8',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#B8B8B8', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                To (registration date)
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#F8F8F8',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#B8B8B8', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            >
              {FORMATS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownload}
            style={{
              padding: '0.95rem 1.5rem',
              backgroundColor: '#C9A86A',
              color: '#0A0A0A',
              border: 'none',
              fontWeight: 600,
              letterSpacing: '0.2rem',
              cursor: 'pointer',
            }}
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  )
}


