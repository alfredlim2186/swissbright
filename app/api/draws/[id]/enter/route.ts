import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()

    // Check if draw exists and is open
    const draw = await prisma.luckyDraw.findUnique({
      where: { id: params.id },
    })

    if (!draw) {
      return NextResponse.json(
        { error: 'Draw not found' },
        { status: 404 }
      )
    }

    if (draw.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'This draw is not accepting entries' },
        { status: 400 }
      )
    }

    // Check if already entered
    const existing = await prisma.luckyDrawEntry.findUnique({
      where: {
        drawId_userId: {
          drawId: params.id,
          userId: session.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already entered this draw' },
        { status: 400 }
      )
    }

    // Create entry
    const entry = await prisma.luckyDrawEntry.create({
      data: {
        drawId: params.id,
        userId: session.id,
        tickets: 1,
      },
    })

    return NextResponse.json({ ok: true, entry })
  } catch (error) {
    console.error('Enter draw error:', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Please log in first' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to enter draw' },
      { status: 500 }
    )
  }
}

