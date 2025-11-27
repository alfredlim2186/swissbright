import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ORDER_STATUS, serializeOrder, sendOrderStatusEmail, type OrderStatus } from '@/lib/orders'
import { applyPromotionToPrice, getActivePromotion } from '@/lib/shop'

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  message: z.string().max(500).optional(),
  promoCode: z.string().max(32).optional(),
  courierId: z.string().optional(),
  shippingFeeCents: z.number().int().min(0).optional(),
})

export async function GET() {
  try {
    const session = await requireAuth()

    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        promoCode: true,
        promotion: true,
      },
    })

    return NextResponse.json({
      orders: orders.map(serializeOrder),
    })
  } catch (error) {
    console.error('Orders GET error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    const payload = await request.json()
    const data = createOrderSchema.parse(payload)

    const uniqueProductIds = Array.from(new Set(data.items.map((item) => item.productId)))
    const products = await prisma.product.findMany({
      where: {
        id: { in: uniqueProductIds },
        isActive: true,
      },
    })

    const productMap = new Map(products.map((product) => [product.id, product]))

    for (const item of data.items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 })
      }
      if (product.inventory < item.quantity) {
        return NextResponse.json({ error: `Insufficient inventory for ${product.name}` }, { status: 400 })
      }
    }

    const activePromotion = await getActivePromotion()
    let promotionDiscountCents = 0
    let totalCents = 0

    const orderItemsPayload = data.items.map((item) => {
      const product = productMap.get(item.productId)!
      const { final, discount } = applyPromotionToPrice(product.priceCents, activePromotion || undefined)
      promotionDiscountCents += discount * item.quantity
      totalCents += final * item.quantity
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceCents: final,
      }
    })

    const now = new Date()
    let promoCodeRecord: { id: string; discountType: string; discountValue: number } | null = null
    let promoCodeDiscountCents = 0

    if (data.promoCode) {
      const requestedCode = data.promoCode.trim().toUpperCase()
      if (!requestedCode) {
        return NextResponse.json({ error: 'Promo code cannot be empty' }, { status: 400 })
      }

      const promo = await prisma.promoCode.findFirst({
        where: {
          code: requestedCode,
          isActive: true,
          startAt: { lte: now },
          endAt: { gte: now },
        },
      })

      if (!promo) {
        return NextResponse.json({ error: 'Promo code is invalid or expired' }, { status: 400 })
      }

      // Check usage limit (based on completed orders)
      if (promo.maxUsage !== null && promo.completedUsageCount >= promo.maxUsage) {
        return NextResponse.json(
          { error: 'This promo code has reached its usage limit' },
          { status: 400 },
        )
      }

      // Check minimum spend requirement
      if (promo.minOrderCents && promo.minOrderCents > 0 && totalCents < promo.minOrderCents) {
        const minOrderMYR = (promo.minOrderCents / 100).toFixed(2)
        return NextResponse.json(
          { error: `Minimum order of MYR ${minOrderMYR} required to use this promo code` },
          { status: 400 },
        )
      }

      promoCodeRecord = {
        id: promo.id,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      }

      if (promo.discountType === 'PERCENTAGE') {
        promoCodeDiscountCents = Math.min(
          totalCents,
          Math.floor((totalCents * promo.discountValue) / 100),
        )
      } else {
        promoCodeDiscountCents = Math.min(totalCents, promo.discountValue)
      }
    }

    // Validate courier if provided
    let courierId: string | undefined = undefined
    let shippingFeeCents = data.shippingFeeCents ?? 0

    if (data.courierId) {
      const courier = await prisma.courier.findUnique({
        where: { id: data.courierId, isActive: true },
      })
      if (!courier) {
        return NextResponse.json({ error: 'Invalid courier selected' }, { status: 400 })
      }
      courierId = courier.id
      // Use courier fee if shippingFeeCents not provided, otherwise use provided value
      if (data.shippingFeeCents === undefined) {
        shippingFeeCents = courier.feeCents
      }
    }

    const finalTotalCents = Math.max(0, totalCents - promoCodeDiscountCents + shippingFeeCents)

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.id,
          status: ORDER_STATUS.PROCESSING,
          totalCents: finalTotalCents,
          message: data.message,
          courierId,
          shippingFeeCents,
          promoCodeId: promoCodeRecord?.id,
          promoCodeDiscountCents,
          promotionId: activePromotion?.id,
          promotionDiscountCents,
          items: {
            create: orderItemsPayload,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          user: true,
          promoCode: true,
          promotion: true,
          courier: true,
        },
      })

      // decrement inventory
      await Promise.all(
        data.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { inventory: { decrement: item.quantity } },
          }),
        ),
      )

      if (promoCodeRecord) {
        await tx.promoCode.update({
          where: { id: promoCodeRecord.id },
          data: { usageCount: { increment: 1 } },
        })
      }

      return order
    })

    // fire-and-forget email
    sendOrderStatusEmail({ status: ORDER_STATUS.PROCESSING as OrderStatus, order: result }).catch((err) =>
      console.error('Order email failed', err),
    )

    return NextResponse.json({ order: serializeOrder(result) })
  } catch (error) {
    console.error('Orders POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}


