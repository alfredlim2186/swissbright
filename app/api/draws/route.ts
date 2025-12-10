import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if feature enabled
    const flag = await prisma.featureFlag.findUnique({
      where: { key: 'lucky_draw_enabled' },
    })

    if (!flag?.enabled) {
      return NextResponse.json({ enabled: false, draws: [] })
    }

    const session = await getSession()

    // Get open draws
    const draws = await prisma.luckyDraw.findMany({
      where: { status: 'OPEN' },
      include: {
        entries: session ? {
          where: { userId: session.id },
        } : false,
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const drawsWithStatus = draws.map(draw => ({
      id: draw.id,
      title: draw.title,
      description: draw.description,
      status: draw.status,
      maxWinners: draw.maxWinners,
      createdAt: draw.createdAt,
      hasEntered: session ? (draw.entries as any[]).length > 0 : false,
      totalEntries: draw._count.entries,
    }))

    return NextResponse.json(
      { 
        enabled: true,
        draws: drawsWithStatus,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Get draws error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch draws' },
      { status: 500 }
    )
  }
}

