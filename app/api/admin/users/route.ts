import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

const SORTABLE_COLUMNS = new Set([
  'email',
  'name',
  'totalPurchases',
  'totalGifts',
  'createdAt',
])
type Sortable = 'email' | 'name' | 'totalPurchases' | 'totalGifts' | 'createdAt'

const DELIVERY_FIELDS = [
  'phoneNumber',
  'addressLine1',
  'city',
  'state',
  'postalCode',
  'country',
]

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = request.nextUrl
    const sortParam = (searchParams.get('sort') as Sortable | null) || 'createdAt'
    const directionParam = searchParams.get('direction') === 'asc' ? 'asc' : 'desc'
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const completeOnly = searchParams.get('complete') === 'true'

    const where: any = {}
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`)
    }

    if (completeOnly) {
      where.AND = DELIVERY_FIELDS.map((field) => ({
        [field]: { not: null },
      }))
    }

    const sortKey: Sortable = SORTABLE_COLUMNS.has(sortParam) ? sortParam : 'createdAt'
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortKey]: directionParam,
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        totalPurchases: true,
        totalGifts: true,
        createdAt: true,
        role: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        profileUpdatedAt: true,
      },
      orderBy,
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

