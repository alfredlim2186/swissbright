'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))

type Stats = {
  totalCodes: number
  usedCodes: number
}

export type RecentCode = {
  id: string
  codeValue?: string | null
  securityCodeValue?: string | null
  codeLast4: string
  securityLast4: string
  batch: string | null
  productId: string | null
  createdAt: string
  usedAt: string | null
  usedByEmail: string | null
}

type UploadResult = {
  added: number
  duplicates?: string[]
  errors?: string[]
}

interface Props {
  initialStats: Stats
  initialRecent: RecentCode[]
}

const MAX_BATCH = 500

export default function VerificationCodesManager({ initialStats, initialRecent }: Props) {
  const [code, setCode] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [batch, setBatch] = useState('')
  const [productId, setProductId] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingCodes, setLoadingCodes] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const [codes, setCodes] = useState(initialRecent)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [result, setResult] = useState<UploadResult | null>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(50)

  const firstSearchRef = useRef(true)

  const fetchCodes = useCallback(
    async (term = '', nextPage = 1, nextPerPage = perPage) => {
    setLoadingCodes(true)
    setSelectedIds(new Set())
    setStatusMessage('')
    setError('')

    try {
      const trimmed = term.trim()
      const params = new URLSearchParams()
      if (trimmed) {
        params.set('search', trimmed)
      }
      params.set('page', String(Math.max(1, nextPage)))
      params.set('limit', String(nextPerPage))
      const url = `/api/admin/verification-codes${params.toString() ? `?${params}` : ''}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load verification codes')
      const data = await res.json()
      setStats(data.stats)
      setCodes(data.codes)
    } catch (err: any) {
      console.error('Unable to refresh verification codes data', err)
      setError(err.message || 'Unable to load verification codes')
    } finally {
      setLoadingCodes(false)
    }
    },
    [perPage],
  )

  const handleSearch = () => {
    setPage(1)
    fetchCodes(searchTerm, 1, perPage)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
    fetchCodes('', 1, perPage)
  }

  const handleManualSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!code || !securityCode) return
    setLoading(true)
    setResult(null)
    setError('')

    try {
      const response = await fetch('/api/admin/verification-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: [
            {
              code: code.trim(),
              securityCode: securityCode.trim(),
              batch: batch.trim() || undefined,
              productId: productId.trim() || undefined,
            },
          ],
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to save code')
      }

      const data = await response.json()
      setResult(data)
      setCode('')
      setSecurityCode('')
      setBatch('')
      setProductId('')
      await fetchCodes(searchTerm)
    } catch (err: any) {
      setError(err.message || 'Unable to save verification code')
    } finally {
      setLoading(false)
    }
  }

  const parseFile = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const entries: { code: string; securityCode: string; batch: string; productId: string }[] = []
    const errors: string[] = []

    lines.forEach((line, index) => {
      const cells = line.split(/[\t,;]+/).map((cell) => cell.trim())
      if (cells.length < 2) {
        errors.push(`Line ${index + 1} is missing required columns`)
        return
      }
      entries.push({
        code: cells[0],
        securityCode: cells[1],
        batch: cells[2] || '',
        productId: cells[3] || '',
      })
    })

    return { entries, errors }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)
    setError('')

    try {
      if (file.size === 0) {
        throw new Error('The selected file is empty.')
      }

      const text = await file.text()
      const { entries, errors: parseErrors } = parseFile(text)

      if (entries.length === 0) {
        throw new Error(parseErrors.join('; ') || 'No valid rows detected.')
      }

      if (entries.length > MAX_BATCH) {
        throw new Error(`Please upload no more than ${MAX_BATCH} entries at once.`)
      }

      const response = await fetch('/api/admin/verification-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to upload codes')
      }

      const data = await response.json()
      setResult({
        added: data.added,
        duplicates: data.duplicates,
        errors: [...(parseErrors || []), ...(data.errors || [])],
      })
      await fetchCodes(searchTerm)
      event.target.value = ''
    } catch (err: any) {
      setError(err.message || 'Unable to upload verification codes')
    } finally {
      setUploading(false)
    }
  }

  const toggleSelectAll = () => {
    if (codes.length === 0) return
    if (codes.every((code) => selectedIds.has(code.id))) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(codes.map((code) => code.id)))
  }

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this verification code?')) return
    setStatusMessage('')
    setError('')
    try {
      const response = await fetch('/api/admin/verification-codes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Delete failed')
      }
      const data = await response.json()
      setStatusMessage(`${data.deleted || 1} code deleted.`)
      await fetchCodes(searchTerm)
    } catch (err: any) {
      setError(err.message || 'Unable to delete code')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!window.confirm(`Delete ${selectedIds.size} selected code(s)?`)) return
    setStatusMessage('')
    setError('')
    try {
      const response = await fetch('/api/admin/verification-codes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Bulk delete failed')
      }
      const data = await response.json()
      setStatusMessage(`${data.deleted || 0} code(s) deleted.`)
      setSelectedIds(new Set())
      await fetchCodes(searchTerm)
    } catch (err: any) {
      setError(err.message || 'Unable to delete codes')
    }
  }

  const handleEdit = async (item: RecentCode) => {
    const replyCode = window.prompt('New verification code', item.codeValue || item.codeLast4 || '')
    if (!replyCode) return
    const replySecurity = window.prompt('New security code', item.securityCodeValue || '')
    if (!replySecurity) return
    setStatusMessage('')
    setError('')
    try {
      const response = await fetch('/api/admin/verification-codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          code: replyCode.trim(),
          securityCode: replySecurity.trim(),
        }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Update failed')
      }
      setStatusMessage('Code updated.')
      await fetchCodes(searchTerm)
    } catch (err: any) {
      setError(err.message || 'Unable to update code')
    }
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (firstSearchRef.current) {
      firstSearchRef.current = false
      return
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchCodes(searchTerm, 1, perPage)
    }, 400)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [fetchCodes, searchTerm])

  useEffect(() => {
    setPage(1)
    fetchCodes('', 1, perPage)
  }, [fetchCodes, perPage])

  const totalCodes = stats.totalCodes
  const totalPages = Math.max(1, Math.ceil(totalCodes / perPage))
  const startIndex = totalCodes === 0 ? 0 : (page - 1) * perPage + 1
  const endIndex = Math.min(totalCodes, page * perPage)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    fetchCodes(searchTerm, newPage, perPage)
  }

  const handlePerPageChange = (size: number) => {
    setPerPage(size)
    setPage(1)
    fetchCodes(searchTerm, 1, size)
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <p style={{ color: '#B8B8B8', margin: '0 0 0.25rem' }}>Total codes</p>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 600 }}>{stats.totalCodes}</p>
        </div>
        <div style={{ flex: '1 1 220px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <p style={{ color: '#B8B8B8', margin: '0 0 0.25rem' }}>Used codes</p>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 600 }}>{stats.usedCodes}</p>
        </div>
        <div style={{ flex: '1 1 220px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <p style={{ color: '#B8B8B8', margin: '0 0 0.25rem' }}>Available</p>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 600 }}>{stats.totalCodes - stats.usedCodes}</p>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <h3 style={{ color: '#F8F8F8', marginBottom: '1rem' }}>Add verification codes</h3>
        <form onSubmit={handleManualSubmit} style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ color: '#F8F8F8', fontSize: '0.85rem' }}>Verification code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              placeholder="E.g. SWEETB-1234"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ color: '#F8F8F8', fontSize: '0.85rem' }}>Security code</label>
            <input
              type="text"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value.trim())}
              placeholder="Security code"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ color: '#F8F8F8', fontSize: '0.85rem' }}>Batch (optional)</label>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="Batch code"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ color: '#F8F8F8', fontSize: '0.85rem' }}>Product ID (optional)</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Item SKU"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                color: '#F8F8F8',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code || !securityCode}
            style={{
              padding: '0.9rem 1.5rem',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: loading || !code || !securityCode ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
              color: '#0A0A0A',
              fontWeight: 600,
              cursor: loading || !code || !securityCode ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving…' : 'Save code'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <p style={{ color: '#B8B8B8', marginBottom: '0.5rem' }}>Or upload batches via CSV (code,security,batch,product)</p>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{
              color: '#F8F8F8',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(201, 168, 106, 0.4)',
              padding: '1rem',
              borderRadius: '8px',
              width: '100%',
            }}
          />
        </div>

        {(result || error) && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(34,197,94,0.1)',
              border: `1px solid ${error ? 'rgba(220, 38, 38, 0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: error ? '#FCA5A5' : '#86EFAC',
            }}
          >
            {error ? (
              <p style={{ margin: 0 }}>{error}</p>
            ) : (
              <div>
                <p style={{ margin: '0 0 0.35rem' }}>
                  {result?.added || 0} code{(result?.added || 0) === 1 ? '' : 's'} added.
                </p>
                {result?.duplicates?.length ? (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#FDE047' }}>
                    {result.duplicates.length} duplicate{result.duplicates.length === 1 ? '' : 's'} skipped.
                  </p>
                ) : null}
                {result?.errors?.length ? (
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#FDE047' }}>
                    {result.errors.length} rows failed; check formatting.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '1.5rem',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ color: '#F8F8F8', margin: '0 0 0.35rem 0' }}>All codes</h3>
            <p style={{ color: '#B8B8B8', margin: 0, fontSize: '0.85rem' }}>
              Showing {startIndex}-{endIndex} of {totalCodes} entries
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search code, security, batch, or product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,106,0.3)',
                color: '#F8F8F8',
                minWidth: '220px',
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loadingCodes}
              style={{
                padding: '0.45rem 0.9rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#C9A86A',
                color: '#0A0A0A',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              disabled={loadingCodes}
              style={{
                padding: '0.45rem 0.9rem',
                border: '1px solid rgba(201,168,106,0.5)',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#F8F8F8',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>Rows per page</span>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              style={{
                padding: '0.35rem 0.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,106,0.5)',
                color: '#F8F8F8',
              }}
            >
              {[20, 50, 100, 200].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(statusMessage || error) && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(34,197,94,0.1)',
              border: `1px solid ${error ? 'rgba(220, 38, 38, 0.3)' : 'rgba(34,197,94,0.3)'}`,
              color: error ? '#FCA5A5' : '#86EFAC',
            }}
          >
            {error ? error : statusMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.size === 0 || loadingCodes}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedIds.size === 0 ? 'rgba(201,168,106,0.5)' : '#EF4444',
              color: '#0A0A0A',
              fontWeight: 600,
              cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Delete selected ({selectedIds.size})
          </button>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loadingCodes}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid rgba(201,168,106,0.5)',
                backgroundColor: 'transparent',
                color: '#F8F8F8',
                cursor: page <= 1 || loadingCodes ? 'not-allowed' : 'pointer',
              }}
            >
              Prev
            </button>
            <span style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loadingCodes}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: '1px solid rgba(201,168,106,0.5)',
                backgroundColor: 'transparent',
                color: '#F8F8F8',
                cursor: page >= totalPages || loadingCodes ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#F8F8F8' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: '#B8B8B8' }}>
                <th style={{ padding: '0.5rem 0' }}>
                  <input
                    type="checkbox"
                    checked={codes.length > 0 && codes.every((code) => selectedIds.has(code.id))}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Code</th>
                <th>Security</th>
                <th>Batch</th>
                <th>Product</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingCodes ? (
                <tr>
                  <td colSpan={8} style={{ padding: '1rem', color: '#B8B8B8' }}>Loading …</td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '1rem', color: '#B8B8B8' }}>No verification codes yet.</td>
                </tr>
              ) : (
                codes.map((item) => (
                  <tr key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '0.65rem 0', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                      />
                    </td>
                    <td style={{ padding: '0.65rem 0', fontWeight: 600 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <code style={{ fontSize: '0.9rem' }}>{item.codeValue || item.codeLast4}</code>
                        {item.codeValue ? <small style={{ color: '#B8B8B8' }}>full value stored</small> : null}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <code style={{ fontSize: '0.9rem' }}>{item.securityCodeValue || item.securityLast4}</code>
                        {item.securityCodeValue ? <small style={{ color: '#B8B8B8' }}>full value stored</small> : null}
                      </div>
                    </td>
                    <td>{item.batch || '—'}</td>
                    <td>{item.productId || '—'}</td>
                    <td>
                      {item.usedAt ? (
                        <span style={{ color: '#86EFAC' }}>
                          Used{item.usedByEmail ? ` by ${item.usedByEmail}` : ''}
                        </span>
                      ) : (
                        <span style={{ color: '#B8B8B8' }}>Available</span>
                      )}
                    </td>
                    <td style={{ color: '#B8B8B8' }}>{formatTimestamp(item.createdAt)}</td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.4)',
                          backgroundColor: 'transparent',
                          color: '#F8F8F8',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#EF4444',
                          color: '#0A0A0A',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

