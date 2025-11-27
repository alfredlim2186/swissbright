'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ConfirmModal from './ConfirmModal'

type OrderItem = {
  id: string
  productId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type AdminOrder = {
  id: string
  status: string
  statusLabel: string
  total: number
  currency: string
  message: string
  courierName: string
  trackingNumber: string
  paymentNote: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    name: string
    phoneNumber: string
  }
  items: OrderItem[]
  promoCode?: {
    code: string
    discountType: string
  } | null
  promoCodeDiscount: number
  promotion?: {
    id: string
    name: string
    discountType: string
  } | null
  promotionDiscount: number
}

type StatusFilter = {
  value: string
  label: string
}

const currency = (value: number, code = 'MYR') => new Intl.NumberFormat('en-MY', { style: 'currency', currency: code }).format(value)

export default function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [workingOrderId, setWorkingOrderId] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  const fetchOrders = useCallback(
    async (opts?: { status?: string; search?: string }) => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (opts?.status && opts.status !== 'ALL') params.append('status', opts.status)
        if (opts?.search) params.append('search', opts.search)

        const res = await fetch(`/api/admin/orders${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load orders')
        }
        const data = await res.json()
        setOrders(data.orders || [])
        setStatusFilters([{ value: 'ALL', label: 'All Orders' }, ...(data.statusFilters || [])])
        setError(null)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => (selectedStatus === 'ALL' ? true : order.status === selectedStatus))
      .filter((order) => {
        if (!search.trim()) return true
        const query = search.trim().toLowerCase()
        return order.id.toLowerCase().includes(query) || order.user.email.toLowerCase().includes(query)
      })
  }, [orders, selectedStatus, search])

  const statusCounts = useMemo(() => {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})
  }, [orders])

  const setBannerMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3500)
  }

  const handleSave = async (orderId: string, draft: Partial<AdminOrder>) => {
    try {
      setWorkingOrderId(orderId)
      const payload: Record<string, unknown> = {
        status: draft.status,
        courierName: draft.courierName,
        trackingNumber: draft.trackingNumber,
        paymentNote: draft.paymentNote,
        message: draft.message,
      }

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update order')
      }
      const data = await res.json()
      setOrders((prev) => prev.map((order) => (order.id === orderId ? data.order : order)))
      setBannerMessage('Order updated')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update order')
    } finally {
      setWorkingOrderId(null)
    }
  }

  const handleResend = async (orderId: string) => {
    try {
      setWorkingOrderId(orderId)
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resendEmail: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to resend email')
      }
      setBannerMessage('Email sent')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to resend email')
    } finally {
      setWorkingOrderId(null)
    }
  }

  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId)
    setCancelModalOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return

    try {
      setCancellingOrderId(orderToCancel)
      setCancelModalOpen(false)
      const res = await fetch(`/api/admin/orders/${orderToCancel}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to cancel order')
      }
      const data = await res.json()
      setOrders((prev) => prev.map((order) => (order.id === orderToCancel ? data.order : order)))
      setBannerMessage('Order cancelled and inventory restored')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to cancel order')
    } finally {
      setCancellingOrderId(null)
      setOrderToCancel(null)
    }
  }

  const handleCancelModalClose = () => {
    setCancelModalOpen(false)
    setOrderToCancel(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/admin" style={{ color: '#B8B8B8', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Dashboard
        </Link>

        <header style={{ marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#B8B8B8', fontSize: '0.8rem' }}>Logistics</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.75rem', color: '#F8F8F8', marginBottom: '0.5rem' }}>
            Orders & Fulfilment
          </h1>
          <p style={{ color: '#B8B8B8', maxWidth: '720px' }}>
            Each cart submission is captured as a Processing order. Verify payment, switch status to Confirmed, then add courier + tracking when Sent.
            Emails fire automatically, or resend them on demand.
          </p>
        </header>

        {(error || message) && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: `1px solid ${error ? '#FCA5A5' : 'rgba(201,168,106,0.4)'}`,
              color: error ? '#FCA5A5' : '#C9A86A',
              backgroundColor: error ? 'rgba(239,68,68,0.1)' : 'rgba(201,168,106,0.08)',
            }}
          >
            {error || message}
          </div>
        )}

        <section
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setSelectedStatus(filter.value)
                  fetchOrders({ status: filter.value, search })
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(201,168,106,0.4)',
                  backgroundColor: selectedStatus === filter.value ? '#C9A86A' : 'transparent',
                  color: selectedStatus === filter.value ? '#050505' : '#C9A86A',
                  fontWeight: 600,
                }}
              >
                {filter.label}
                {filter.value !== 'ALL' && (
                  <span style={{ marginLeft: '0.35rem', fontWeight: 400 }}>
                    {statusCounts[filter.value] ? `(${statusCounts[filter.value]})` : ''}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <input
              placeholder="Search ID or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: '#F8F8F8',
              }}
            />
            <button
              onClick={() => fetchOrders({ status: selectedStatus, search })}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(201,168,106,0.4)',
                background: 'transparent',
                color: '#C9A86A',
                fontWeight: 600,
              }}
            >
              Refresh
            </button>
          </div>
        </section>

        {loading ? (
          <div style={{ color: '#B8B8B8' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              border: '1px dashed rgba(255,255,255,0.2)',
              color: '#B8B8B8',
              textAlign: 'center',
            }}
          >
            No orders found. Encourage users to submit a cart via /shop.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSave={handleSave}
                onResend={handleResend}
                onCancel={handleCancelClick}
                saving={workingOrderId === order.id}
                cancelling={cancellingOrderId === order.id}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This will restore inventory and send a cancellation email to the customer. This action cannot be undone."
        confirmText="Cancel Order"
        cancelText="Keep Order"
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelModalClose}
        variant="danger"
      />
    </div>
  )
}

