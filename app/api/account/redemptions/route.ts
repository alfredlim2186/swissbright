import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireAuth()

    const redemptions = await prisma.redemption.findMany({
      where: {
        userId: session.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        giftDesc: true,
        giftImageUrl: true,
        createdAt: true,
        updatedAt: true,
        courierName: true,
        trackingNumber: true,
        shippedAt: true,
      },
    })

    return NextResponse.json({ redemptions })
  } catch (error) {
    console.error('Get user redemptions error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Please log in' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    )
  }
}

