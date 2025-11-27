import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ORDER_STATUS } from '@/lib/orders'

export const dynamic = 'force-dynamic'

/**
 * Auto-complete orders that are 14 days old and not cancelled
 * This endpoint should be called periodically (e.g., via cron job)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    // Find orders that are:
    // - At least 14 days old
    // - Not already completed
    // - Not cancelled
    // - Have status PROCESSING, CONFIRMED, or SENT
    const ordersToComplete = await prisma.order.findMany({
      where: {
        createdAt: { lte: fourteenDaysAgo },
        status: {
          notIn: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
        },
        completedAt: null,
      },
      include: {
        promoCode: true,
        promotion: true,
      },
    })

    if (ordersToComplete.length === 0) {
      return NextResponse.json({
        message: 'No orders to auto-complete',
        completed: 0,
      })
    }

    // Complete orders and track usage in a transaction
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        ordersToComplete.map((order) => {
          const updates: Promise<any>[] = [
            tx.order.update({
              where: { id: order.id },
              data: {
                status: ORDER_STATUS.COMPLETED,
                completedAt: new Date(),
              },
            }),
          ]

          if (order.promoCodeId) {
            updates.push(
              tx.promoCode.update({
                where: { id: order.promoCodeId },
                data: { completedUsageCount: { increment: 1 } },
              }),
            )
          }

          if (order.promotionId) {
            updates.push(
              tx.promotion.update({
                where: { id: order.promotionId },
                data: { completedUsageCount: { increment: 1 } },
              }),
            )
          }

          return Promise.all(updates)
        }),
      )
    })

    return NextResponse.json({
      message: `Auto-completed ${ordersToComplete.length} order(s)`,
      completed: ordersToComplete.length,
      orderIds: ordersToComplete.map((o) => o.id),
    })
  } catch (error) {
    console.error('Auto-complete orders error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to auto-complete orders' }, { status: 500 })
  }
}

/**
 * GET endpoint to preview which orders would be auto-completed
 */
export async function GET() {
  try {
    await requireAdmin()

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const ordersToComplete = await prisma.order.findMany({
      where: {
        createdAt: { lte: fourteenDaysAgo },
        status: {
          notIn: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
        },
        completedAt: null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        totalCents: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      count: ordersToComplete.length,
      orders: ordersToComplete,
      cutoffDate: fourteenDaysAgo.toISOString(),
    })
  } catch (error) {
    console.error('Auto-complete preview error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to preview auto-complete orders' }, { status: 500 })
  }
}