function OrderCard({
  order,
  onSave,
  onResend,
  onCancel,
  saving,
  cancelling,
}: {
  order: AdminOrder
  onSave: (orderId: string, draft: Partial<AdminOrder>) => Promise<void> | void
  onResend: (orderId: string) => Promise<void> | void
  onCancel: (orderId: string) => Promise<void> | void
  saving: boolean
  cancelling: boolean
}) {
  const [status, setStatus] = useState(order.status)
  const [courierName, setCourierName] = useState(order.courierName || '')
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [paymentNote, setPaymentNote] = useState(order.paymentNote || '')
  const [message, setMessage] = useState(order.message || '')

  useEffect(() => {
    setStatus(order.status)
    setCourierName(order.courierName || '')
    setTrackingNumber(order.trackingNumber || '')
    setPaymentNote(order.paymentNote || '')
    setMessage(order.message || '')
  }, [order])

  const statusColor = {
    PROCESSING: '#FCD34D',
    CONFIRMED: '#86EFAC',
    SENT: '#93C5FD',
    COMPLETED: '#10B981',
    CANCELLED: '#F87171',
  }[order.status] || '#B8B8B8'

  const isCancelled = order.status === 'CANCELLED'

  return (
    <div
      style={{
        border: '1px solid rgba(201,168,106,0.3)',
        background: 'rgba(255,255,255,0.02)',
        padding: '1.5rem',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <p style={{ letterSpacing: '3px', color: '#B8B8B8', fontSize: '0.75rem' }}>ORDER</p>
          <h3 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#F8F8F8' }}>
            #{order.id.slice(-6).toUpperCase()}
          </h3>
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
            {new Date(order.createdAt).toLocaleString()} • {order.user.email}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>Total</p>
          <p style={{ fontSize: '1.5rem', color: '#F8F8F8', fontWeight: 600 }}>{currency(order.total, order.currency)}</p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              border: `1px solid ${statusColor}`,
              color: statusColor,
              fontSize: '0.85rem',
            }}
          >
            {order.statusLabel}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        <label style={labelStyle}>
          <span>Status</span>
          <select 
            value={status} 
            onChange={(event) => setStatus(event.target.value)} 
            style={getInputStyle(isCancelled)}
            disabled={isCancelled}
          >
            <option value="PROCESSING">Processing / Order Received</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SENT">Sent</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
        <label style={labelStyle}>
          <span>Courier</span>
          <input 
            value={courierName} 
            onChange={(event) => setCourierName(event.target.value)} 
            style={getInputStyle(isCancelled)} 
            placeholder="e.g., DHL Express"
            disabled={isCancelled}
          />
        </label>
        <label style={labelStyle}>
          <span>Tracking Number</span>
          <input 
            value={trackingNumber} 
            onChange={(event) => setTrackingNumber(event.target.value)} 
            style={getInputStyle(isCancelled)} 
            placeholder="Tracking code"
            disabled={isCancelled}
          />
        </label>
        <label style={labelStyle}>
          <span>Internal Notes</span>
          <input 
            value={paymentNote} 
            onChange={(event) => setPaymentNote(event.target.value)} 
            style={getInputStyle(isCancelled)} 
            placeholder="Only admins see this"
            disabled={isCancelled}
          />
        </label>
      </div>

      <label style={{ ...labelStyle, marginBottom: '1rem' }}>
        <span>Customer Message (visible on receipt email)</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={2}
          style={{ ...getInputStyle(isCancelled), resize: 'vertical' }}
          placeholder="Optional note to customer"
          disabled={isCancelled}
        />
      </label>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {!isCancelled && (
          <>
            <button
              onClick={() =>
                onSave(order.id, {
                  status,
                  courierName,
                  trackingNumber,
                  paymentNote,
                  message,
                })
              }
              disabled={saving || cancelling}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#C9A86A',
                color: '#050505',
                fontWeight: 600,
                minWidth: '160px',
              }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={() => onResend(order.id)}
              disabled={saving || cancelling}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(201,168,106,0.4)',
                background: 'transparent',
                color: '#C9A86A',
                fontWeight: 600,
              }}
            >
              Resend Email
            </button>
            <button
              onClick={() => onCancel(order.id)}
              disabled={saving || cancelling}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(248, 113, 113, 0.5)',
                background: 'transparent',
                color: '#F87171',
                fontWeight: 600,
              }}
            >
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
            {order.status !== 'COMPLETED' && (
              <button
                onClick={() =>
                  onSave(order.id, {
                    status: 'COMPLETED',
                    courierName,
                    trackingNumber,
                    paymentNote,
                    message,
                  })
                }
                disabled={saving || cancelling}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  background: 'transparent',
                  color: '#10B981',
                  fontWeight: 600,
                }}
              >
                {saving ? 'Saving…' : 'Mark as Completed'}
              </button>
            )}
          </>
        )}
        {isCancelled && (
          <div style={{ 
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(248, 113, 113, 0.3)',
            background: 'rgba(248, 113, 113, 0.1)',
            color: '#F87171',
            fontWeight: 600,
          }}>
            This order has been cancelled
          </div>
        )}
      </div>

      {order.promoCode && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '0.75rem',
            marginBottom: '1rem',
            color: '#B8B8B8',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong style={{ color: '#F8F8F8' }}>Promo Code:</strong> {order.promoCode.code} · saved{' '}
            {currency(order.promoCodeDiscount, order.currency)}
          </p>
        </div>
      )}
      {order.promotion && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '0.75rem',
            marginBottom: '1rem',
            color: '#B8B8B8',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong style={{ color: '#F8F8F8' }}>Sale Promotion:</strong> {order.promotion.name} · saved{' '}
            {currency(order.promotionDiscount, order.currency)}
          </p>
        </div>
      )}

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
        <p style={{ letterSpacing: '3px', color: '#B8B8B8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ITEMS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#F8F8F8' }}>
              <div>
                <p style={{ margin: 0 }}>{item.name}</p>
                <p style={{ margin: 0, color: '#B8B8B8', fontSize: '0.85rem' }}>
                  {item.quantity} × {currency(item.unitPrice, order.currency)}
                </p>
              </div>
              <strong>{currency(item.subtotal, order.currency)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  color: '#B8B8B8',
  fontSize: '0.85rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.65rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.03)',
  color: '#F8F8F8',
}

const getInputStyle = (disabled: boolean): React.CSSProperties => ({
  ...inputStyle,
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'text',
})


