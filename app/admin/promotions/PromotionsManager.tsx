'use client'

import { useEffect, useMemo, useState } from 'react'

type Promotion = {
  id: string
  name: string
  description?: string | null
  startAt: string
  endAt: string
  timezone: string
  isActive: boolean
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  maxUsage?: number | null
  completedUsageCount?: number
  metrics: {
    orders: number
    revenue: number
    discountSaved: number
  }
}

type PromoCode = {
  id: string
  code: string
  description?: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderCents?: number
  startAt: string
  endAt: string
  timezone: string
  usageCount: number
  maxUsage?: number | null
  completedUsageCount?: number
  metrics: {
    orders: number
    discountGiven: number
  }
}

type Tab = 'promotions' | 'promoCodes'

const formatCurrency = (value: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(value / 100)

const formatMalaysiaDate = (iso: string, timezone: string) => {
  try {
    return new Intl.DateTimeFormat('en-MY', {
      timeZone: timezone || 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso))
  } catch {
    return new Date(iso).toLocaleString()
  }
}

const toMalaysiaISO = (value: string) => {
  if (!value) return ''
  // datetime-local format is YYYY-MM-DDTHH:mm
  // We need to add seconds and timezone offset for Malaysia (GMT+8)
  if (value.includes('T') && !value.includes('+') && !value.endsWith('Z')) {
    // Add seconds and Malaysia timezone
    return `${value}:00+08:00`
  }
  // If it's already in ISO format, return as-is
  return value
}

export default function PromotionsManager() {
  const [tab, setTab] = useState<Tab>('promotions')
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [promotionForm, setPromotionForm] = useState({
    name: '',
    description: '',
    startAt: '',
    endAt: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    maxUsage: '',
  })

  const [promoCodeForm, setPromoCodeForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrder: '',
    maxUsage: '',
    startAt: '',
    endAt: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [promotionRes, promoCodeRes] = await Promise.all([fetch('/api/admin/promotions'), fetch('/api/admin/promo-codes')])

      if (!promotionRes.ok) {
        const data = await promotionRes.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load promotions')
      }
      if (!promoCodeRes.ok) {
        const data = await promoCodeRes.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load promo codes')
      }

      const promoData = await promotionRes.json()
      const promoCodeData = await promoCodeRes.json()
      setPromotions(promoData.promotions || [])
      setPromoCodes(promoCodeData.promoCodes || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }

  const setBannerMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }

  const handlePromotionSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: promotionForm.name,
            description: promotionForm.description || undefined,
            startAt: toMalaysiaISO(promotionForm.startAt),
            endAt: toMalaysiaISO(promotionForm.endAt),
            discountType: promotionForm.discountType,
            discountValue: Number(promotionForm.discountValue),
            maxUsage: promotionForm.maxUsage ? Number(promotionForm.maxUsage) : null,
          }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create promotion')
      }

      setPromotionForm({
        name: '',
        description: '',
        startAt: '',
        endAt: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxUsage: '',
      })
      await fetchData()
      setBannerMessage('Promotion created.')
    } catch (err: any) {
      setError(err.message || 'Failed to create promotion')
    }
  }

  const handlePromoCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: promoCodeForm.code,
            description: promoCodeForm.description || undefined,
            discountType: promoCodeForm.discountType,
            discountValue: Number(promoCodeForm.discountValue),
            minOrder: promoCodeForm.minOrder ? Number(promoCodeForm.minOrder) : undefined,
            maxUsage: promoCodeForm.maxUsage ? Number(promoCodeForm.maxUsage) : null,
            startAt: toMalaysiaISO(promoCodeForm.startAt),
            endAt: toMalaysiaISO(promoCodeForm.endAt),
          }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Promo code creation error response:', data)
        const errorMsg = data.details 
          ? `${data.error || 'Failed to create promo code'}: ${data.details}` 
          : (data.error || 'Failed to create promo code')
        console.error('Error message:', errorMsg)
        throw new Error(errorMsg)
      }

      setPromoCodeForm({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrder: '',
        maxUsage: '',
        startAt: '',
        endAt: '',
      })
      await fetchData()
      setBannerMessage('Promo code created.')
    } catch (err: any) {
      setError(err.message || 'Failed to create promo code')
    }
  }

  const activePromotions = useMemo(
    () => promotions.filter((promo) => new Date(promo.endAt) >= new Date()),
    [promotions],
  )

  return (
    <div style={{ padding: '1rem 0 4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#B8B8B8', fontSize: '0.8rem' }}>
            Campaigns
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F8F8F8', marginBottom: '0.5rem' }}>
            Promotions & Promo Codes
          </h1>
          <p style={{ color: '#B8B8B8', maxWidth: '680px' }}>
            Launch timed campaigns, pair them with promo codes, and watch performance against Malaysian time automatically.
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

        <div
          style={{
            display: 'inline-flex',
            border: '1px solid rgba(201,168,106,0.3)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => setTab('promotions')}
            style={{
              padding: '0.65rem 1.5rem',
              border: 'none',
              backgroundColor: tab === 'promotions' ? '#C9A86A' : 'transparent',
              color: tab === 'promotions' ? '#050505' : '#C9A86A',
              cursor: 'pointer',
            }}
          >
            Sales Promotions
          </button>
          <button
            onClick={() => setTab('promoCodes')}
            style={{
              padding: '0.65rem 1.5rem',
              border: 'none',
              backgroundColor: tab === 'promoCodes' ? '#C9A86A' : 'transparent',
              color: tab === 'promoCodes' ? '#050505' : '#C9A86A',
              cursor: 'pointer',
            }}
          >
            Promo Codes
          </button>
        </div>

        {tab === 'promotions' ? (
          <>
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
                Create Promotion
              </h2>
              <p style={{ color: '#B8B8B8', marginBottom: '1.5rem' }}>
                Start and end times are stored as GMT+8 automatically. Metrics will include all orders created inside the window.
              </p>
              <form
                onSubmit={handlePromotionSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                  <label style={labelStyle}>
                    <span>Name *</span>
                    <input
                      style={inputStyle}
                      value={promotionForm.name}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>Discount Type</span>
                    <select
                      style={inputStyle}
                      value={promotionForm.discountType}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, discountType: e.target.value }))}
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed (MYR)</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    <span>
                      {promotionForm.discountType === 'PERCENTAGE' ? 'Percent (1-100)' : 'Value (MYR)'}
                    </span>
                    <input
                      style={inputStyle}
                      type="number"
                      min="1"
                      step="0.01"
                      value={promotionForm.discountValue}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>Start (MYT) *</span>
                    <input
                      type="datetime-local"
                      style={inputStyle}
                      value={promotionForm.startAt}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, startAt: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>End (MYT) *</span>
                    <input
                      type="datetime-local"
                      style={inputStyle}
                      value={promotionForm.endAt}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, endAt: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>Max Usage (Optional)</span>
                    <input
                      style={inputStyle}
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      value={promotionForm.maxUsage}
                      onChange={(e) => setPromotionForm((prev) => ({ ...prev, maxUsage: e.target.value }))}
                    />
                    <small style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Maximum number of completed orders. Leave empty for unlimited.
                    </small>
                  </label>
                </div>
                <label style={labelStyle}>
                  <span>Description</span>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px' }}
                    value={promotionForm.description}
                    onChange={(e) => setPromotionForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </label>
                <button
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#C9A86A',
                    color: '#050505',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Launch Promotion
                </button>
              </form>
            </section>

            <section>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8', marginBottom: '0.3rem' }}>
                  Active Promotions ({activePromotions.length})
                </h3>
                <p style={{ color: '#B8B8B8' }}>Revenue and order counts update automatically based on Malaysia time.</p>
              </div>
              {loading ? (
                <div style={cardStyle}>Loading…</div>
              ) : promotions.length === 0 ? (
                <div style={cardStyle}>No promotions yet. Launch one above.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {promotions.map((promo) => (
                    <div key={promo.id} style={cardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#F8F8F8', marginBottom: '0.3rem' }}>
                            {promo.name}
                          </h4>
                          <p style={{ color: '#B8B8B8', marginBottom: '0.5rem' }}>
                            {formatMalaysiaDate(promo.startAt, promo.timezone)} →{' '}
                            {formatMalaysiaDate(promo.endAt, promo.timezone)}
                          </p>
                          {promo.description && <p style={{ color: '#B8B8B8' }}>{promo.description}</p>}
                          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
                            Discount:{' '}
                            {promo.discountType === 'PERCENTAGE'
                              ? `${promo.discountValue}% off`
                              : `${formatCurrency(promo.discountValue)} off`}
                          </p>
                          {promo.maxUsage !== null && promo.maxUsage !== undefined && (
                            <p style={{ color: promo.completedUsageCount && promo.completedUsageCount >= promo.maxUsage ? '#FCA5A5' : '#C9A86A', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>
                              Usage: {promo.completedUsageCount ?? 0} / {promo.maxUsage} completed orders
                              {promo.completedUsageCount && promo.completedUsageCount >= promo.maxUsage && ' (Limit Reached)'}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#B8B8B8', fontSize: '0.9rem' }}>Orders</p>
                          <p style={{ fontSize: '1.6rem', margin: 0, color: '#F8F8F8', fontWeight: 600 }}>{promo.metrics.orders}</p>
                          <p style={{ margin: 0, color: '#B8B8B8' }}>Revenue {formatCurrency(promo.metrics.revenue)}</p>
                          <p style={{ margin: 0, color: '#B8B8B8', fontSize: '0.85rem' }}>
                            Customers saved {formatCurrency(promo.metrics.discountSaved)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <>
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
                Create Promo Code
              </h2>
              <p style={{ color: '#B8B8B8', marginBottom: '1.5rem' }}>
                Codes validate using Malaysia time. Fixed discounts should be entered in MYR; percentages cap at 100.
              </p>
              <form
                onSubmit={handlePromoCodeSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                  <label style={labelStyle}>
                    <span>Code *</span>
                    <input
                      style={inputStyle}
                      value={promoCodeForm.code}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, code: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>Discount Type</span>
                    <select
                      style={inputStyle}
                      value={promoCodeForm.discountType}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, discountType: e.target.value }))}
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed (MYR)</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    <span>
                      {promoCodeForm.discountType === 'PERCENTAGE' ? 'Percent (1-100)' : 'Value (MYR)'}
                    </span>
                    <input
                      style={inputStyle}
                      type="number"
                      min="1"
                      step="0.01"
                      value={promoCodeForm.discountValue}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, discountValue: e.target.value }))}
                      required
                    />
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
                  <label style={labelStyle}>
                    <span>Minimum Spend (MYR)</span>
                    <input
                      style={inputStyle}
                      type="number"
                      min="0"
                      step="0.01"
                      value={promoCodeForm.minOrder}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, minOrder: e.target.value }))}
                      placeholder="0.00"
                    />
                    <small style={{ color: '#B8B8B8', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      Leave empty for no minimum
                    </small>
                  </label>
                  <label style={labelStyle}>
                    <span>Max Usage (Optional)</span>
                    <input
                      style={inputStyle}
                      type="number"
                      min="1"
                      placeholder="Leave empty for unlimited"
                      value={promoCodeForm.maxUsage}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, maxUsage: e.target.value }))}
                    />
                    <small style={{ color: '#B8B8B8', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Maximum number of completed orders. Leave empty for unlimited.
                    </small>
                  </label>
                  <label style={labelStyle}>
                    <span>Start (MYT) *</span>
                    <input
                      type="datetime-local"
                      style={inputStyle}
                      value={promoCodeForm.startAt}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, startAt: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={labelStyle}>
                    <span>End (MYT) *</span>
                    <input
                      type="datetime-local"
                      style={inputStyle}
                      value={promoCodeForm.endAt}
                      onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, endAt: e.target.value }))}
                      required
                    />
                  </label>
                </div>
                <label style={labelStyle}>
                  <span>Description</span>
                  <textarea
                    style={{ ...inputStyle, minHeight: '80px' }}
                    value={promoCodeForm.description}
                    onChange={(e) => setPromoCodeForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </label>
                <button
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#C9A86A',
                    color: '#050505',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Promo Code
                </button>
              </form>
            </section>

            <section>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8', marginBottom: '0.3rem' }}>
                  Promo Codes ({promoCodes.length})
                </h3>
                <p style={{ color: '#B8B8B8' }}>Includes total orders using the code and cumulative discount given.</p>
              </div>
              {loading ? (
                <div style={cardStyle}>Loading…</div>
              ) : promoCodes.length === 0 ? (
                <div style={cardStyle}>No promo codes yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {promoCodes.map((code) => (
                    <div key={code.id} style={cardStyle}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#F8F8F8' }}>
                            {code.code}
                          </h4>
                          <p style={{ color: '#B8B8B8', marginBottom: '0.5rem' }}>
                            {formatMalaysiaDate(code.startAt, code.timezone)} →{' '}
                            {formatMalaysiaDate(code.endAt, code.timezone)}
                          </p>
                          {code.description && <p style={{ color: '#B8B8B8' }}>{code.description}</p>}
                          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
                            Discount:{' '}
                            {code.discountType === 'PERCENTAGE'
                              ? `${code.discountValue}%`
                              : formatCurrency(code.discountValue)}
                            {code.minOrderCents && code.minOrderCents > 0 && (
                              <span style={{ display: 'block', marginTop: '0.25rem' }}>
                                Min. spend: {formatCurrency(code.minOrderCents)}
                              </span>
                            )}
                          </p>
                          {code.maxUsage !== null && code.maxUsage !== undefined && (
                            <p style={{ color: code.completedUsageCount && code.completedUsageCount >= code.maxUsage ? '#FCA5A5' : '#C9A86A', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 500 }}>
                              Usage: {code.completedUsageCount ?? 0} / {code.maxUsage} completed orders
                              {code.completedUsageCount && code.completedUsageCount >= code.maxUsage && ' (Limit Reached)'}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, color: '#B8B8B8', fontSize: '0.9rem' }}>Orders</p>
                          <p style={{ fontSize: '1.6rem', margin: 0, color: '#F8F8F8', fontWeight: 600 }}>{code.metrics.orders}</p>
                          <p style={{ margin: 0, color: '#B8B8B8' }}>
                            Discount given {formatCurrency(code.metrics.discountGiven)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  color: '#B8B8B8',
  fontSize: '0.85rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  backgroundColor: 'rgba(255,255,255,0.02)',
  color: '#F8F8F8',
  colorScheme: 'dark', // Helps with datetime-local picker visibility
  cursor: 'pointer', // Make it clear the input is clickable
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '1.5rem',
  backgroundColor: 'rgba(0,0,0,0.4)',
  color: '#F8F8F8',
}


