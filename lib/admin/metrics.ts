import { prisma } from '../db'

export async function getAdminMetrics() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    totalPurchases,
    last7dUsers,
    last7dPurchases,
    redemptionsByStatus,
    ordersByStatusRaw,
    processingOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.purchase.count({ where: { verifiedAt: { gte: sevenDaysAgo } } }),
    prisma.redemption.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.order.findMany({
      where: { status: 'PROCESSING' },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }),
  ])

  // Registrations by day (last 30 days)
  const registrations = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const registrationsByDay: Record<string, number> = {}
  registrations.forEach((user) => {
    const date = user.createdAt.toISOString().split('T')[0]
    registrationsByDay[date] = (registrationsByDay[date] || 0) + 1
  })

  // Purchases by day (last 30 days)
  const purchases = await prisma.purchase.findMany({
    where: { verifiedAt: { gte: thirtyDaysAgo } },
    select: { verifiedAt: true },
    orderBy: { verifiedAt: 'asc' },
  })

  const purchasesByDay: Record<string, number> = {}
  purchases.forEach((purchase) => {
    const date = purchase.verifiedAt.toISOString().split('T')[0]
    purchasesByDay[date] = (purchasesByDay[date] || 0) + 1
  })

  // Format redemptions by status
  const redemptionCounts = {
    PENDING: 0,
    APPROVED: 0,
    SHIPPED: 0,
    REJECTED: 0,
  }

  redemptionsByStatus.forEach((item) => {
    const status = item.status as keyof typeof redemptionCounts
    if (status in redemptionCounts) {
      redemptionCounts[status] = item._count
    }
  })

  const orderCounts = {
    PROCESSING: 0,
    CONFIRMED: 0,
    SENT: 0,
    COMPLETED: 0,
  }

  ordersByStatusRaw.forEach((item) => {
    const status = item.status as keyof typeof orderCounts
    if (status in orderCounts) {
      orderCounts[status] = item._count
    }
  })

  const pendingOrders = processingOrders.map((order) => ({
    id: order.id,
    userEmail: order.user.email,
    currency: order.currency,
    totalCents: order.totalCents,
    createdAt: order.createdAt.toISOString(),
  }))

  const milestones = [
    {
      label: 'Users to 1K goal',
      current: Math.min(totalUsers, 1000),
      target: 1000,
      detail: `${1000 - Math.min(totalUsers, 1000)} users to go`,
    },
    {
      label: 'Verified purchases to 5K',
      current: Math.min(totalPurchases, 5000),
      target: 5000,
      detail: `${5000 - Math.min(totalPurchases, 5000)} purchases remaining`,
    },
    {
      label: 'Weekly signups goal (50)',
      current: Math.min(last7dUsers, 50),
      target: 50,
      detail: `${Math.max(0, 50 - last7dUsers)} signups to target`,
    },
  ]

  return {
    totalUsers,
    totalPurchases,
    last7dUsers,
    last7dPurchases,
    redemptionsByStatus: redemptionCounts,
    registrationsByDay,
    purchasesByDay,
    ordersByStatus: orderCounts,
    pendingOrders,
    milestones,
  }
}




