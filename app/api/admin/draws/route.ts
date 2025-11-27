import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const createDrawSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  maxWinners: z.number().int().min(1).default(1),
})

export async function GET() {
  try {
    await requireAdmin()

    const draws = await prisma.luckyDraw.findMany({
      include: {
        _count: {
          select: {
            entries: true,
            winners: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ draws })
  } catch (error) {
    console.error('Get draws error:', error)
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch draws' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const { title, description, maxWinners } = createDrawSchema.parse(body)

    const draw = await prisma.luckyDraw.create({
      data: {
        title,
        description: description || null,
        maxWinners,
        status: 'DRAFT',
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: 'create_draw',
        targetId: draw.id,
        details: JSON.stringify({ title, maxWinners }),
      },
    })

    return NextResponse.json({ ok: true, draw })
  } catch (error) {
    console.error('Create draw error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    if ((error as Error).message?.includes('Forbidden') || (error as Error).message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create draw' },
      { status: 500 }
    )
  }
}

