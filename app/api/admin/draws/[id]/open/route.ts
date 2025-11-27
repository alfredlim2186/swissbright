import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()

    const draw = await prisma.luckyDraw.update({
      where: { id: params.id },
      data: { status: 'OPEN' },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'open_draw',
        targetId: params.id,
        details: JSON.stringify({ drawId: params.id }),
      },
    })

    return NextResponse.json({ ok: true, draw })
  } catch (error) {
    console.error('Open draw error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to open draw' },
      { status: 500 }
    )
  }
}

