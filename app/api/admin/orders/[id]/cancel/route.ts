import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ORDER_STATUS, serializeOrder, sendOrderStatusEmail, type OrderStatus } from '@/lib/orders'

type RouteContext = {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAdmin()

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        user: true,
        promoCode: true,
        promotion: true,
        courier: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if already cancelled
    if (order.status === ORDER_STATUS.CANCELLED) {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 })
    }

    // Cancel order and restore inventory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update order status to CANCELLED
      const cancelledOrder = await tx.order.update({
        where: { id: params.id },
        data: { status: ORDER_STATUS.CANCELLED },
        include: {
          items: { include: { product: true } },
          user: true,
          promoCode: true,
          promotion: true,
          courier: true,
        },
      })

      // Restore inventory for all items
      await Promise.all(
        order.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { inventory: { increment: item.quantity } },
          }),
        ),
      )

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorId: session.id,
          action: 'cancel_order',
          targetId: params.id,
          details: JSON.stringify({
            previousStatus: order.status,
            newStatus: ORDER_STATUS.CANCELLED,
            itemsRestored: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        },
      })

      return cancelledOrder
    })

    // Send cancellation email
    sendOrderStatusEmail({ status: ORDER_STATUS.CANCELLED, order: result }).catch((err) =>
      console.error('Order cancellation email error', err),
    )

    return NextResponse.json({ order: serializeOrder(result) })
  } catch (error) {
    console.error('Cancel order error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }
}

