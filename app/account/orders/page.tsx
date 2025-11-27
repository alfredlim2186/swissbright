'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from '@/lib/useTranslations'

type OrderItem = {
  id: string
  productId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

type UserOrder = {
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

export default function MyOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch translations
  const { t } = useTranslations([
    'orders.backToAccount',
    'orders.shopNewDrops',
    'orders.orders',
    'orders.myOrders',
    'orders.description',
    'orders.noOrdersYet',
    'orders.browseCollection',
    'orders.goToShop',
    'orders.order',
    'orders.total',
    'orders.placed',
    'orders.noteFromSweetB',
    'orders.courier',
    'orders.pendingConfirmation',
    'orders.tracking',
    'orders.notAssignedYet',
    'orders.promo',
    'orders.saved',
    'orders.sale',
    'orders.items',
    'orders.loadingOrders',
    'orders.unableToLoadOrders',
  ])

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/orders', { cache: 'no-store' })

      if (res.status === 401) {
        router.push('/login?redirect=/account/orders')
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t('orders.unableToLoadOrders', 'Unable to load orders'))
      }

      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F8F8F8',
        }}
      >
        {t('orders.loadingOrders', 'Loading orders…')}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Link href="/account" style={{ color: '#B8B8B8', textDecoration: 'none' }}>
            {t('orders.backToAccount', '← Back to account')}
          </Link>
          <Link
            href="/shop"
            style={{
              padding: '0.65rem 1.5rem',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              color: '#C9A86A',
              textDecoration: 'none',
              borderRadius: '999px',
            }}
          >
            {t('orders.shopNewDrops', 'Shop new drops')}
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: '#B8B8B8', fontSize: '0.8rem' }}>{t('orders.orders', 'Orders')}</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#F8F8F8', marginBottom: '0.5rem' }}>
            {t('orders.myOrders', 'My Orders')}
          </h1>
          <p style={{ color: '#B8B8B8' }}>
            {t('orders.description', 'Cart submissions appear here as soon as you check out. Share payment advice via WhatsApp so we can confirm and ship.')}
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid rgba(248, 113, 113, 0.4)',
              color: '#FCA5A5',
              backgroundColor: 'rgba(248, 113, 113, 0.08)',
            }}
          >
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div
            style={{
              border: '1px dashed rgba(201, 168, 106, 0.4)',
              padding: '2.5rem',
              textAlign: 'center',
              color: '#B8B8B8',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
            <p style={{ marginBottom: '1rem' }}>{t('orders.noOrdersYet', 'No orders yet.')}</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t('orders.browseCollection', 'Browse the SweetB collection and place your first order.')}
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.75rem',
                backgroundColor: '#C9A86A',
                color: '#050505',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('orders.goToShop', 'Go to Shop')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order }: { order: UserOrder }) {
  const { t } = useTranslations([
    'orders.order',
    'orders.total',
    'orders.placed',
    'orders.noteFromSweetB',
    'orders.courier',
    'orders.pendingConfirmation',
    'orders.tracking',
    'orders.notAssignedYet',
    'orders.promo',
    'orders.saved',
    'orders.sale',
    'orders.items',
  ])

  const statusColor =
    {
      PROCESSING: '#FCD34D',
      CONFIRMED: '#86EFAC',
      SENT: '#93C5FD',
    }[order.status] || '#C9A86A'

  return (
    <div
      style={{
        border: '1px solid rgba(201,168,106,0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <p style={{ color: '#B8B8B8', letterSpacing: '3px', fontSize: '0.75rem' }}>{t('orders.order', 'ORDER')}</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#F8F8F8' }}>
            #{order.id.slice(-6).toUpperCase()}
          </h3>
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
            {t('orders.placed', 'Placed')} {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{t('orders.total', 'Total')}</p>
          <p style={{ fontSize: '1.4rem', color: '#F8F8F8', fontWeight: 600 }}>
            {new Intl.NumberFormat('en-MY', { style: 'currency', currency: order.currency }).format(order.total)}
          </p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.35rem',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {order.message && (
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
            <strong style={{ color: '#F8F8F8' }}>{t('orders.noteFromSweetB', 'Note from SweetB:')}</strong> {order.message}
          </p>
        )}
        <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
          <strong style={{ color: '#F8F8F8' }}>{t('orders.courier', 'Courier:')}</strong> {order.courierName || t('orders.pendingConfirmation', 'Pending confirmation')}
        </p>
        <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
          <strong style={{ color: '#F8F8F8' }}>{t('orders.tracking', 'Tracking:')}</strong> {order.trackingNumber || t('orders.notAssignedYet', 'Not assigned yet')}
        </p>
        {order.promoCode && (
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
            <strong style={{ color: '#F8F8F8' }}>{t('orders.promo', 'Promo:')}</strong> {order.promoCode.code} · {t('orders.saved', 'saved')}{' '}
            {new Intl.NumberFormat('en-MY', { style: 'currency', currency: order.currency }).format(order.promoCodeDiscount)}
          </p>
        )}
        {order.promotion && (
          <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
            <strong style={{ color: '#F8F8F8' }}>{t('orders.sale', 'Sale:')}</strong> {order.promotion.name} · {t('orders.saved', 'saved')}{' '}
            {new Intl.NumberFormat('en-MY', { style: 'currency', currency: order.currency }).format(order.promotionDiscount)}
          </p>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '1rem' }}>
        <p style={{ letterSpacing: '3px', color: '#B8B8B8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{t('orders.items', 'ITEMS')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#F8F8F8' }}
            >
              <div>
                <p style={{ margin: 0 }}>{item.name}</p>
                <p style={{ margin: 0, color: '#B8B8B8', fontSize: '0.85rem' }}>
                  {item.quantity} ×{' '}
                  {new Intl.NumberFormat('en-MY', { style: 'currency', currency: order.currency }).format(item.unitPrice)}
                </p>
              </div>
              <strong>
                {new Intl.NumberFormat('en-MY', { style: 'currency', currency: order.currency }).format(item.subtotal)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


