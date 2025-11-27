import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

const createPromotionSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().max(500).optional().nullable(),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  timezone: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  maxUsage: z.number().int().min(1).optional().nullable(), // null = unlimited
})

const appendMalaysiaOffset = (value: string) => {
  if (!value) throw new Error('Invalid date')
  if (value.endsWith('Z') || value.includes('+')) return value
  return `${value}:00+08:00`
}

const serializePromotion = (
  promotion: any,
  metrics: { orders: number; revenue: number; discountSaved: number },
) => ({
  id: promotion.id,
  name: promotion.name,
  description: promotion.description,
  startAt: promotion.startAt.toISOString(),
  endAt: promotion.endAt.toISOString(),
  timezone: promotion.timezone,
  isActive: promotion.isActive,
  discountType: promotion.discountType,
  discountValue: promotion.discountValue,
  maxUsage: promotion.maxUsage,
  completedUsageCount: promotion.completedUsageCount ?? 0,
  createdAt: promotion.createdAt.toISOString(),
  updatedAt: promotion.updatedAt.toISOString(),
  metrics,
})

export async function GET() {
  try {
    await requireAdmin()
    const promotions = await prisma.promotion.findMany({
      orderBy: { startAt: 'desc' },
    })

    const result = await Promise.all(
      promotions.map(async (promotion) => {
        const analytics = await prisma.order.aggregate({
          _count: true,
          _sum: { totalCents: true, promotionDiscountCents: true },
          where: {
            promotionId: promotion.id,
          },
        })

        return serializePromotion(promotion, {
          orders: analytics._count,
          revenue: analytics._sum.totalCents ?? 0,
          discountSaved: analytics._sum.promotionDiscountCents ?? 0,
        })
      }),
    )

    return NextResponse.json({ promotions: result })
  } catch (error) {
    console.error('Admin promotions GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load promotions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const payload = await request.json()
    const data = createPromotionSchema.parse(payload)

    const startAt = new Date(appendMalaysiaOffset(data.startAt))
    const endAt = new Date(appendMalaysiaOffset(data.endAt))

    if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
      return NextResponse.json({ error: 'Invalid date provided' }, { status: 400 })
    }

    if (endAt <= startAt) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    const discountValue =
      data.discountType === 'PERCENTAGE'
        ? Math.min(100, Math.max(1, Math.round(data.discountValue)))
        : Math.round(data.discountValue * 100)
    const maxUsage = data.maxUsage === null || data.maxUsage === undefined ? null : Math.max(1, Math.round(data.maxUsage))

    const promotion = await prisma.promotion.create({
      data: {
        name: data.name,
        description: data.description || null,
        startAt,
        endAt,
        timezone: data.timezone || 'Asia/Kuala_Lumpur',
        discountType: data.discountType,
        discountValue,
        maxUsage,
      },
    })

    return NextResponse.json(
      serializePromotion(promotion, {
        orders: 0,
        revenue: 0,
        discountSaved: 0,
      }),
    )
  } catch (error) {
    console.error('Admin promotions POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
  }
}


