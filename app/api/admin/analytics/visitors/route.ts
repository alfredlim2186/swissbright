import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all' // all, month, week

    const now = new Date()
    let startDate: Date | null = null

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Build where clause
    const where = startDate ? { createdAt: { gte: startDate } } : {}

    // Get total visits - safe with default
    let totalVisits = 0
    try {
      totalVisits = await prisma.visit.count({ where })
    } catch (err) {
      console.error('Error counting visits:', err)
      totalVisits = 0
    }

    // Get unique visitors (count distinct visitorId)
    let uniqueVisitors = 0
    try {
      const uniqueVisitorsResult = await prisma.visit.groupBy({
        by: ['visitorId'],
        where,
        _count: true,
      })
      uniqueVisitors = Array.isArray(uniqueVisitorsResult) ? uniqueVisitorsResult.length : 0
    } catch (err) {
      console.error('Error getting unique visitors:', err)
      uniqueVisitors = 0
    }

    // Get visits by day for trend
    let visitsByDay: Record<string, { total: number; unique: number }> = {}
    try {
      const visits = await prisma.visit.findMany({
        where,
        select: { createdAt: true, visitorId: true },
        orderBy: { createdAt: 'asc' },
      })

      const uniqueVisitorsByDay: Record<string, Set<string>> = {}

      visits.forEach((visit) => {
        if (!visit || !visit.createdAt || !visit.visitorId) return
        const date = visit.createdAt.toISOString().split('T')[0]
        if (!visitsByDay[date]) {
          visitsByDay[date] = { total: 0, unique: 0 }
          uniqueVisitorsByDay[date] = new Set()
        }
        visitsByDay[date].total++
        uniqueVisitorsByDay[date].add(visit.visitorId)
      })

      // Convert sets to counts
      Object.keys(visitsByDay).forEach((date) => {
        if (uniqueVisitorsByDay[date]) {
          visitsByDay[date].unique = uniqueVisitorsByDay[date].size
        }
      })
    } catch (err) {
      console.error('Error getting visits by day:', err)
      visitsByDay = {}
    }

    // Get top pages
    let topPages: Array<{ page: string; count: number }> = []
    try {
      const topPagesRaw = await prisma.visit.groupBy({
        by: ['page'],
        where,
        _count: true,
      })

      // Safely process top pages
      if (Array.isArray(topPagesRaw)) {
        topPages = topPagesRaw
          .map((item) => {
            if (!item) return null
            const count = typeof item._count === 'number' ? item._count : 0
            return {
              page: item.page || '(unknown)',
              count,
            }
          })
          .filter((item): item is { page: string; count: number } => item !== null)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }
    } catch (err) {
      console.error('Error getting top pages:', err)
      topPages = []
    }

    // Calculate trends (compare with previous period)
    let previousPeriodVisits = 0
    let previousPeriodUnique = 0

    try {
      if (period === 'month') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const lastMonthVisits = await prisma.visit.count({
          where: {
            createdAt: { gte: lastMonth, lt: thisMonthStart },
          },
        })
        
        const lastMonthUnique = await prisma.visit.groupBy({
          by: ['visitorId'],
          where: {
            createdAt: { gte: lastMonth, lt: thisMonthStart },
          },
          _count: true,
        })
        
        previousPeriodVisits = lastMonthVisits || 0
        previousPeriodUnique = Array.isArray(lastMonthUnique) ? lastMonthUnique.length : 0
      } else if (period === 'week') {
        const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        const lastWeekVisits = await prisma.visit.count({
          where: {
            createdAt: { gte: lastWeekStart, lt: thisWeekStart },
          },
        })
        
        const lastWeekUnique = await prisma.visit.groupBy({
          by: ['visitorId'],
          where: {
            createdAt: { gte: lastWeekStart, lt: thisWeekStart },
          },
          _count: true,
        })
        
        previousPeriodVisits = lastWeekVisits || 0
        previousPeriodUnique = Array.isArray(lastWeekUnique) ? lastWeekUnique.length : 0
      } else {
        // For "all time", compare with last 30 days
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        const before30Days = await prisma.visit.count({
          where: {
            createdAt: { lt: last30Days },
          },
        })
        
        const before30DaysUnique = await prisma.visit.groupBy({
          by: ['visitorId'],
          where: {
            createdAt: { lt: last30Days },
          },
          _count: true,
        })
        
        previousPeriodVisits = before30Days || 0
        previousPeriodUnique = Array.isArray(before30DaysUnique) ? before30DaysUnique.length : 0
      }
    } catch (err) {
      console.error('Error calculating trends:', err)
      previousPeriodVisits = 0
      previousPeriodUnique = 0
    }

    const visitTrend =
      previousPeriodVisits > 0
        ? ((totalVisits - previousPeriodVisits) / previousPeriodVisits) * 100
        : totalVisits > 0
          ? 100
          : 0

    const uniqueTrend =
      previousPeriodUnique > 0
        ? ((uniqueVisitors - previousPeriodUnique) / previousPeriodUnique) * 100
        : uniqueVisitors > 0
          ? 100
          : 0

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      visitsByDay,
      topPages,
      trends: {
        visits: Math.round(visitTrend * 100) / 100,
        unique: Math.round(uniqueTrend * 100) / 100,
      },
    })
  } catch (error) {
    console.error('Get visitor stats error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    // Check if it's a Prisma error about missing table
    if (error instanceof Error && error.message.includes('Visit')) {
      return NextResponse.json(
        { 
          error: 'Visit table not found. Please run database migration: npx prisma migrate dev',
          details: error.message 
        },
        { status: 500 }
      )
    }
    
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to get visitor stats',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
