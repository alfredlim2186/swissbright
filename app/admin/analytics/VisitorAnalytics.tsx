'use client'

import { useState, useEffect } from 'react'

interface VisitorStats {
  totalVisits: number
  uniqueVisitors: number
  visitsByDay: Record<string, { total: number; unique: number }>
  topPages: Array<{ page: string; count: number }>
  trends: {
    visits: number
    unique: number
  }
}

export default function VisitorAnalytics() {
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all')
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics/visitors?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch visitor stats:', errorData)
        alert(`Failed to load visitor statistics: ${errorData.error || 'Unknown error'}\n${errorData.details ? `Details: ${errorData.details}` : ''}`)
      }
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error)
      alert(`Failed to load visitor statistics: ${error instanceof Error ? error.message : 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm(`Are you sure you want to reset ${period === 'all' ? 'all' : period === 'month' ? 'this month\'s' : 'this week\'s'} visitor statistics? This action cannot be undone.`)) {
      return
    }

    setResetting(true)
    try {
      const response = await fetch('/api/admin/analytics/visitors/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      })

      if (response.ok) {
        await fetchStats()
        alert('Visitor statistics reset successfully')
      } else {
        alert('Failed to reset statistics')
      }
    } catch (error) {
      console.error('Failed to reset stats:', error)
      alert('Failed to reset statistics')
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#B8B8B8' }}>
        Loading visitor statistics...
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#B8B8B8' }}>
        Failed to load visitor statistics
      </div>
    )
  }

  const visitsByDayArray = Object.entries(stats.visitsByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30) // Last 30 days

  const maxVisits = Math.max(...visitsByDayArray.map(([, data]) => data.total), 1)
  const maxUnique = Math.max(...visitsByDayArray.map(([, data]) => data.unique), 1)

  const formatTrend = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    const color = value >= 0 ? '#86EFAC' : '#F87171'
    return <span style={{ color }}>{sign}{value.toFixed(1)}%</span>
  }

  return (
    <div
      style={{
        border: '1px solid rgba(201,168,106,0.25)',
        borderRadius: '16px',
        padding: '2rem',
        background: 'rgba(255,255,255,0.02)',
        marginBottom: '2.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#F8F8F8', marginBottom: '0.25rem' }}>
            Visitor Analytics
          </h2>
          <p style={{ color: '#B8B8B8' }}>
            Track total visits and unique visitors with trend analysis
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'all' | 'month' | 'week')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(201,168,106,0.3)',
              borderRadius: '8px',
              color: '#F8F8F8',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(248, 113, 113, 0.2)',
              border: '1px solid rgba(248, 113, 113, 0.5)',
              borderRadius: '8px',
              color: '#F87171',
              cursor: resetting ? 'not-allowed' : 'pointer',
              opacity: resetting ? 0.5 : 1,
            }}
          >
            {resetting ? 'Resetting...' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(201,168,106,0.25)',
            borderRadius: '12px',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>Total Visits</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#F8F8F8', margin: '0.25rem 0' }}>
            {stats.totalVisits.toLocaleString()}
          </p>
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>
            Trend: {formatTrend(stats.trends.visits)}
          </p>
        </div>
        <div
          style={{
            border: '1px solid rgba(201,168,106,0.25)',
            borderRadius: '12px',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>Unique Visitors</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#F8F8F8', margin: '0.25rem 0' }}>
            {stats.uniqueVisitors.toLocaleString()}
          </p>
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>
            Trend: {formatTrend(stats.trends.unique)}
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      {visitsByDayArray.length > 0 && (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#C9A86A', marginBottom: '1rem' }}>
            Daily Trends (Last 30 Days)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visitsByDayArray.map(([date, data]) => (
              <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: '#B8B8B8', fontSize: '0.85rem', width: '100px' }}>
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '2px', height: '20px' }}>
                      <div
                        style={{
                          flex: data.total / maxVisits,
                          height: '100%',
                          backgroundColor: '#93C5FD',
                          borderRadius: '4px 0 0 4px',
                        }}
                        title={`Total: ${data.total}`}
                      />
                      <div
                        style={{
                          flex: data.unique / maxUnique,
                          height: '100%',
                          backgroundColor: '#86EFAC',
                          borderRadius: '0 4px 4px 0',
                        }}
                        title={`Unique: ${data.unique}`}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ width: '120px', textAlign: 'right', fontSize: '0.85rem', color: '#F8F8F8' }}>
                  <div style={{ color: '#93C5FD' }}>{data.total}</div>
                  <div style={{ color: '#86EFAC', fontSize: '0.75rem' }}>{data.unique} unique</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#B8B8B8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#93C5FD', borderRadius: '2px' }} />
              <span>Total Visits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#86EFAC', borderRadius: '2px' }} />
              <span>Unique Visitors</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Pages */}
      {stats.topPages.length > 0 && (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#C9A86A', marginBottom: '1rem' }}>
            Top Pages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.topPages.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <div style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>{item.page}</div>
                <div style={{ color: '#C9A86A', fontWeight: 600 }}>{item.count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

