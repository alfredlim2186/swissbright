import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getAdminMetrics } from '@/lib/admin/metrics'
import Link from 'next/link'
import VisitorAnalytics from './analytics/VisitorAnalytics'

const currency = (value: number, code = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency: code }).format(value / 100)

export default async function AdminDashboard() {
  try {
    await requireAdmin()
  } catch {
    redirect('/login')
  }

  const metricsData = await getAdminMetrics()

  const headlineCards = [
    {
      label: 'Total Users',
      value: metricsData.totalUsers,
      sub: `+${metricsData.last7dUsers} this week`,
    },
    {
      label: 'Verified Purchases',
      value: metricsData.totalPurchases,
      sub: `+${metricsData.last7dPurchases} this week`,
    },
    {
      label: 'Orders in Processing',
      value: metricsData.ordersByStatus.PROCESSING,
      sub: `${metricsData.ordersByStatus.CONFIRMED} confirmed · ${metricsData.ordersByStatus.SENT} sent`,
    },
    {
      label: 'Pending Redemptions',
      value: metricsData.redemptionsByStatus.PENDING,
      sub: `${metricsData.redemptionsByStatus.SHIPPED} shipped`,
    },
  ]

  const orderStatusCards = [
    { label: 'Processing', value: metricsData.ordersByStatus.PROCESSING, color: '#FCD34D' },
    { label: 'Confirmed', value: metricsData.ordersByStatus.CONFIRMED, color: '#86EFAC' },
    { label: 'Sent', value: metricsData.ordersByStatus.SENT, color: '#93C5FD' },
    { label: 'Completed', value: metricsData.ordersByStatus.COMPLETED || 0, color: '#10B981' },
    { label: 'Sent', value: metricsData.ordersByStatus.SENT, color: '#93C5FD' },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '1rem 0 4rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <section
          style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ letterSpacing: '4px', color: '#b8b8b8', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Operations Overview
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.75rem', color: '#F8F8F8' }}>
              Morning, team ☕️
            </h1>
            <p style={{ color: '#B8B8B8', maxWidth: '600px' }}>
              Watch incoming orders, unlock milestones, and keep redemptions moving. All quick links now live in the sidebar—
              the dashboard stays focused on what needs attention.
            </p>
          </div>
          <div
            style={{
              border: '1px solid rgba(201,168,106,0.3)',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              color: '#C9A86A',
            }}
          >
            <div style={{ fontSize: '0.85rem', letterSpacing: '3px' }}>NEXT ACTION</div>
            <p style={{ marginTop: '0.5rem', color: '#F8F8F8', fontSize: '1rem' }}>
              {metricsData.pendingOrders.length > 0
                ? `Review ${metricsData.pendingOrders.length} pending order${
                    metricsData.pendingOrders.length > 1 ? 's' : ''
                  } and confirm payment advice.`
                : 'No pending orders—great time to plan the next drop.'}
            </p>
            <Link
              href="/admin/orders"
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                color: '#050505',
                backgroundColor: '#C9A86A',
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Open orders console →
            </Link>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          {headlineCards.map((card) => (
            <div
              key={card.label}
              style={{
                border: '1px solid rgba(201,168,106,0.25)',
                borderRadius: '14px',
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.35)',
              }}
            >
              <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{card.label}</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#F8F8F8', margin: '0.25rem 0' }}>{card.value}</p>
              <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{card.sub}</p>
            </div>
          ))}
        </section>

        <section
          style={{
            border: '1px solid rgba(201,168,106,0.25)',
            borderRadius: '16px',
            padding: '2rem',
            background: 'rgba(255,255,255,0.02)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#F8F8F8', marginBottom: '0.25rem' }}>
                Orders Snapshot
              </h2>
              <p style={{ color: '#B8B8B8' }}>
                Cart activity at a glance. Move processing orders forward to keep customers warm.
              </p>
            </div>
            <Link href="/admin/orders" style={{ color: '#C9A86A', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {orderStatusCards.map((card) => (
              <div
                key={card.label}
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}
              >
                <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{card.label}</p>
                <p style={{ fontSize: '2rem', margin: 0, color: card.color, fontWeight: 600 }}>{card.value}</p>
              </div>
            ))}
          </div>
          {metricsData.pendingOrders.length === 0 ? (
            <div
              style={{
                border: '1px dashed rgba(255,255,255,0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: '#B8B8B8',
                textAlign: 'center',
              }}
            >
              No processing orders right now. Enjoy the calm.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  color: '#F8F8F8',
                }}
              >
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: '#B8B8B8' }}>
                    <th style={{ paddingBottom: '0.75rem' }}>Order</th>
                    <th style={{ paddingBottom: '0.75rem' }}>Customer</th>
                    <th style={{ paddingBottom: '0.75rem' }}>Total</th>
                    <th style={{ paddingBottom: '0.75rem' }}>Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsData.pendingOrders.map((order) => (
                    <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>#{order.id.slice(-6).toUpperCase()}</td>
                      <td style={{ color: '#B8B8B8' }}>{order.userEmail}</td>
                    <td>{currency(order.totalCents, order.currency)}</td>
                      <td style={{ color: '#B8B8B8' }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {metricsData.milestones.map((milestone) => {
            const progress = Math.min(100, Math.round((milestone.current / milestone.target) * 100))
            return (
              <div
                key={milestone.label}
                style={{
                  border: '1px solid rgba(201,168,106,0.25)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  background: 'rgba(201,168,106,0.05)',
                }}
              >
                <p style={{ color: '#B8B8B8', fontSize: '0.85rem' }}>{milestone.label}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 600 }}>{milestone.current}</span>
                  <span style={{ fontSize: '0.85rem', color: '#B8B8B8' }}>Target: {milestone.target}</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    marginTop: '0.75rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg,#C9A86A,#F9D48D)',
                    }}
                  />
                </div>
                <p style={{ color: '#B8B8B8', fontSize: '0.8rem', marginTop: '0.5rem' }}>{milestone.detail}</p>
              </div>
            )
          })}
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              padding: '2rem',
              borderRadius: '16px',
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#C9A86A', marginBottom: '1.25rem' }}>
              Daily Registrations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(metricsData.registrationsByDay)
                .slice(-7)
                .map(([date, count]) => (
                  <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: '#B8B8B8', fontSize: '0.85rem', width: '80px' }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ flex: 1, height: '18px', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(
                            (count / Math.max(...Object.values(metricsData.registrationsByDay))) * 100,
                            100,
                          )}%`,
                          backgroundColor: '#86EFAC',
                        }}
                      />
                    </div>
                    <div style={{ width: '30px', textAlign: 'right', color: '#F8F8F8', fontWeight: 600 }}>{count}</div>
                  </div>
                ))}
            </div>
          <div style={{ marginTop: '0.75rem' }}>
            <Link
              href="/admin/verification-codes"
              style={{
                display: 'inline-block',
                color: '#F8F8F8',
                textDecoration: 'none',
                borderBottom: '1px dashed rgba(248, 248, 248, 0.6)',
                paddingBottom: '0.25rem',
                fontSize: '0.9rem',
              }}
            >
              Manage verification codes →
            </Link>
          </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              padding: '2rem',
              borderRadius: '16px',
            }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#C9A86A', marginBottom: '1.25rem' }}>
              Daily Purchase Verifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(metricsData.purchasesByDay)
                .slice(-7)
                .map(([date, count]) => (
                  <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: '#B8B8B8', fontSize: '0.85rem', width: '80px' }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ flex: 1, height: '18px', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(
                            (count / Math.max(...Object.values(metricsData.purchasesByDay))) * 100,
                            100,
                          )}%`,
                          backgroundColor: '#93C5FD',
                        }}
                      />
                    </div>
                    <div style={{ width: '30px', textAlign: 'right', color: '#F8F8F8', fontWeight: 600 }}>{count}</div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Visitor Analytics Section */}
        <section>
          <VisitorAnalytics />
        </section>
      </div>
    </div>
  )
}

