import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_VALUES, serializeOrder } from '@/lib/orders'

const querySchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES).optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    })

    const where: any = {}
    if (parsed.success && parsed.data.status) {
      where.status = parsed.data.status
    }

    if (parsed.success && parsed.data.search) {
      const query = parsed.data.search
      where.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
      ]
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        items: { include: { product: true } },
        user: true,
        promoCode: true,
        promotion: true,
        courier: true,
      },
    })

    return NextResponse.json({
      orders: orders.map(serializeOrder),
      statusFilters: Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    })
  } catch (error) {
    console.error('Admin orders GET error:', error)
    if ((error as Error).message === 'Unauthorized' || (error as Error).message?.includes('Forbidden')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}


