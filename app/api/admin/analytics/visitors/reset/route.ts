import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const { period } = body // 'all', 'month', 'week'

    let where: { createdAt?: { gte?: Date; lt?: Date } } = {}

    if (period === 'month') {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      where = { createdAt: { gte: startOfMonth } }
    } else if (period === 'week') {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      where = { createdAt: { gte: weekAgo } }
    }
    // If period is 'all', where remains empty (delete all)

    // Delete visits
    const result = await prisma.visit.deleteMany({ where })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'reset_visitor_stats',
        details: JSON.stringify({
          period,
          deletedCount: result.count,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('Reset visitor stats error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to reset visitor stats' }, { status: 500 })
  }
}

