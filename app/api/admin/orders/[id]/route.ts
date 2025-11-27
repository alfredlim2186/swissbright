import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ORDER_STATUS, ORDER_STATUS_VALUES, type OrderStatus, serializeOrder, sendOrderStatusEmail } from '@/lib/orders'

type RouteContext = {
  params: { id: string }
}

const updateSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES).optional().refine(
    (val) => val !== ORDER_STATUS.CANCELLED,
    { message: 'Use the cancel endpoint to cancel orders' }
  ),
  courierId: z.string().optional().nullable(),
  courierName: z.string().max(191).optional().nullable(),
  trackingNumber: z.string().max(191).optional().nullable(),
  shippingFeeCents: z.number().int().min(0).optional(),
  paymentNote: z.string().max(500).optional().nullable(),
  message: z.string().max(500).optional().nullable(),
  resendEmail: z.boolean().optional(),
})

const includeConfig = {
  items: { include: { product: true } },
  user: true,
  promoCode: true,
  promotion: true,
  courier: true,
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: includeConfig,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order: serializeOrder(order) })
  } catch (error) {
    console.error('Admin order GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await requireAdmin()
    const payload = await request.json()
    const data = updateSchema.parse(payload)

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: includeConfig,
    })

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updateData: Prisma.OrderUpdateInput = {}
    let nextStatus: OrderStatus | undefined

    if (data.status && data.status !== existing.status) {
      updateData.status = data.status
      nextStatus = data.status

      // If marking as COMPLETED, set completedAt and track usage
      if (data.status === ORDER_STATUS.COMPLETED && existing.status !== ORDER_STATUS.COMPLETED) {
        updateData.completedAt = new Date()
      }
    }

    if (data.courierId !== undefined) {
      updateData.courier = data.courierId ? { connect: { id: data.courierId } } : { disconnect: true }
    }
    if (data.courierName !== undefined) {
      updateData.courierName = data.courierName ?? null
    }
    if (data.trackingNumber !== undefined) {
      updateData.trackingNumber = data.trackingNumber ?? null
    }
    if (data.shippingFeeCents !== undefined) {
      updateData.shippingFeeCents = data.shippingFeeCents
      // Recalculate total if shipping fee changes
      const itemsTotal = existing.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
      const promoDiscount = existing.promoCodeDiscountCents
      const promoDiscountAmount = existing.promotionDiscountCents
      const newShippingFee = data.shippingFeeCents
      updateData.totalCents = Math.max(0, itemsTotal - promoDiscount - promoDiscountAmount + newShippingFee)
    }
    if (data.paymentNote !== undefined) {
      updateData.paymentNote = data.paymentNote ?? null
    }
    if (data.message !== undefined) {
      updateData.message = data.message ?? null
    }

    if (Object.keys(updateData).length === 0 && !data.resendEmail) {
      return NextResponse.json({ error: 'No changes detected' }, { status: 400 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: params.id },
        data: updateData,
        include: includeConfig,
      })

      // If order is being marked as COMPLETED, increment usage counts
      if (nextStatus === ORDER_STATUS.COMPLETED && existing.status !== ORDER_STATUS.COMPLETED) {
        // Track promo code usage
        if (order.promoCodeId) {
          await tx.promoCode.update({
            where: { id: order.promoCodeId },
            data: { completedUsageCount: { increment: 1 } },
          })
        }

        // Track promotion usage
        if (order.promotionId) {
          await tx.promotion.update({
            where: { id: order.promotionId },
            data: { completedUsageCount: { increment: 1 } },
          })
        }
      }

      return order
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'update_order',
        targetId: params.id,
        details: JSON.stringify({
          status: nextStatus ?? existing.status,
          courierName: updated.courierName,
          trackingNumber: updated.trackingNumber,
        }),
      },
    })

    if (nextStatus) {
      sendOrderStatusEmail({ status: nextStatus, order: updated }).catch((err) =>
        console.error('Order status email error', err),
      )
    } else if (data.resendEmail) {
      sendOrderStatusEmail({ status: updated.status as OrderStatus, order: updated }).catch((err) =>
        console.error('Order resend email error', err),
      )
    }

    return NextResponse.json({ order: serializeOrder(updated) })
  } catch (error) {
    console.error('Admin order PATCH error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}


